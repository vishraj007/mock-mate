import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { join } from "path";
import { writeFile, readFile, readdir, unlink, mkdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

ffmpeg.setFfmpegPath(ffmpegPath);

const ffprobeBin = process.platform === "win32" ? "ffprobe.exe" : "ffprobe";
const ffprobeExePath = join(
  process.cwd(),
  "node_modules",
  "ffprobe-static",
  "bin",
  process.platform,
  process.arch,
  ffprobeBin
);
ffmpeg.setFfprobePath(ffprobeExePath);

const CHUNK_DURATION_S = 25;

// ─── helpers ────────────────────────────────────────────────────────────────

function probeAudio(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, meta) => {
      if (err) reject(err);
      else resolve(meta.format.duration ?? 0);
    });
  });
}

function splitToWavChunks(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .outputOptions([
        "-f segment",
        `-segment_time ${CHUNK_DURATION_S}`,
        "-reset_timestamps 1",
      ])
      .output(join(outputDir, "chunk_%03d.wav"))
      .on("start", (cmd) => console.log("ffmpeg cmd:", cmd))
      .on("end", resolve)
      .on("error", (err) => {
        console.error("ffmpeg split error:", err.message);
        reject(err);
      })
      .run();
  });
}

async function transcribeFile(filePath, apiKey) {
  const buf = await readFile(filePath);
  console.log(`  → sending ${(buf.length / 1024).toFixed(1)} KB to Sarvam`);

  const file = new File([buf], "audio.wav", { type: "audio/wav" });
  const form = new FormData();
  form.append("file", file);
  form.append("language_code", "en-IN");
  form.append("model", "saaras:v3");

  const res = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: { "api-subscription-key": apiKey },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sarvam STT ${res.status}: ${errText}`);
  }

  const data = await res.json();
  console.log("  → Sarvam response:", JSON.stringify(data));
  return data.transcript ?? "";
}

// ─── route ──────────────────────────────────────────────────────────────────

export async function POST(req) {
  const workDir = join(tmpdir(), `sarvam-${randomUUID()}`);
  let inputPath = null;

  try {
    const formData = await req.formData();
    const audioFile = formData.get("file");

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "Audio file is required" },
        { status: 400 }
      );
    }

    console.log(
      `Received audio: name=${audioFile.name} type=${audioFile.type} size=${audioFile.size} bytes`
    );

    // Bail early if the recording is empty
    if (audioFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Audio file is empty — nothing was recorded" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SARVAM_API_KEY;
    const ext = audioFile.name?.split(".").pop() ?? "webm";
    inputPath = join(tmpdir(), `sarvam-input-${randomUUID()}.${ext}`);
    await writeFile(inputPath, Buffer.from(await audioFile.arrayBuffer()));
    console.log(`Saved to: ${inputPath}`);

    let transcript = "";

    // Try to probe duration; fall back to direct transcription if ffprobe fails
    let duration = null;
    try {
      duration = await probeAudio(inputPath);
      console.log(`Duration: ${duration.toFixed(2)}s`);
    } catch (probeErr) {
      console.warn("ffprobe failed, skipping chunk split:", probeErr.message);
    }

    if (duration !== null && duration > CHUNK_DURATION_S) {
      // Long audio — split into chunks
      console.log(`Splitting into ${CHUNK_DURATION_S}s chunks…`);
      await mkdir(workDir, { recursive: true });
      await splitToWavChunks(inputPath, workDir);

      const chunkPaths = (await readdir(workDir))
        .filter((f) => f.endsWith(".wav"))
        .sort()
        .map((f) => join(workDir, f));

      console.log(`Transcribing ${chunkPaths.length} chunk(s)…`);
      const parts = await Promise.all(
        chunkPaths.map((p, i) => {
          console.log(`Chunk ${i + 1}/${chunkPaths.length}: ${p}`);
          return transcribeFile(p, apiKey);
        })
      );
      transcript = parts.filter(Boolean).join(" ").trim();
    } else {
      // Short audio (or ffprobe unavailable) — send directly
      console.log("Transcribing directly (no chunking)…");
      transcript = await transcribeFile(inputPath, apiKey);
    }

    console.log(`Final transcript (${transcript.length} chars): "${transcript}"`);

    return NextResponse.json({ success: true, transcript });
  } catch (error) {
    console.error("Sarvam STT error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message ?? "Speech-to-text failed" },
      { status: 500 }
    );
  } finally {
    if (inputPath) await unlink(inputPath).catch(() => {});
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
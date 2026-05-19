import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, speaker = "priya" } = await req.json(); // ✅ changed from "anushka"

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: "en-IN",
        speaker: speaker,
        model: "bulbul:v3",
        pace: 1.1,
        enable_preprocessing: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam TTS error:", errorText);
      throw new Error(`Sarvam TTS returned ${response.status}`);
    }

    const data = await response.json();
    const audioBase64 = data.audios?.[0] || "";

    return NextResponse.json({
      success: true,
      audio: audioBase64,
    });
  } catch (error) {
    console.error("Sarvam TTS route error:", error);
    return NextResponse.json(
      { success: false, error: "Text-to-speech failed" },
      { status: 500 }
    );
  }
}
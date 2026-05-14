import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file");

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "Audio file is required" },
        { status: 400 }
      );
    }

    const sarvamFormData = new FormData();
    sarvamFormData.append("file", audioFile);
    sarvamFormData.append("language_code", "en-IN");
    sarvamFormData.append("model", "saaras:v3");

    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: sarvamFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam STT error:", errorText);
      throw new Error(`Sarvam STT returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      transcript: data.transcript || "",
    });
  } catch (error) {
    console.error("Sarvam STT route error:", error);
    return NextResponse.json(
      { success: false, error: "Speech-to-text failed" },
      { status: 500 }
    );
  }
}
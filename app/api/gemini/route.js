import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { success: false, error: "Prompt is missing" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = "gemini-2.5-flash";

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return Response.json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { success: false, error: "Gemini failed" },
      { status: 500 }
    );
  }
}
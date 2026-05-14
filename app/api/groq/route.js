import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages, temperature = 0.7, max_tokens = 1024 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Messages array is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature,
          max_tokens,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ success: true, data: text });
  } catch (error) {
    console.error("Groq route error:", error);
    return NextResponse.json(
      { success: false, error: "Groq API failed" },
      { status: 500 }
    );
  }
}

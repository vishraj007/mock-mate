import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { QuizInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { quizTopics, jsonQuizResp, createdBy } = await req.json();

    if (!quizTopics || !jsonQuizResp || !createdBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const quizId = uuidv4();

    const resp = await db
      .insert(QuizInterview)
      .values({
        jsonQuizResp: jsonQuizResp,
        quiztopics: quizTopics,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        quizId: quizId,
      })
      .returning({ quizId: QuizInterview.quizId });

    return NextResponse.json({ success: true, quizId: resp[0].quizId });
  } catch (error) {
    console.error("Quiz create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}

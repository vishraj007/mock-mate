import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { QuizInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { quizId } = await params;

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(QuizInterview)
      .where(eq(QuizInterview.quizId, quizId));

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quiz data" },
      { status: 500 }
    );
  }
}

import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { interviewId } = await params;

    const answers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(asc(UserAnswer.id));

    const interview = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    let questions = [];
    if (interview.length > 0) {
      const parsed = JSON.parse(interview[0].jsonMockResp);

      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      } else if (Array.isArray(parsed.data)) {
        questions = parsed.data;
      }
    }

    return NextResponse.json({ answers, questions });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
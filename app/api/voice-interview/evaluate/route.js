/**
 * Re-evaluation endpoint — Re-runs the evaluation pipeline on a completed interview.
 *
 * POST /api/voice-interview/evaluate
 * Body: { mockId: string }
 *
 * Useful for: re-evaluating with updated prompts, debugging, or manual trigger
 * from the feedback page.
 */

import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { VoiceInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { runEvaluationPipeline } from "@/lib/evaluation-pipeline";

export async function POST(req) {
  try {
    const { mockId } = await req.json();

    if (!mockId) {
      return NextResponse.json(
        { success: false, error: "mockId is required" },
        { status: 400 }
      );
    }

    // Fetch session
    const sessions = await db
      .select()
      .from(VoiceInterview)
      .where(eq(VoiceInterview.mockId, mockId));

    if (sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    const session = sessions[0];
    const conversationLog = JSON.parse(session.conversationLog || "[]");

    // Check if there are any user answers
    const userAnswers = conversationLog.filter(
      (entry) => entry.role === "user" && entry.type === "answer"
    );

    if (userAnswers.length === 0) {
      return NextResponse.json(
        { success: false, error: "No answers found in this session to evaluate" },
        { status: 400 }
      );
    }

    // Run the full evaluation pipeline
    const jobContext = {
      jobPosition: session.jobPosition,
      jobDesc: session.jobDesc,
      jobExperience: session.jobExperience,
    };

    console.log(`[re-evaluate] Starting pipeline for session ${mockId}`);
    const feedback = await runEvaluationPipeline(conversationLog, jobContext);

    // Update database with new feedback
    await db
      .update(VoiceInterview)
      .set({
        overallFeedback: JSON.stringify(feedback),
        overallRating: String(feedback.overallRating),
        status: "completed",
      })
      .where(eq(VoiceInterview.mockId, mockId));

    console.log(`[re-evaluate] Pipeline complete for session ${mockId}, rating: ${feedback.overallRating}`);

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Re-evaluation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

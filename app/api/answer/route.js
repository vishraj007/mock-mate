import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { mockIdRef, question, userEmail, correctAns, userAns, feedback, rating } = body;

    // Check if answer already exists
    const existing = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockIdRef),
          eq(UserAnswer.question, question),
          eq(UserAnswer.userEmail, userEmail)
        )
      );

    if (existing.length > 0) {
      // Update existing answer
      await db
        .update(UserAnswer)
        .set({
          userAns,
          feedback,
          rating: String(rating),
          createdAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(UserAnswer.mockIdRef, mockIdRef),
            eq(UserAnswer.question, question),
            eq(UserAnswer.userEmail, userEmail)
          )
        );

      return NextResponse.json({ success: true, action: "updated" });
    } else {
      // Insert new answer
      await db.insert(UserAnswer).values({
        mockIdRef,
        question,
        userEmail,
        correctAns,
        userAns,
        feedback,
        rating: String(rating),
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, action: "inserted" });
    }
  } catch (error) {
    console.error("Answer API error:", error);
    return NextResponse.json({ success: false, error: "Failed to save answer" }, { status: 500 });
  }
}
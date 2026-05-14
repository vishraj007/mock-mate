import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { interviewId } = await params;

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
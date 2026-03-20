import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { jobRole, jobDesc, experience, email, cleanJsonString } = await req.json();

    const resp = await db.insert(MockInterview).values({
      jsonMockResp: cleanJsonString,
      jobPostion: jobRole,
      jobDesc: jobDesc,
      jobExperience: experience,
      createdBy: email || "unknown",
      createdAt: new Date().toISOString(),
      mockId: uuidv4(),
    }).returning({ mockId: MockInterview.mockId });

    return NextResponse.json({ success: true, mockId: resp[0].mockId });
  } catch (error) {
    console.error("DB insert error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
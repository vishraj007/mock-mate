import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { VoiceInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(messages, temperature = 0.7, max_tokens = 1024) {
  const response = await fetch(GROQ_URL, {
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
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// GET - Fetch voice interview session
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mockId = searchParams.get("mockId");

    if (!mockId) {
      return NextResponse.json(
        { success: false, error: "mockId is required" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ success: true, session: sessions[0] });
  } catch (error) {
    console.error("Voice interview fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new voice interview & generate first question
export async function POST(req) {
  try {
    const { jobPosition, jobDesc, jobExperience, email } = await req.json();

    const mockId = uuidv4();

    // Generate first question using Groq
    const systemPrompt = `You are an expert technical interviewer. You are conducting a mock interview for the following position:

Job Position: ${jobPosition}
Job Description/Tech Stack: ${jobDesc}
Candidate Experience: ${jobExperience} years

Your task:
1. Ask ONE clear, specific interview question relevant to this role.
2. Start with a brief warm greeting (1 sentence), then ask the question.
3. The question should be appropriate for someone with ${jobExperience} years of experience.
4. Do NOT include any JSON formatting or special markers.
5. Just speak naturally as an interviewer would.`;

    const firstQuestion = await callGroq([
      { role: "system", content: systemPrompt },
      { role: "user", content: "Start the interview. Ask the first question." },
    ]);

    // Initialize conversation log
    const conversationLog = [
      {
        role: "ai",
        content: firstQuestion,
        type: "question",
        questionNumber: 1,
        isFollowUp: false,
        timestamp: new Date().toISOString(),
      },
    ];

    // Save to database
    await db.insert(VoiceInterview).values({
      mockId,
      jobPosition,
      jobDesc,
      jobExperience,
      conversationLog: JSON.stringify(conversationLog),
      status: "in_progress",
      flagCount: "0",
      createdBy: email || "unknown",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      mockId,
      firstQuestion,
      conversationLog,
    });
  } catch (error) {
    console.error("Voice interview create error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Process user answer, generate follow-up or next question
export async function PUT(req) {
  try {
    const { mockId, userAnswer, currentQuestionNumber, totalMainQuestions = 5 } =
      await req.json();

    // Fetch current session
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

    // Add user's answer to log
    conversationLog.push({
      role: "user",
      content: userAnswer,
      type: "answer",
      questionNumber: currentQuestionNumber,
      timestamp: new Date().toISOString(),
    });

    // Count follow-ups for current question
    const followUpsForCurrentQ = conversationLog.filter(
      (entry) =>
        entry.role === "ai" &&
        entry.questionNumber === currentQuestionNumber &&
        entry.isFollowUp
    ).length;

    // Build conversation for Groq
    const systemPrompt = `You are an expert technical interviewer conducting a mock interview.

Job Position: ${session.jobPosition}
Job Description: ${session.jobDesc}
Candidate Experience: ${session.jobExperience} years

Current state:
- This is main question #${currentQuestionNumber} of ${totalMainQuestions}
- Follow-ups asked for this question: ${followUpsForCurrentQ}/2

Rules:
1. You just received the candidate's answer. Evaluate it briefly.
2. If the answer is interesting, incomplete, or you want to dig deeper AND you haven't asked 2 follow-ups yet for this question, ask a follow-up.
3. If you've already asked 2 follow-ups or the answer is satisfactory, move to the next main question.
4. If this is question ${totalMainQuestions} and follow-ups are done, indicate the interview is complete.
5. Speak naturally as an interviewer. Give a brief reaction to their answer (1-2 sentences), then ask the next question.
6. Do NOT use JSON or special formatting. Just speak naturally.

IMPORTANT: At the very START of your response, include one of these markers on its own line:
[FOLLOW_UP] - if you're asking a follow-up to the current question
[NEXT_QUESTION] - if you're moving to a new main question
[INTERVIEW_COMPLETE] - if all questions are done

Then on the next line, speak your response naturally.`;

    // Build message history for context
    const messages = [{ role: "system", content: systemPrompt }];

    // Add conversation history (last 10 entries for context window)
    const recentHistory = conversationLog.slice(-10);
    for (const entry of recentHistory) {
      messages.push({
        role: entry.role === "ai" ? "assistant" : "user",
        content: entry.content,
      });
    }

    const groqResponse = await callGroq(messages, 0.7, 512);

    // Parse the response to determine type
    let responseType = "next_question";
    let cleanResponse = groqResponse;
    let isComplete = false;
    let isFollowUp = false;
    let nextQuestionNumber = currentQuestionNumber;

    if (groqResponse.includes("[FOLLOW_UP]")) {
      responseType = "follow_up";
      isFollowUp = true;
      cleanResponse = groqResponse.replace("[FOLLOW_UP]", "").trim();
    } else if (groqResponse.includes("[INTERVIEW_COMPLETE]")) {
      responseType = "complete";
      isComplete = true;
      cleanResponse = groqResponse.replace("[INTERVIEW_COMPLETE]", "").trim();
    } else if (groqResponse.includes("[NEXT_QUESTION]")) {
      responseType = "next_question";
      nextQuestionNumber = currentQuestionNumber + 1;
      cleanResponse = groqResponse.replace("[NEXT_QUESTION]", "").trim();
    }

    // Force completion if we've exceeded total questions
    if (nextQuestionNumber > totalMainQuestions && !isFollowUp) {
      isComplete = true;
    }

    // Add AI response to log
    conversationLog.push({
      role: "ai",
      content: cleanResponse,
      type: isComplete ? "closing" : "question",
      questionNumber: isFollowUp ? currentQuestionNumber : nextQuestionNumber,
      isFollowUp,
      timestamp: new Date().toISOString(),
    });

    // Update database
    await db
      .update(VoiceInterview)
      .set({
        conversationLog: JSON.stringify(conversationLog),
        status: isComplete ? "completed" : "in_progress",
      })
      .where(eq(VoiceInterview.mockId, mockId));

    return NextResponse.json({
      success: true,
      nextQuestion: cleanResponse,
      isFollowUp,
      questionNumber: isFollowUp ? currentQuestionNumber : nextQuestionNumber,
      isComplete,
      responseType,
    });
  } catch (error) {
    console.error("Voice interview answer error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - End interview & generate feedback
export async function PATCH(req) {
  try {
    const { mockId } = await req.json();

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

    // Check if user actually answered any questions
    const userAnswers = conversationLog.filter(
      (entry) => entry.role === "user" && entry.type === "answer"
    );

    if (userAnswers.length === 0) {
      // No answers given - return empty feedback
      const noAnswerFeedback = {
        overallRating: 0,
        summary:
          "The interview was ended without any answers being provided. No evaluation is possible. Please attempt the interview again and answer the questions to receive feedback.",
        strengths: [],
        improvements: [
          "Complete the interview by answering questions",
          "Practice speaking your answers out loud before the interview",
          "Prepare key points for common interview questions in advance",
        ],
        questionBreakdown: [],
        tips: "Start by reviewing common interview questions for your role and practicing your responses. Even a brief answer is better than no answer.",
      };

      await db
        .update(VoiceInterview)
        .set({
          overallFeedback: JSON.stringify(noAnswerFeedback),
          overallRating: "0",
          status: "completed",
        })
        .where(eq(VoiceInterview.mockId, mockId));

      return NextResponse.json({
        success: true,
        feedback: noAnswerFeedback,
      });
    }

    // Build conversation transcript for feedback - only include Q&A pairs
    const transcript = conversationLog
      .map(
        (entry) =>
          `${entry.role === "ai" ? "Interviewer" : "Candidate"}: ${entry.content}`
      )
      .join("\n\n");

    // Generate overall feedback
    const feedbackPrompt = `You are an expert interviewer who just completed a mock interview. Analyze ONLY what the candidate actually said in their answers. Do NOT speculate or assume knowledge the candidate did not demonstrate.

Job Position: ${session.jobPosition}
Job Description: ${session.jobDesc}
Candidate Experience: ${session.jobExperience} years
Total questions asked: ${conversationLog.filter((e) => e.role === "ai" && e.type === "question").length}
Total answers given: ${userAnswers.length}

Conversation:
${transcript}

CRITICAL RULES:
- Rate ONLY based on what the candidate actually said
- If an answer was short or vague, rate it low
- If a question was not answered, mark it as "Not answered" with rating 0
- Strengths must be things the candidate actually demonstrated in their answers
- Improvements must be based on gaps in their actual responses
- Do NOT give credit for potential or opportunity — only for demonstrated knowledge

Provide your feedback in the following JSON format ONLY (no other text):
{
  "overallRating": <number 1-10>,
  "summary": "<2-3 sentence overall assessment based ONLY on actual answers>",
  "strengths": ["<strength actually shown in answers>"],
  "improvements": ["<specific weakness from their answers>"],
  "questionBreakdown": [
    {
      "questionNumber": 1,
      "topic": "<brief topic>",
      "rating": <1-10 or 0 if not answered>,
      "comment": "<comment on what was actually said, or 'Not answered' if skipped>"
    }
  ],
  "tips": "<one specific actionable tip based on their weakest answer>"
}`;

    const feedbackResponse = await callGroq(
      [
        {
          role: "system",
          content:
            "You are a strict but fair interview coach. Evaluate ONLY what was actually said. Never speculate or give credit for undemonstrated skills. Return ONLY valid JSON.",
        },
        { role: "user", content: feedbackPrompt },
      ],
      0.3,
      1500
    );

    // Parse feedback JSON
    let feedback;
    try {
      const cleaned = feedbackResponse.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      feedback = JSON.parse(jsonMatch[0]);
    } catch {
      feedback = {
        overallRating: 5,
        summary: feedbackResponse,
        strengths: [],
        improvements: [],
        questionBreakdown: [],
        tips: "",
      };
    }

    // Update database
    await db
      .update(VoiceInterview)
      .set({
        overallFeedback: JSON.stringify(feedback),
        overallRating: String(feedback.overallRating),
        status: "completed",
      })
      .where(eq(VoiceInterview.mockId, mockId));

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Voice interview feedback error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

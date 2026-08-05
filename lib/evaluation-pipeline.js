/**
 * Evaluation Pipeline — Multi-stage final feedback generation.
 *
 * Three sequential stages, each building on the previous output:
 *   Stage 1: Extract & Categorize Q&A pairs
 *   Stage 2: Multi-dimensional scoring with ideal answers
 *   Stage 3: Synthesis — overall feedback, skill map, recommendations
 *
 * Falls back to a single-call approach if any stage fails critically.
 */

const { callGroqWithRetry } = require("./llm-utils");
const {
  QA_EXTRACTION_SCHEMA,
  SCORING_SCHEMA,
  SYNTHESIS_SCHEMA,
  SCORING_DIMENSIONS,
  computeWeightedScore,
  ratingToGrade,
} = require("./evaluation-schemas");

// ─── Stage 1: Extract & Categorize ──────────────────────────────────────────

async function extractQAPairs(conversationLog, jobContext) {
  console.log("[pipeline] Stage 1: Extracting Q&A pairs...");

  const { jobPosition, jobDesc, jobExperience } = jobContext;

  const transcript = conversationLog
    .map((e) => `${e.role === "ai" ? "Interviewer" : "Candidate"}: ${e.content}`)
    .join("\n\n");

  const prompt = `Analyze this interview transcript and extract all question-answer pairs.

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Candidate Experience: ${jobExperience} years

Transcript:
${transcript}

Extract EVERY question the interviewer asked and the candidate's corresponding answer.
For each pair, identify:
- Whether it's a main question or follow-up
- The primary skill category it tests (e.g., "React", "System Design", "JavaScript", "Problem Solving", "Communication")
- A brief topic label

Return ONLY valid JSON:
{
  "pairs": [
    {
      "questionNumber": 1,
      "question": "exact question text",
      "answer": "exact answer text or 'Not answered' if skipped",
      "isFollowUp": false,
      "skillCategory": "category name",
      "topic": "brief topic label"
    }
  ]
}

Rules:
- Include ALL questions, even if unanswered
- Use "Not answered" for skipped questions
- skillCategory should be derived from the job description and question content
- Group follow-ups under their parent question number`;

  const result = await callGroqWithRetry(
    [
      {
        role: "system",
        content: "You are a precise data extraction assistant. Extract structured data from interview transcripts. Return ONLY valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    {
      temperature: 0.1,
      max_tokens: 1500,
      retries: 2,
      expectJson: true,
      schema: QA_EXTRACTION_SCHEMA,
    }
  );

  console.log(`[pipeline] Stage 1 complete: ${result.pairs?.length || 0} Q&A pairs extracted`);
  return result;
}

// ─── Stage 2: Multi-Dimensional Scoring ─────────────────────────────────────

async function scoreAnswers(qaPairs, jobContext, existingEvaluations) {
  console.log("[pipeline] Stage 2: Scoring answers...");

  const { jobPosition, jobDesc, jobExperience } = jobContext;

  // Build per-answer context from real-time evaluations (if available)
  let evalContext = "";
  if (existingEvaluations && Object.keys(existingEvaluations).length > 0) {
    evalContext = `\n\nPrevious real-time evaluation scores (use as reference, but re-evaluate independently):
${JSON.stringify(existingEvaluations, null, 2)}`;
  }

  const dimensionDesc = SCORING_DIMENSIONS.map(
    (d) => `- ${d.key} (weight ${d.weight}): ${d.description}`
  ).join("\n");

  const prompt = `Score each interview answer on 4 dimensions (1-10 scale).

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Candidate Experience: ${jobExperience} years

Scoring dimensions:
${dimensionDesc}

Scoring calibration:
- 1-3: Poor — fundamentally incorrect or irrelevant
- 4-5: Below average — partially correct, significant gaps
- 6-7: Average — acceptable with some gaps
- 8-9: Good — solid demonstration of competence
- 10: Exceptional — comprehensive and insightful
${evalContext}

Q&A Pairs to evaluate:
${JSON.stringify(qaPairs.pairs, null, 2)}

For each Q&A pair, provide:
1. Scores on all 4 dimensions
2. An overall rating (weighted average)
3. A specific comment about what was good/missing
4. An ideal/model answer showing what a perfect response would include

Return ONLY valid JSON:
{
  "scoredAnswers": [
    {
      "questionNumber": 1,
      "topic": "topic label",
      "dimensions": {
        "relevance": 7,
        "technicalAccuracy": 6,
        "depth": 5,
        "communication": 8
      },
      "rating": 6.5,
      "comment": "Specific comment about the answer",
      "idealAnswer": "A concise model answer (2-3 sentences max)"
    }
  ]
}

CRITICAL:
- Score ONLY based on what was actually said
- "Not answered" responses get 0 across all dimensions
- Be specific in comments — reference actual content from the answer
- Ideal answers should be concise but comprehensive`;

  const result = await callGroqWithRetry(
    [
      {
        role: "system",
        content: "You are a calibrated interview scoring engine. Score answers precisely and consistently. Never inflate scores. Return ONLY valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    {
      temperature: 0.2,
      max_tokens: 2000,
      retries: 2,
      expectJson: true,
      schema: SCORING_SCHEMA,
    }
  );

  // Recompute weighted scores for consistency
  if (result.scoredAnswers) {
    for (const answer of result.scoredAnswers) {
      if (answer.dimensions) {
        answer.rating = computeWeightedScore(answer.dimensions);
      }
    }
  }

  console.log(`[pipeline] Stage 2 complete: ${result.scoredAnswers?.length || 0} answers scored`);
  return result;
}

// ─── Stage 3: Synthesis & Recommendations ───────────────────────────────────

async function synthesizeFeedback(scoredAnswers, qaPairs, jobContext) {
  console.log("[pipeline] Stage 3: Synthesizing feedback...");

  const { jobPosition, jobDesc, jobExperience } = jobContext;

  const prompt = `Generate comprehensive interview feedback based on these scored answers.

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Candidate Experience: ${jobExperience} years

Scored Answers:
${JSON.stringify(scoredAnswers.scoredAnswers, null, 2)}

Q&A Categories:
${JSON.stringify(qaPairs.pairs.map((p) => ({ q: p.questionNumber, skill: p.skillCategory, topic: p.topic })), null, 2)}

Generate a complete feedback report. Return ONLY valid JSON:
{
  "overallRating": <1-10 weighted average>,
  "summary": "<3-4 sentence overall assessment. Be specific about demonstrated skills and gaps>",
  "skillMap": [
    { "skill": "Skill Name", "score": <1-10> }
  ],
  "strengths": [
    "<Specific strength demonstrated in answers>"
  ],
  "improvements": [
    "<Specific gap or weakness from answers>"
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "area": "Skill area",
      "action": "Specific actionable advice",
      "resources": "Suggested learning resource (course, book, or practice type)"
    }
  ],
  "communicationProfile": {
    "clarity": <1-10>,
    "conciseness": <1-10>,
    "structuredThinking": <1-10>,
    "confidence": <1-10>
  },
  "tips": "<One high-impact, specific tip for their weakest area>"
}

Rules:
- skillMap: Generate 4-7 skills relevant to the job. Score each based on demonstrated knowledge
- strengths: 2-4 items, must reference actual answer content
- improvements: 2-4 items, must be specific to gaps in their answers
- recommendations: 2-4 items, sorted by priority (high first)
- communicationProfile: Assess based on how answers were structured and articulated
- overallRating: Should be a weighted average of all answer scores, NOT inflated`;

  const result = await callGroqWithRetry(
    [
      {
        role: "system",
        content: "You are a senior interview coach generating actionable feedback reports. Be encouraging but honest. Never inflate ratings. Return ONLY valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    {
      temperature: 0.4,
      max_tokens: 2000,
      retries: 2,
      expectJson: true,
      schema: SYNTHESIS_SCHEMA,
    }
  );

  console.log(`[pipeline] Stage 3 complete: Overall rating ${result.overallRating}/10`);
  return result;
}

// ─── Single-call fallback (mirrors original PATCH behavior) ─────────────────

async function singleCallFeedback(conversationLog, jobContext) {
  console.log("[pipeline] Running single-call fallback...");

  const { jobPosition, jobDesc, jobExperience } = jobContext;
  const userAnswers = conversationLog.filter((e) => e.role === "user" && e.type === "answer");
  const transcript = conversationLog
    .map((e) => `${e.role === "ai" ? "Interviewer" : "Candidate"}: ${e.content}`)
    .join("\n\n");

  const prompt = `You are an expert interviewer. Analyze ONLY what the candidate actually said.

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Candidate Experience: ${jobExperience} years
Total answers given: ${userAnswers.length}

Conversation:
${transcript}

Provide feedback in JSON:
{
  "overallRating": <1-10>,
  "summary": "<2-3 sentence assessment>",
  "skillMap": [],
  "strengths": ["<strength>"],
  "improvements": ["<improvement>"],
  "recommendations": [],
  "communicationProfile": { "clarity": 5, "conciseness": 5, "structuredThinking": 5, "confidence": 5 },
  "questionBreakdown": [{"questionNumber": 1, "topic": "", "rating": 5, "dimensions": {"relevance": 5, "technicalAccuracy": 5, "depth": 5, "communication": 5}, "comment": "", "idealAnswer": ""}],
  "tips": ""
}`;

  return await callGroqWithRetry(
    [
      { role: "system", content: "Return ONLY valid JSON. Be strict but fair." },
      { role: "user", content: prompt },
    ],
    { temperature: 0.3, max_tokens: 1500, retries: 2, expectJson: true }
  );
}

// ─── Main Pipeline Orchestrator ─────────────────────────────────────────────

/**
 * Run the full multi-stage evaluation pipeline.
 *
 * @param {Array}  conversationLog  — Full conversation history
 * @param {object} jobContext       — { jobPosition, jobDesc, jobExperience }
 * @returns {object}                — Complete feedback object
 */
async function runEvaluationPipeline(conversationLog, jobContext) {
  console.log("[pipeline] Starting multi-stage evaluation pipeline...");

  try {
    // Gather any per-answer evaluations from the conversation log
    const existingEvaluations = {};
    for (const entry of conversationLog) {
      if (entry.role === "user" && entry.evaluation) {
        existingEvaluations[entry.questionNumber] = entry.evaluation;
      }
    }

    // Stage 1: Extract Q&A pairs
    const qaPairs = await extractQAPairs(conversationLog, jobContext);

    if (!qaPairs.pairs || qaPairs.pairs.length === 0) {
      console.warn("[pipeline] No Q&A pairs extracted, falling back to single-call");
      return await singleCallFeedback(conversationLog, jobContext);
    }

    // Stage 2: Score answers
    const scoredAnswers = await scoreAnswers(qaPairs, jobContext, existingEvaluations);

    // Stage 3: Synthesize feedback
    const synthesis = await synthesizeFeedback(scoredAnswers, qaPairs, jobContext);

    // Merge scored answers into the final output as questionBreakdown
    synthesis.questionBreakdown = scoredAnswers.scoredAnswers || [];

    // Add letter grade
    synthesis.grade = ratingToGrade(synthesis.overallRating);

    // Add pipeline metadata
    synthesis._pipeline = {
      version: "1.0",
      stages: 3,
      timestamp: new Date().toISOString(),
      questionsEvaluated: qaPairs.pairs.length,
    };

    console.log("[pipeline] Pipeline complete successfully");
    return synthesis;
  } catch (err) {
    console.error("[pipeline] Pipeline failed, falling back to single-call:", err.message);
    try {
      return await singleCallFeedback(conversationLog, jobContext);
    } catch (fallbackErr) {
      console.error("[pipeline] Fallback also failed:", fallbackErr.message);
      // Return minimal valid feedback
      return {
        overallRating: 0,
        summary: "We encountered an error generating your feedback. Please try re-evaluating.",
        skillMap: [],
        strengths: [],
        improvements: ["Unable to generate feedback at this time"],
        recommendations: [],
        communicationProfile: { clarity: 0, conciseness: 0, structuredThinking: 0, confidence: 0 },
        questionBreakdown: [],
        tips: "Please try the re-evaluate option or contact support.",
        grade: "N/A",
      };
    }
  }
}

module.exports = {
  runEvaluationPipeline,
  extractQAPairs,
  scoreAnswers,
  synthesizeFeedback,
  singleCallFeedback,
};

/**
 * Answer Evaluator — Real-time per-answer evaluation during the interview.
 *
 * Runs in parallel with the next-question generation so it doesn't add
 * latency to the user experience. Each evaluation is lightweight (256 tokens max).
 */

const { callGroqWithRetry } = require("./llm-utils");
const { PER_ANSWER_SCHEMA, SCORING_DIMENSIONS, computeWeightedScore } = require("./evaluation-schemas");

/**
 * Evaluate a single candidate answer against the question and job context.
 *
 * @param {string} question      — The interview question that was asked
 * @param {string} answer        — The candidate's answer
 * @param {object} jobContext    — { jobPosition, jobDesc, jobExperience }
 * @returns {object}             — Per-answer evaluation matching PER_ANSWER_SCHEMA
 */
async function evaluateAnswer(question, answer, jobContext) {
  const { jobPosition, jobDesc, jobExperience } = jobContext;

  const systemPrompt = `You are a strict technical interview evaluator. You score candidate answers objectively on 4 dimensions using a 1-10 scale.

Scoring calibration:
- 1-3: Poor — incorrect, irrelevant, or no meaningful content
- 4-5: Below average — partially correct but significant gaps
- 6-7: Average — acceptable answer with some gaps or lack of depth
- 8-9: Good — solid answer demonstrating clear competence
- 10: Exceptional — comprehensive, insightful, could not be better

Context:
- Job Position: ${jobPosition}
- Tech Stack/Description: ${jobDesc}
- Candidate Experience: ${jobExperience} years

CRITICAL: Score ONLY based on what was actually said. Never give credit for potential or assumed knowledge.`;

  const userPrompt = `Evaluate this interview Q&A:

QUESTION: ${question}

CANDIDATE'S ANSWER: ${answer}

Return ONLY valid JSON in this exact format:
{
  "relevance": <1-10>,
  "technicalAccuracy": <1-10>,
  "depth": <1-10>,
  "communication": <1-10>,
  "overallScore": <1-10>,
  "keyTopics": ["topic1", "topic2"],
  "flag": "<none|off_topic|too_brief|incorrect|excellent>",
  "briefComment": "<1-2 sentence assessment>"
}

Flag guide:
- "none": Normal answer
- "off_topic": Answer does not address the question at all
- "too_brief": Answer is extremely short (< 1 meaningful sentence)
- "incorrect": Contains demonstrably wrong technical claims
- "excellent": Outstanding answer that exceeds expectations`;

  try {
    const evaluation = await callGroqWithRetry(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        temperature: 0.2,
        max_tokens: 256,
        retries: 1, // Fast — only 1 retry
        expectJson: true,
        schema: PER_ANSWER_SCHEMA,
      }
    );

    // Recompute weighted overall score for consistency
    evaluation.overallScore = computeWeightedScore({
      relevance: evaluation.relevance,
      technicalAccuracy: evaluation.technicalAccuracy,
      depth: evaluation.depth,
      communication: evaluation.communication,
    });

    return evaluation;
  } catch (err) {
    console.error("[answer-evaluator] Evaluation failed:", err.message);
    // Return a neutral fallback — don't crash the interview flow
    return {
      relevance: 5,
      technicalAccuracy: 5,
      depth: 5,
      communication: 5,
      overallScore: 5,
      keyTopics: [],
      flag: "none",
      briefComment: "Evaluation unavailable — could not process this answer.",
    };
  }
}

/**
 * Quick relevance check — faster than full evaluation.
 * Returns a flag string: "none", "off_topic", or "too_brief".
 */
function detectAnswerRelevance(question, answer) {
  if (!answer || answer.trim().length === 0) {
    return "too_brief";
  }

  // Heuristic: answers under 15 characters are likely too brief
  const trimmed = answer.trim();
  if (trimmed.length < 15) {
    return "too_brief";
  }

  // Heuristic: if answer is just "I don't know" variants
  const dontKnowPatterns = [
    /^i\s*(don'?t|do\s*not)\s*know/i,
    /^no\s*idea/i,
    /^i'?m\s*not\s*sure/i,
    /^pass/i,
    /^skip/i,
    /^next/i,
  ];
  for (const pattern of dontKnowPatterns) {
    if (pattern.test(trimmed)) {
      return "too_brief";
    }
  }

  return "none";
}

module.exports = {
  evaluateAnswer,
  detectAnswerRelevance,
};

/**
 * Evaluation Schemas — Defines the expected shapes for all pipeline outputs.
 *
 * Used by llm-utils validateJsonResponse() to ensure LLM outputs are
 * well-formed before downstream stages consume them.
 */

// ─── Per-Answer Evaluation (real-time, during interview) ────────────────────

const PER_ANSWER_SCHEMA = {
  relevance: "number",
  technicalAccuracy: "number",
  depth: "number",
  communication: "number",
  overallScore: "number",
  keyTopics: "array",
  flag: "string",
  briefComment: "string",
};

// Valid flag values for answer quality detection
const ANSWER_FLAGS = ["none", "off_topic", "too_brief", "incorrect", "excellent"];

// ─── Stage 1: Q&A Extraction ────────────────────────────────────────────────

const QA_EXTRACTION_SCHEMA = {
  pairs: "array",
};

// Each pair inside the array should have this shape (validated manually)
const QA_PAIR_SHAPE = {
  questionNumber: "number",
  question: "string",
  answer: "string",
  isFollowUp: "boolean",
  skillCategory: "string",
  topic: "string",
};

// ─── Stage 2: Multi-Dimensional Scoring ─────────────────────────────────────

const SCORING_SCHEMA = {
  scoredAnswers: "array",
};

// Each scored answer should have this shape
const SCORED_ANSWER_SHAPE = {
  questionNumber: "number",
  topic: "string",
  dimensions: "object", // { relevance, technicalAccuracy, depth, communication }
  rating: "number",
  comment: "string",
  idealAnswer: "string",
};

// ─── Stage 3: Final Synthesis ───────────────────────────────────────────────

const SYNTHESIS_SCHEMA = {
  overallRating: "number",
  summary: "string",
  skillMap: "array",
  strengths: "array",
  improvements: "array",
  recommendations: "array",
  communicationProfile: "object",
  tips: "string",
};

// ─── Scoring Dimensions (for reference and prompt building) ─────────────────

const SCORING_DIMENSIONS = [
  {
    key: "relevance",
    label: "Relevance",
    description: "How directly the answer addresses the question asked",
    weight: 0.25,
  },
  {
    key: "technicalAccuracy",
    label: "Technical Accuracy",
    description: "Correctness of technical claims, concepts, and terminology",
    weight: 0.30,
  },
  {
    key: "depth",
    label: "Depth & Detail",
    description: "Level of detail, reasoning, examples, and nuance provided",
    weight: 0.25,
  },
  {
    key: "communication",
    label: "Communication",
    description: "Clarity, structure, conciseness, and professional delivery",
    weight: 0.20,
  },
];

/**
 * Compute a weighted overall score from dimension scores.
 */
function computeWeightedScore(dimensions) {
  let total = 0;
  let weightSum = 0;

  for (const dim of SCORING_DIMENSIONS) {
    const score = dimensions[dim.key];
    if (typeof score === "number") {
      total += score * dim.weight;
      weightSum += dim.weight;
    }
  }

  return weightSum > 0 ? Math.round((total / weightSum) * 10) / 10 : 0;
}

/**
 * Convert a numeric rating (1-10) to a letter grade.
 */
function ratingToGrade(rating) {
  if (rating >= 9.5) return "A+";
  if (rating >= 8.5) return "A";
  if (rating >= 7.5) return "B+";
  if (rating >= 6.5) return "B";
  if (rating >= 5.5) return "C+";
  if (rating >= 4.5) return "C";
  if (rating >= 3.5) return "D";
  return "F";
}

module.exports = {
  PER_ANSWER_SCHEMA,
  ANSWER_FLAGS,
  QA_EXTRACTION_SCHEMA,
  QA_PAIR_SHAPE,
  SCORING_SCHEMA,
  SCORED_ANSWER_SHAPE,
  SYNTHESIS_SCHEMA,
  SCORING_DIMENSIONS,
  computeWeightedScore,
  ratingToGrade,
};

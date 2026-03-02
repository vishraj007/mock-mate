"use client";

import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { useParams, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, TrendingUp, CheckCircle, AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function Feedback() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params?.interviewId;

  const [feedbackList, setFeedbackList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!interviewId) return;
    loadData();
  }, [interviewId]);

  const loadData = async () => {
    try {
      const answers = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(asc(UserAnswer.id));

      setFeedbackList(answers);

      const interview = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (interview.length > 0) {
        const parsed = JSON.parse(interview[0].jsonMockResp);

        // 🔐 normalize questions safely
        let questionArray = [];

        if (Array.isArray(parsed)) {
          questionArray = parsed;
        } else if (Array.isArray(parsed.questions)) {
          questionArray = parsed.questions;
        } else if (Array.isArray(parsed.data)) {
          questionArray = parsed.data;
        } else {
          console.error("Invalid question format:", parsed);
        }

        setQuestions(questionArray);
      }
    } catch (err) {
      console.error("Feedback load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const answerMap = {};
  feedbackList.forEach((ans) => {
    if (ans.question) {
      answerMap[ans.question] = ans;
    }
  });

  const mergedQuestions = questions.map((q) => ({
    question: q.question,
    correctAns: q.answer,
    ...(answerMap[q.question] || {}),
  }));

  const attempted = feedbackList.filter((f) => f.rating);
  const overallRating =
    attempted.length > 0
      ? Math.round(
          attempted.reduce((sum, item) => sum + Number(item.rating), 0) /
            attempted.length
        )
      : 0;

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-emerald-400";
    if (rating >= 5) return "text-amber-400";
    return "text-rose-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {feedbackList.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-red-400">No Interview Found</h2>
            <p className="text-gray-400 mt-2">Please complete an interview first</p>
            <button
              onClick={() => router.replace("/dashboard")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                Interview Complete
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Your Interview Results
              </h1>

              <p className="text-gray-400 text-lg">
                Review your performance and areas for improvement
              </p>
            </div>

            {/* Overall Score Card */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                    Overall Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{overallRating}</span>
                    <span className="text-2xl text-gray-500">/10</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-400">
                      {attempted.length} of {questions.length} questions answered
                    </span>
                  </div>
                </div>

                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#27272A"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(overallRating / 10) * 351.86} 351.86`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{overallRating * 10}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white mb-4">Question Breakdown</h2>

              {mergedQuestions.map((item, index) => (
                <Collapsible key={index}>
                  <CollapsibleTrigger className="w-full group">
                    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-5 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-sm font-semibold text-emerald-400">
                          {index + 1}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <p className="text-white font-medium mb-2 pr-4">
                            {item.question}
                          </p>

                          {item.userAns ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-gray-300">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.rating >= 8
                                    ? "bg-emerald-500"
                                    : item.rating >= 5
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                              ></span>
                              {item.rating}/10
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-gray-500">
                              Skipped
                            </div>
                          )}
                        </div>

                        <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-5 pb-4 pt-2">
                      {!item.userAns ? (
                        <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-amber-400 mb-1">Question Skipped</p>
                              <p className="text-sm text-gray-400">
                                You didn't provide an answer for this question
                              </p>
                            </div>
                          </div>

                          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                              Expected Answer
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.correctAns}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Rating */}
                          <div className="flex items-center gap-3 py-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                item.rating >= 8
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : item.rating >= 5
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              {item.rating}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-400">Performance Score</p>
                              <p className={`text-sm font-semibold ${getRatingColor(item.rating)}`}>
                                {item.rating >= 8
                                  ? "Excellent"
                                  : item.rating >= 5
                                  ? "Good"
                                  : "Needs Improvement"}
                              </p>
                            </div>
                          </div>

                          {/* Correct Answer */}
                          <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-4">
                            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                              Expected Answer
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.correctAns}
                            </p>
                          </div>

                          {/* Feedback */}
                          <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg p-4">
                            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">
                              Feedback
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">{item.feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            {/* Footer Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => router.replace("/dashboard")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Feedback;
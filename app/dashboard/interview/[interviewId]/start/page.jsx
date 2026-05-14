"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useProctoring } from "@/lib/useProctoring";
import dynamic from "next/dynamic";

// Dynamically import browser-only component (speech recognition, microphone)
const RecordAnswer = dynamic(
  () => import("./_components/VideoandAudio"),
  { ssr: false }
);
import Question from "./_components/Question";

function StartInterview() {
  const params = useParams();
  const interviewId = params?.interviewId;
  const router = useRouter();

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [proctorReady, setProctorReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    flagCount, maxFlags, isFullscreen, showWarning,
    warningMessage, isCancelled, requestFullscreen, dismissWarning,
  } = useProctoring({
    enabled: proctorReady,
    onCancel: () => router.push("/dashboard"),
  });

  /* ── Fetch interview data from API route (no direct DB) ── */
  useEffect(() => {
    if (!interviewId) return;

    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/interview/${interviewId}`);

        if (!res.ok) throw new Error("Failed to fetch interview");

        const data = await res.json();

        // Parse the JSON questions string from the DB row
        const questions = JSON.parse(data.jsonMockResp);
        setMockInterviewQuestion(questions);
        setInterviewData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load interview. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  /* ── Auto-start proctoring once data is loaded ── */
  useEffect(() => {
    if (interviewData && !proctorReady) {
      requestFullscreen();
      setProctorReady(true);
    }
  }, [interviewData]);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Loading interview...</p>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-semibold mb-2">Something went wrong</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">

      {/* ── Flag Warning Modal ── */}
      {showWarning && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-8 text-center border ${
            isCancelled
              ? "bg-red-950/90 border-red-500/50"
              : "bg-amber-950/90 border-amber-500/50"
          }`}>
            <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${
              isCancelled ? "text-red-400" : "text-amber-400"
            }`} />
            <h2 className={`text-xl font-bold mb-3 ${
              isCancelled ? "text-red-400" : "text-amber-400"
            }`}>
              {isCancelled ? "Interview Cancelled" : "Warning!"}
            </h2>
            <p className="text-gray-300 mb-6">{warningMessage}</p>
            {!isCancelled && (
              <button
                onClick={dismissWarning}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-all"
              >
                I Understand, Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Grid Pattern Background ── */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Proctoring Status Bar ── */}
        {proctorReady && (
          <div className="mb-4 flex items-center justify-end gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              flagCount > 0
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-zinc-800 text-gray-500 border border-zinc-700"
            }`}>
              🚩 {flagCount}/{maxFlags} Flags
            </div>
          </div>
        )}

        {/* ── Question Navigation ── */}
        <div className="mb-6 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Questions</h3>
          <div className="flex flex-wrap gap-3">
            {mockInterviewQuestion?.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveQuestionIndex(index)}
                className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                  activeQuestionIndex === index
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Grid: Question + Recording ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Question
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
          />
          <RecordAnswer
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
          />
        </div>

        {/* ── End Interview Button (shows after question 5) ── */}
        {activeQuestionIndex >= 4 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() =>
                router.push(`/dashboard/interview/${interviewId}/feedback`)
              }
              className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              End Interview & View Feedback
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default StartInterview;
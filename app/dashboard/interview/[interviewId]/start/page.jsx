"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Question from "./_components/Question";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

import dynamic from "next/dynamic";
// Dynamically import this component and disable SSR because we use react-hook speech to text 
// browser-only APIs (window, microphone, speech recognition).
const RecordAnswer = dynamic(
  () => import("./_components/VideoandAudio"),
  { ssr: false }
);

function StartInterview() {
  const params = useParams();
  const interviewId = params?.interviewId;
  const router = useRouter();

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  /* 🔹 Fetch interview data based on ID */
  useEffect(() => {
    if (!interviewId) return;

    const fetchInterview = async () => {
      try {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId));

        if (result.length > 0) {
          const jsonresp = JSON.parse(result[0].jsonMockResp);
          setMockInterviewQuestion(jsonresp);
          setInterviewData(result[0]);
        }
      } catch (error) {
        console.error("DB Error:", error);
      }
    };

    fetchInterview();
  }, [interviewId]);

  return (
    <div className="bg-black min-h-screen">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Question Navigation - At the top */}
        <div className="mb-6 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Questions</h3>
          <div className="flex flex-wrap gap-3">
            {mockInterviewQuestion?.map((question, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/*QUESTIONS column*/}
          <Question
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
          />

          {/*video recording column*/}
          <RecordAnswer
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
          />
        </div>

        {/* End Interview Button - Shows only after 5th question */}
        {activeQuestionIndex >= 4 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() =>
                router.push("/dashboard/interview/" + interviewId + "/feedback")
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
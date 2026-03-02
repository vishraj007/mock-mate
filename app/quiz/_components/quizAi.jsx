"use client"
import React, { useState } from "react";
import { Sparkles, LoaderCircle, Lightbulb } from "lucide-react";
import { db } from "@/utils/db";
import { QuizInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function QuizAi() {
  const [quizTopics, setQuizTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const inputPrompt =
        "Quiz topics: " +
        quizTopics +
        ". Based on this information, generate 10 interview questions (MCQ) with answers in JSON format.";

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error("Gemini failed");
      }

      const cleanJsonString = data.data
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      console.log(cleanJsonString);

      if (cleanJsonString) {
        const resp = await db.insert(QuizInterview).values({
          jsonQuizResp: cleanJsonString,
          quiztopics: quizTopics,
          createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
          createdAt: new Date().toISOString(),
          quizId: uuidv4()
        }).returning({ quizId: QuizInterview.quizId })
        console.log("Database Insert Response:", resp);
        if (resp) {
          router.push('/quiz/quiztest/' + resp[0].quizId);
        }
      }

    } catch (error) {
      console.error("Error submitting interview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Quiz Generator
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
            Create Custom Quiz
          </h1>
          
          <p className="text-gray-400 text-lg">
            Enter topics and let AI generate personalized quiz questions
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={onSubmit} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 shadow-2xl">
          
          {/* Topics Input */}
          <div className="space-y-3 mb-6">
            <label htmlFor="quiz-topics" className="text-base font-semibold text-white flex items-center gap-2">
              Quiz Topics
              <span className="text-emerald-400">*</span>
            </label>
            
            <p className="text-sm text-gray-400">
              Enter topics separated by commas for your AI-generated quiz
            </p>
            
            <textarea
              id="quiz-topics"
              placeholder="Example: Arrays, Strings, Docker, Kubernetes, System Design"
              value={quizTopics}
              onChange={(e) => setQuizTopics(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-teal-500/5 border border-teal-500/30 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-teal-400 mb-2 text-sm">
                  How it works
                </h3>
                <ul className="text-gray-300 text-sm space-y-1 leading-relaxed">
                  <li>• AI will generate 10 MCQ questions based on your topics</li>
                  <li>• Questions are tailored to test your knowledge</li>
                  <li>• Get instant feedback on your answers</li>
                  <li>• Track your performance and improve</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !quizTopics.trim()}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg
              ${loading || !quizTopics.trim()
                ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02]"
              }`}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Quiz with AI
              </>
            )}
          </button>

          {/* Example Topics */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Popular Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Data Structures",
                "Algorithms",
                "Operating Systems",
                "DBMS",
                "Networks",
                "React",
                "Node.js",
                "System Design"
              ].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setQuizTopics(prev => 
                    prev ? `${prev}, ${topic}` : topic
                  )}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 rounded-lg text-xs font-medium transition-all"
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuizAi;
"use client"
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eq } from "drizzle-orm";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

import { QuizInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { Button } from "@/components/ui/button";

function StartQuiz() {
   const params = useParams();
const quiztestId = params?.quiztestId;
const router = useRouter();

const [quizData, setQuizData] = useState(null);
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});

useEffect(() => {
  const fetchQuiz = async () => {
    const result = await db
      .select()
      .from(QuizInterview)
      .where(eq(QuizInterview.quizId, quiztestId));

    if (result.length > 0) {
      const row = result[0];
      setQuizData(row);

      //  normalize options safely
      const parsedQuestions = JSON.parse(row.jsonQuizResp).map(q => ({
        ...q,
        options: Array.isArray(q.options)
          ? q.options
          : typeof q.options === "string"
          ? q.options.split(",").map(o => o.trim())
          : [],
      }));

      setQuestions(parsedQuestions);
    }
  };

  if (quiztestId) fetchQuiz();
}, [quiztestId]);

const handleSubmit = () => {
  const resultData = questions.map((q, index) => {
    const userOptionText = answers[index] ?? null;

    const correctOptionText =
      q.options.find(opt =>
        opt.trim().startsWith(q.answer?.trim())
      ) || null;

    return {
      question: q.question,
      userAnswer: userOptionText || "Not Answered",
      correctAnswer: correctOptionText || "N/A",
      isCorrect:
        Boolean(
          userOptionText &&
          correctOptionText &&
          userOptionText.trim() === correctOptionText.trim()
        ),
    };
  });

  const score = resultData.filter(r => r.isCorrect).length;

  sessionStorage.setItem("quizResult", JSON.stringify(resultData));

  
  router.push(
    `/quiz/quiztest/${quiztestId}/result?score=${score}&total=${questions.length}`
  );
};

const answeredCount = Object.values(answers).filter(Boolean).length;
const totalQuestions = questions.length;


  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Quiz in Progress
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {quizData?.quiztopics || "Loading Quiz..."}
          </h1>

          <p className="text-gray-400">
            Answer all questions and submit to see your score
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Progress</p>
              <p className="text-2xl font-bold text-white">
                {answeredCount} / {totalQuestions}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Completion</p>
              <p className="text-2xl font-bold text-emerald-400">
                {totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 hover:border-emerald-500/30 transition-all"
            >
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-400 font-bold">{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white leading-relaxed">
                    {q.question}
                  </h2>
                  
                  {answers[index] && (
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Answered
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 ml-14">
                {q.options.map((opt, i) => {
                  const isSelected = answers[index] === opt;
                  
                  return (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
                        ${isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm shadow-emerald-500/20' 
                          : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
                        }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={isSelected}
                        onChange={() =>
                          setAnswers(prev => ({
                            ...prev,
                            [index]: opt,
                          }))
                        }
                        className="mt-1 w-4 h-4 text-emerald-500 bg-zinc-700 border-zinc-600 focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className={`flex-1 text-sm leading-relaxed ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="sticky bottom-6 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              {answeredCount < totalQuestions ? (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">
                      {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''} remaining
                    </p>
                    <p className="text-xs text-gray-400">Please answer all questions before submitting</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-400">All questions answered!</p>
                    <p className="text-xs text-gray-400">Ready to submit your quiz</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions}
              className={`px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200 flex items-center gap-2 shadow-lg whitespace-nowrap
                ${answeredCount < totalQuestions
                  ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105'
                }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartQuiz;
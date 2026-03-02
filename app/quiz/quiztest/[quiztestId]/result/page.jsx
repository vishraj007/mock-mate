"use client"
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trophy, CheckCircle2, XCircle, Home, TrendingUp } from "lucide-react";

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const score = params.get("score");
  const total = params.get("total");

  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  const percentage = total ? Math.round((score / total) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 80) return { text: "Excellent!", color: "text-emerald-400", emoji: "🎉" };
    if (percentage >= 60) return { text: "Good Job!", color: "text-teal-400", emoji: "👏" };
    if (percentage >= 40) return { text: "Keep Practicing", color: "text-amber-400", emoji: "💪" };
    return { text: "Need Improvement", color: "text-rose-400", emoji: "📚" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Quiz Completed
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
            Quiz Results
          </h1>

          <p className="text-gray-400 text-lg">
            Here's how you performed
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Score Display */}
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                Your Score
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold text-white">{score}</span>
                <span className="text-3xl text-gray-500">/ {total}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className={`text-lg font-semibold ${performance.color}`}>
                  {performance.emoji} {performance.text}
                </span>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#27272A"
                  strokeWidth="14"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#scoreGradient)"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={`${(percentage / 100) * 439.82} 439.82`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981"/>
                    <stop offset="100%" stopColor="#14B8A6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Answer Breakdown</h2>

          <div className="space-y-4">
            {results.map((r, index) => (
              <div
                key={index}
                className={`bg-zinc-900/50 backdrop-blur-sm rounded-xl border p-6 transition-all
                  ${r.isCorrect 
                    ? 'border-emerald-500/30 hover:border-emerald-500/50' 
                    : 'border-rose-500/30 hover:border-rose-500/50'
                  }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                    ${r.isCorrect ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    {r.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white leading-relaxed">
                      {index + 1}. {r.question}
                    </h3>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${r.isCorrect 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                    {r.isCorrect ? "Correct" : "Wrong"}
                  </div>
                </div>

                {/* Answers */}
                <div className="ml-14 space-y-3">
                  {/* Your Answer */}
                  <div className={`p-4 rounded-lg border
                    ${r.isCorrect 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-rose-500/5 border-rose-500/20'
                    }`}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Your Answer
                    </p>
                    <p className={`text-sm font-medium
                      ${r.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {r.userAnswer}
                    </p>
                  </div>

                  {/* Correct Answer (only show if wrong) */}
                  {!r.isCorrect && (
                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                        Correct Answer
                      </p>
                      <p className="text-sm font-medium text-emerald-400">
                        {r.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
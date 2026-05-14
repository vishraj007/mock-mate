"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TrendingUp, CheckCircle, Star, ArrowUp, Lightbulb, Home, MessageSquare, AlertTriangle } from "lucide-react";

function VoiceFeedback() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId;

  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/voice-interview?mockId=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setSession(data.session);
        setConversation(JSON.parse(data.session.conversationLog || "[]"));
        if (data.session.overallFeedback) {
          setFeedback(JSON.parse(data.session.overallFeedback));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (r) => {
    if (r >= 8) return "text-emerald-400";
    if (r >= 5) return "text-amber-400";
    return "text-rose-400";
  };

  const getRatingBg = (r) => {
    if (r >= 8) return "bg-emerald-500/20 border-emerald-500/30";
    if (r >= 5) return "bg-amber-500/20 border-amber-500/30";
    return "bg-rose-500/20 border-rose-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">No feedback available</h2>
          <button onClick={() => router.push("/dashboard")} className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const rating = feedback.overallRating || 0;

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" /> Voice Interview Complete
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Interview Results
          </h1>
          <p className="text-gray-400">{session?.jobPosition} — {session?.jobExperience} yrs experience</p>
          {parseInt(session?.flagCount || "0") > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4" /> {session.flagCount} proctoring flag(s) recorded
            </div>
          )}
        </div>

        {/* Score Card */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Overall Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{rating}</span>
                <span className="text-2xl text-gray-500">/10</span>
              </div>
              <p className="text-gray-400 mt-3 max-w-md">{feedback.summary}</p>
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#27272A" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="12" fill="none"
                  strokeDasharray={`${(rating / 10) * 351.86} 351.86`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{rating * 10}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2"><Star className="w-4 h-4" /> Strengths</h3>
            <ul className="space-y-2">
              {feedback.strengths?.map((s, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2"><ArrowUp className="w-4 h-4" /> Areas to Improve</h3>
            <ul className="space-y-2">
              {feedback.improvements?.map((s, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question Breakdown */}
        {feedback.questionBreakdown?.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Question Breakdown</h3>
            <div className="space-y-3">
              {feedback.questionBreakdown.map((q, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${getRatingBg(q.rating)}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getRatingColor(q.rating)}`}>
                    {q.rating}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Q{q.questionNumber}: {q.topic}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{q.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {feedback.tips && (
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-teal-400 font-semibold mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Pro Tip</h3>
            <p className="text-gray-300 text-sm">{feedback.tips}</p>
          </div>
        )}

        {/* Conversation Transcript */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-400" /> Full Transcript</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {conversation.map((entry, i) => (
              <div key={i} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  entry.role === "user"
                    ? "bg-emerald-600/15 border border-emerald-500/20 text-gray-300"
                    : "bg-zinc-800/60 border border-zinc-700 text-gray-400"
                }`}>
                  <span className={`text-xs font-semibold block mb-1 ${entry.role === "user" ? "text-emerald-400" : "text-teal-400"}`}>
                    {entry.role === "user" ? "You" : "Interviewer"}
                    {entry.isFollowUp && " (Follow-up)"}
                  </span>
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceFeedback;

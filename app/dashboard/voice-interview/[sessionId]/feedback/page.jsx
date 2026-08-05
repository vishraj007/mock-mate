"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TrendingUp, CheckCircle, Star, ArrowUp, Lightbulb, Home,
  MessageSquare, AlertTriangle, ChevronDown, ChevronUp,
  RefreshCw, Award, Target, Zap, BookOpen,
} from "lucide-react";

// ─── Radar Chart Component (canvas-based, no external lib) ──────────────────

function SkillRadarChart({ skills, size = 280 }) {
  const canvasRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  const drawRadar = useCallback(
    (progress = 1) => {
      const canvas = canvasRef.current;
      if (!canvas || !skills?.length) return;

      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const cx = size / 2;
      const cy = size / 2;
      const maxR = size / 2 - 40;
      const n = skills.length;
      const angleStep = (2 * Math.PI) / n;
      const startAngle = -Math.PI / 2;

      ctx.clearRect(0, 0, size, size);

      // Draw grid rings
      for (let ring = 1; ring <= 5; ring++) {
        const r = (ring / 5) * maxR;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const angle = startAngle + i * angleStep;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw axes and labels
      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const xEnd = cx + maxR * Math.cos(angle);
        const yEnd = cy + maxR * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Labels
        const labelR = maxR + 22;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        ctx.font = "11px system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const label = skills[i].skill.length > 12
          ? skills[i].skill.substring(0, 11) + "…"
          : skills[i].skill;
        ctx.fillText(label, lx, ly);
      }

      // Draw data polygon
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const angle = startAngle + idx * angleStep;
        const val = Math.min(10, Math.max(0, skills[idx].score)) / 10;
        const r = val * maxR * progress;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Fill
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, "rgba(52,211,153,0.25)");
      grad.addColorStop(1, "rgba(34,211,238,0.08)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke
      ctx.strokeStyle = "rgba(52,211,153,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points
      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const val = Math.min(10, Math.max(0, skills[i].score)) / 10;
        const r = val * maxR * progress;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#34d399";
        ctx.fill();
        ctx.strokeStyle = "#03070a";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    },
    [skills, size]
  );

  useEffect(() => {
    if (!skills?.length || animated) return;
    let frame = 0;
    const totalFrames = 40;
    const animate = () => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      drawRadar(eased);
      if (frame < totalFrames) requestAnimationFrame(animate);
      else setAnimated(true);
    };
    requestAnimationFrame(animate);
  }, [skills, animated, drawRadar]);

  if (!skills?.length) return null;

  return <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />;
}

// ─── Animated Progress Bar ──────────────────────────────────────────────────

function ProgressBar({ value, max = 10, color = "#34d399", label, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((value / max) * 100);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs text-gray-400 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// ─── Expandable Question Card ───────────────────────────────────────────────

function QuestionCard({ q, getRatingColor, getRatingBg }) {
  const [expanded, setExpanded] = useState(false);

  const dims = q.dimensions || {};
  const hasIdealAnswer = q.idealAnswer && q.idealAnswer.length > 0;

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${getRatingBg(q.rating)}`}>
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg ${getRatingColor(q.rating)}`}
          style={{ background: "rgba(0,0,0,0.3)" }}>
          {q.rating}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">
            Q{q.questionNumber}: {q.topic}
          </p>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{q.comment}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
        )}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Dimension scores */}
          {Object.keys(dims).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Dimension Scores
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "relevance", label: "Relevance", color: "#34d399" },
                  { key: "technicalAccuracy", label: "Technical Accuracy", color: "#2dd4bf" },
                  { key: "depth", label: "Depth & Detail", color: "#22d3ee" },
                  { key: "communication", label: "Communication", color: "#60a5fa" },
                ].map(({ key, label, color }) => (
                  <div key={key} className="bg-black/20 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-gray-400">{label}</span>
                      <span className="text-xs font-bold" style={{ color }}>
                        {dims[key] ?? "—"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${((dims[key] || 0) / 10) * 100}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full comment */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Feedback
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{q.comment}</p>
          </div>

          {/* Ideal/Model Answer */}
          {hasIdealAnswer && (
            <div className="bg-teal-500/5 border border-teal-500/15 rounded-lg p-3">
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3" /> Model Answer
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">{q.idealAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Feedback Page ─────────────────────────────────────────────────────

function VoiceFeedback() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId;

  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reEvaluating, setReEvaluating] = useState(false);

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

  const handleReEvaluate = async () => {
    setReEvaluating(true);
    try {
      const res = await fetch("/api/voice-interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockId: sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (err) {
      console.error("Re-evaluation failed:", err);
    } finally {
      setReEvaluating(false);
    }
  };

  const getRatingColor = (r) => {
    if (r >= 8) return "text-emerald-400";
    if (r >= 5) return "text-amber-400";
    return "text-rose-400";
  };

  const getRatingBg = (r) => {
    if (r >= 8) return "bg-emerald-500/10 border-emerald-500/20";
    if (r >= 5) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  const getGradeColor = (grade) => {
    if (!grade) return "text-gray-400";
    if (grade.startsWith("A")) return "text-emerald-400";
    if (grade.startsWith("B")) return "text-amber-400";
    if (grade.startsWith("C")) return "text-orange-400";
    return "text-rose-400";
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    if (priority === "medium") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Analyzing your performance...</p>
        </div>
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
  const grade = feedback.grade || null;
  const skillMap = feedback.skillMap || [];
  const commProfile = feedback.communicationProfile || null;
  const recommendations = feedback.recommendations || [];
  const questionBreakdown = feedback.questionBreakdown || [];
  const pipelineInfo = feedback._pipeline || null;

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" /> Voice Interview Complete
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Interview Results
              </h1>
              <p className="text-gray-400">{session?.jobPosition} — {session?.jobExperience} yrs experience</p>
            </div>
            <button
              onClick={handleReEvaluate}
              disabled={reEvaluating}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-gray-300 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${reEvaluating ? "animate-spin" : ""}`} />
              {reEvaluating ? "Re-evaluating..." : "Re-evaluate"}
            </button>
          </div>
          {parseInt(session?.flagCount || "0") > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4" /> {session.flagCount} proctoring flag(s) recorded
            </div>
          )}
        </div>

        {/* Score + Grade Card */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-8">
            <div className="flex-1 min-w-[240px]">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Overall Score</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-white">{rating}</span>
                <span className="text-2xl text-gray-500">/10</span>
                {grade && (
                  <span className={`text-3xl font-bold ml-2 ${getGradeColor(grade)}`}>
                    {grade}
                  </span>
                )}
              </div>
              <p className="text-gray-400 mt-3 max-w-lg">{feedback.summary}</p>
              {pipelineInfo && (
                <p className="text-xs text-gray-600 mt-2">
                  Evaluated via {pipelineInfo.stages}-stage pipeline • {pipelineInfo.questionsEvaluated} questions analyzed
                </p>
              )}
            </div>
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#27272A" strokeWidth="12" fill="none" />
                <circle cx="72" cy="72" r="60" stroke="url(#scoreGrad)" strokeWidth="12" fill="none"
                  strokeDasharray={`${(rating / 10) * 376.99} 376.99`} strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1.5s ease-out" }} />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(rating * 10)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Radar + Communication Profile — side by side */}
        {(skillMap.length > 0 || commProfile) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Radar Chart */}
            {skillMap.length >= 3 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> Skill Map
                </h3>
                <SkillRadarChart skills={skillMap} size={260} />
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {skillMap.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700">
                      <span className="text-gray-400">{s.skill}</span>
                      <span className={`font-bold ${getRatingColor(s.score)}`}>{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Profile */}
            {commProfile && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400" /> Communication Profile
                </h3>
                <ProgressBar label="Clarity" value={commProfile.clarity} color="#34d399" delay={100} />
                <ProgressBar label="Conciseness" value={commProfile.conciseness} color="#2dd4bf" delay={200} />
                <ProgressBar label="Structured Thinking" value={commProfile.structuredThinking} color="#22d3ee" delay={300} />
                <ProgressBar label="Confidence" value={commProfile.confidence} color="#60a5fa" delay={400} />
              </div>
            )}
          </div>
        )}

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
              {(!feedback.strengths || feedback.strengths.length === 0) && (
                <li className="text-gray-500 text-sm italic">No specific strengths identified</li>
              )}
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
              {(!feedback.improvements || feedback.improvements.length === 0) && (
                <li className="text-gray-500 text-sm italic">No specific improvements identified</li>
              )}
            </ul>
          </div>
        </div>

        {/* Question Breakdown — Expandable Cards */}
        {questionBreakdown.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Question Breakdown
            </h3>
            <div className="space-y-3">
              {questionBreakdown.map((q, i) => (
                <QuestionCard key={i} q={q} getRatingColor={getRatingColor} getRatingBg={getRatingBg} />
              ))}
            </div>
          </div>
        )}

        {/* Prioritized Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-1">{rec.area}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{rec.action}</p>
                      {rec.resources && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-400">
                          <BookOpen className="w-3 h-3" />
                          <span>{rec.resources}</span>
                        </div>
                      )}
                    </div>
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${entry.role === "user" ? "text-emerald-400" : "text-teal-400"}`}>
                      {entry.role === "user" ? "You" : "Interviewer"}
                      {entry.isFollowUp && " (Follow-up)"}
                    </span>
                    {/* Inline evaluation score badge */}
                    {entry.evaluation && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getRatingBg(entry.evaluation.overallScore)}`}>
                        {entry.evaluation.overallScore}/10
                      </span>
                    )}
                    {/* Answer quality flag */}
                    {entry.flag && entry.flag !== "none" && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {entry.flag.replace("_", " ")}
                      </span>
                    )}
                  </div>
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

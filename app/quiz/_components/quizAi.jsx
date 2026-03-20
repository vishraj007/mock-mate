"use client";
import React, { useState } from "react";
import { Sparkles, LoaderCircle, Lightbulb, Zap } from "lucide-react";
import { db } from "@/utils/db";
import { QuizInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const POPULAR = [
  "Data Structures", "Algorithms", "Operating Systems",
  "DBMS", "Networks", "React", "Node.js", "System Design",
];

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
        "Quiz topics: " + quizTopics +
        ". Based on this information, generate 10 interview questions (MCQ) with answers in JSON format.";

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputPrompt }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Gemini failed");

      const cleanJsonString = data.data
        .replace(/```json/gi, "").replace(/```/g, "").trim();

      if (cleanJsonString) {
        const resp = await db.insert(QuizInterview).values({
          jsonQuizResp: cleanJsonString,
          quiztopics: quizTopics,
          createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
          createdAt: new Date().toISOString(),
          quizId: uuidv4(),
        }).returning({ quizId: QuizInterview.quizId });

        if (resp) router.push("/quiz/quiztest/" + resp[0].quizId);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#03070a",
      color: "#f0faf6",
      fontFamily: "var(--font-dm-sans), sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          top: -250, left: -200, filter: "blur(140px)",
          background: "radial-gradient(circle,rgba(52,211,153,0.13),transparent 70%)",
          animation: "blobDrift 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          bottom: -100, right: -100, filter: "blur(140px)",
          background: "radial-gradient(circle,rgba(34,211,238,0.10),transparent 70%)",
          animation: "blobDrift 20s ease-in-out infinite",
          animationDelay: "-8s",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)",
        }} />
      </div>

      <style>{`
        @keyframes blobDrift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(50px,-40px) scale(1.06)}66%{transform:translate(-35px,50px) scale(0.96)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .quiz-topic-btn:hover { color: #34d399 !important; border-color: rgba(52,211,153,0.3) !important; background: rgba(52,211,153,0.08) !important; }
      `}</style>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 640, margin: "0 auto",
        padding: "80px 32px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.5s both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#34d399", marginBottom: 20,
            fontFamily: "var(--font-syne), sans-serif",
          }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            AI Quiz Generator
          </div>
          <h1 style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)",
            letterSpacing: "-0.04em", lineHeight: 1,
            background: "linear-gradient(135deg,#34d399,#2dd4bf,#22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 14,
          }}>
            Create Custom Quiz
          </h1>
          <p style={{ color: "#8ba3b0", fontSize: "1rem", fontWeight: 300, lineHeight: 1.65 }}>
            Enter topics and let Gemini AI generate personalized questions
          </p>
        </div>

        {/* Glass Form Card */}
        <div style={{
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          background: "linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.018) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 40px 100px rgba(0,0,0,0.4)",
          position: "relative",
          animation: "fadeUp 0.5s 0.1s both",
        }}>
          {/* top shine */}
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
            background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)",
          }} />

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Input */}
            <div>
              <label style={{
                display: "block",
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "0.85rem", fontWeight: 700,
                color: "#94a3b8", marginBottom: 10,
                letterSpacing: "0.02em",
              }}>
                Quiz Topics <span style={{ color: "#34d399" }}>*</span>
              </label>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 10, fontWeight: 300 }}>
                Separate multiple topics with commas
              </p>
              <textarea
                placeholder="Ex: Arrays, Strings, Docker, Kubernetes, System Design"
                value={quizTopics}
                onChange={e => setQuizTopics(e.target.value)}
                required
                rows={5}
                style={{
                  width: "100%", resize: "none",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "#f0faf6",
                  padding: "14px 16px",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  lineHeight: 1.6,
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(52,211,153,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Info box */}
            <div style={{
              background: "rgba(45,212,191,0.05)",
              border: "1px solid rgba(45,212,191,0.2)",
              borderRadius: 14, padding: "16px 18px",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <Lightbulb style={{ width: 18, height: 18, color: "#2dd4bf", flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.8rem", fontWeight: 700, color: "#2dd4bf", marginBottom: 8,
                }}>
                  How it works
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    "10 MCQ questions generated from your topics",
                    "Questions tailored to test real knowledge",
                    "Instant feedback on every answer",
                    "Track your performance over time",
                  ].map(t => (
                    <li key={t} style={{ fontSize: "0.8rem", color: "#8ba3b0", fontWeight: 300, display: "flex", gap: 8 }}>
                      <span style={{ color: "#2dd4bf" }}>→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !quizTopics.trim()}
              style={{
                width: "100%", padding: "14px",
                borderRadius: 12, border: "none",
                fontFamily: "var(--font-syne), sans-serif",
                fontWeight: 700, fontSize: "0.95rem",
                color: loading || !quizTopics.trim() ? "#64748b" : "#03070a",
                background: loading || !quizTopics.trim()
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg,#34d399,#2dd4bf,#22d3ee)",
                cursor: loading || !quizTopics.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.25s",
                boxShadow: !loading && quizTopics.trim() ? "0 8px 28px rgba(52,211,153,0.35)" : "none",
              }}
            >
              {loading ? (
                <><LoaderCircle style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />Generating Quiz...</>
              ) : (
                <><Zap style={{ width: 18, height: 18 }} />Generate Quiz with AI</>
              )}
            </button>
          </form>

          {/* Popular topics */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#475569", marginBottom: 12,
            }}>
              Popular Topics
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {POPULAR.map(topic => (
                <button
                  key={topic}
                  type="button"
                  className="quiz-topic-btn"
                  onClick={() => setQuizTopics(p => p ? `${p}, ${topic}` : topic)}
                  style={{
                    padding: "6px 14px", borderRadius: 100,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#8ba3b0", cursor: "pointer",
                    fontFamily: "var(--font-syne), sans-serif",
                    fontSize: "0.75rem", fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAi;
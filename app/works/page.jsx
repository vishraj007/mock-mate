"use client";

import React from "react";
import {
  Sparkles, Video, MessageSquare, BarChart3, CheckCircle2,
  FileText, Brain, Target, TrendingUp, Clock, Award, ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const glassCard = {
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 20,
  boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)",
  transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
  position: "relative",
  overflow: "hidden",
};

export default function HowItWorks() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#03070a",
      color: "#f0faf6",
      fontFamily: "var(--font-dm-sans), sans-serif",
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
        .glass-hover:hover { transform: translateY(-4px) !important; border-color: rgba(52,211,153,0.25) !important; box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.45), 0 0 40px rgba(52,211,153,0.07) !important; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>

        {/* Hero Header */}
        <div style={{ textAlign: "center", marginBottom: 72, animation: "fadeUp 0.5s both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#34d399", marginBottom: 20,
            fontFamily: "var(--font-syne), sans-serif",
          }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            Complete Guide
          </div>
          <h1 style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4rem)",
            letterSpacing: "-0.04em", lineHeight: 1,
            background: "linear-gradient(135deg,#34d399,#2dd4bf,#22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 16,
          }}>
            How MockMate Works
          </h1>
          <p style={{ color: "#8ba3b0", fontSize: "1.05rem", fontWeight: 300, maxWidth: 560, margin: "0 auto" }}>
            Your all-in-one platform for mastering technical interviews with AI-powered practice
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 64 }}>
          {[
            { icon: <Video style={{ width: 26, height: 26, color: "#34d399" }} />, bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)",
              title: "Mock Interviews", desc: "AI-generated questions tailored to your job role, experience, and tech stack." },
            { icon: <FileText style={{ width: 26, height: 26, color: "#2dd4bf" }} />, bg: "rgba(45,212,191,0.08)", border: "rgba(45,212,191,0.2)",
              title: "AI Quizzes", desc: "Domain-specific MCQ quizzes to test and sharpen your technical knowledge." },
          ].map(({ icon, bg, border, title, desc }) => (
            <div key={title} className="glass-hover" style={{ ...glassCard, padding: "32px 28px" }}>
              <div style={{
                width: 54, height: 54, borderRadius: 14,
                background: bg, border: `1px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 18,
                boxShadow: "0 6px 20px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.08) inset",
              }}>
                {icon}
              </div>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: "0.875rem", color: "#8ba3b0", lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Interview Process */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Video style={{ width: 18, height: 18, color: "#34d399" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.03em" }}>Mock Interview Process</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { n: "01", color: "#34d399", icon: <Target style={{ width: 16, height: 16, color: "#34d399" }} />, title: "Enter Job Details", desc: "Provide your target job position, tech stack, and years of experience. Our AI uses this to generate personalized interview questions." },
              { n: "02", color: "#2dd4bf", icon: <Video style={{ width: 16, height: 16, color: "#2dd4bf" }} />, title: "Practice with AI Questions", desc: "Answer 5 AI-generated questions using your webcam and microphone. Speech-to-text captures your responses in real-time." },
              { n: "03", color: "#22d3ee", icon: <BarChart3 style={{ width: 16, height: 16, color: "#22d3ee" }} />, title: "Get AI Feedback", desc: "Gemini AI evaluates each answer and provides detailed feedback with ratings, strengths, and improvement suggestions." },
              { n: "04", color: "#34d399", icon: <TrendingUp style={{ width: 16, height: 16, color: "#34d399" }} />, title: "Track Progress", desc: "Review comprehensive reports, track improvement over time, and identify areas needing more practice." },
            ].map(({ n, color, icon, title, desc }) => (
              <div key={n} className="glass-hover" style={{ ...glassCard, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 800, fontSize: "0.85rem", color,
                  boxShadow: `0 0 16px ${color}20`,
                }}>
                  {n}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {icon}
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#8ba3b0", lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features Grid */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              fontFamily: "var(--font-syne), sans-serif", fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "#34d399", marginBottom: 10,
            }}>Platform</div>
            <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.03em" }}>Key Features</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { icon: <MessageSquare style={{ width: 20, height: 20, color: "#34d399" }} />, bg: "rgba(52,211,153,0.08)", title: "Speech-to-Text", desc: "Advanced speech recognition captures your answers accurately in real-time." },
              { icon: <Brain style={{ width: 20, height: 20, color: "#2dd4bf" }} />, bg: "rgba(45,212,191,0.08)", title: "Gemini AI Powered", desc: "Cutting-edge AI provides intelligent feedback and personalized suggestions." },
              { icon: <Clock style={{ width: 20, height: 20, color: "#22d3ee" }} />, bg: "rgba(34,211,238,0.08)", title: "Practice Anytime", desc: "24/7 access to unlimited mock interviews and quizzes at your convenience." },
              { icon: <BarChart3 style={{ width: 20, height: 20, color: "#34d399" }} />, bg: "rgba(52,211,153,0.08)", title: "Detailed Analytics", desc: "Comprehensive performance reports with strengths and improvement areas." },
              { icon: <Target style={{ width: 20, height: 20, color: "#2dd4bf" }} />, bg: "rgba(45,212,191,0.08)", title: "Personalized Content", desc: "Questions tailored to your specific role, experience, and tech stack." },
              { icon: <TrendingUp style={{ width: 20, height: 20, color: "#22d3ee" }} />, bg: "rgba(34,211,238,0.08)", title: "Track Progress", desc: "Monitor your improvement journey with historical data and trends." },
            ].map(({ icon, bg, title, desc }) => (
              <div key={title} className="glass-hover" style={{ ...glassCard, padding: "24px 22px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.08) inset" }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.01em", marginBottom: 7 }}>{title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#8ba3b0", lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          ...glassCard,
          background: "linear-gradient(135deg, rgba(52,211,153,0.07) 0%, rgba(34,211,238,0.03) 50%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(52,211,153,0.2)",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <div style={{
            position: "absolute", top: -1, left: "20%", right: "20%", height: 1,
            background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)",
          }} />
          <h2 style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800, fontSize: "clamp(1.8rem,4vw,3rem)",
            letterSpacing: "-0.04em", lineHeight: 1.05,
            marginBottom: 14,
          }}>
            You're all set!
          </h2>
          <p style={{ color: "#8ba3b0", fontSize: "1rem", fontWeight: 300, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Head back to your dashboard to manage interviews and continue your preparation.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 700, fontSize: "0.95rem",
              color: "#03070a", padding: "14px 32px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#34d399,#2dd4bf,#22d3ee)",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(52,211,153,0.4)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(52,211,153,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(52,211,153,0.4)"; }}
          >
            Back to Dashboard <ArrowRight style={{ width: 17, height: 17 }} />
          </button>
        </div>

      </div>
    </div>
  );
}
import React from "react";
import ADDNewInterview from "./_components/ADDNewInterview";
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#03070a",
        color: "#f0faf6",
        fontFamily: "var(--font-dm-sans), sans-serif",
        overflowX: "hidden",
        padding: "48px 32px",
        position: "relative",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          top: -250, left: -200, filter: "blur(140px)",
          background: "radial-gradient(circle, rgba(52,211,153,0.13), transparent 70%)",
          animation: "blobDrift 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          bottom: -150, right: -150, filter: "blur(140px)",
          background: "radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%)",
          animation: "blobDrift 20s ease-in-out infinite",
          animationDelay: "-8s",
        }} />
        {/* grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)",
        }} />
      </div>

      <style>{`
        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(50px,-40px) scale(1.06)}
          66%{transform:translate(-35px,50px) scale(0.96)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>

        {/* Page Header */}
        <div style={{ marginBottom: 48, animation: "fadeUp 0.5s both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 100,
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#34d399", marginBottom: 16,
            fontFamily: "var(--font-syne), sans-serif",
          }}>
            Your Workspace
          </div>
          <h1 style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg, #34d399, #2dd4bf, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 12,
          }}>
            Dashboard
          </h1>
          <p style={{ color: "#8ba3b0", fontSize: "1rem", fontWeight: 300, lineHeight: 1.6 }}>
            Practice, improve, and ace your next interview
          </p>
        </div>

        {/* Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 32,
          alignItems: "flex-start",
        }}>
          <div style={{ animation: "fadeUp 0.5s 0.1s both" }}>
            <ADDNewInterview />
          </div>
          <div style={{ animation: "fadeUp 0.5s 0.2s both" }}>
            <InterviewList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
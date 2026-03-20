"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function Loadermate() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#03070a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-dm-sans), sans-serif",
    }}>
      <style>{`
        @keyframes blobDrift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(50px,-40px) scale(1.06)}66%{transform:translate(-35px,50px) scale(0.96)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spinReverse{to{transform:rotate(-360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:0%}100%{background-position:250%}}
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          top: "10%", left: "20%", filter: "blur(140px)",
          background: "radial-gradient(circle,rgba(52,211,153,0.18),transparent 70%)",
          animation: "blobDrift 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          bottom: "10%", right: "15%", filter: "blur(140px)",
          background: "radial-gradient(circle,rgba(34,211,238,0.13),transparent 70%)",
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

      {/* Glass loader card */}
      <div style={{
        position: "relative", zIndex: 1,
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 28,
        padding: "52px 56px",
        textAlign: "center",
        boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 40px 100px rgba(0,0,0,0.5)",
        minWidth: 280,
      }}>
        {/* top shine */}
        <div style={{
          position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
          background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)",
        }} />

        {/* Spinner rings */}
        <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 28px" }}>
          {/* outer ring */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.06)",
            borderTopColor: "#34d399",
            animation: "spin 1.2s linear infinite",
          }} />
          {/* middle ring */}
          <div style={{
            position: "absolute", inset: 12, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.04)",
            borderBottomColor: "#2dd4bf",
            animation: "spinReverse 1.8s linear infinite",
          }} />
          {/* inner icon */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulse 2s ease-in-out infinite",
            }}>
              <Sparkles style={{ width: 18, height: 18, color: "#34d399" }} />
            </div>
          </div>
        </div>

        {/* Brand */}
        <h1 style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontWeight: 800, fontSize: "1.8rem",
          letterSpacing: "-0.04em",
          background: "linear-gradient(135deg,#34d399 0%,#2dd4bf 35%,#22d3ee 70%,#6ee7b7 100%)",
          backgroundSize: "250%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: "shimmer 3s linear infinite",
          marginBottom: 8,
        }}>
          MockMate
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 300, marginBottom: 24, letterSpacing: "0.02em" }}>
          Preparing your workspace...
        </p>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[0, 0.15, 0.3].map((delay, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: i === 0 ? "#34d399" : i === 1 ? "#2dd4bf" : "#22d3ee",
              animation: `bounce 1.2s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              boxShadow: `0 0 8px ${i === 0 ? "#34d399" : i === 1 ? "#2dd4bf" : "#22d3ee"}60`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
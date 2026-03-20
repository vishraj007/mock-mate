"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        background: scrolled ? "rgba(3,7,10,0.85)" : "rgba(3,7,10,0.6)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s ease",
        fontFamily: "var(--font-syne), sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => router.push("/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #34d399, #2dd4bf)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(52,211,153,0.4)",
              flexShrink: 0,
            }}
          >
            <Sparkles style={{ width: 18, height: 18, color: "#03070a" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.03em",
              background: "linear-gradient(130deg, #34d399, #2dd4bf)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MockMate
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Quizzes", path: "/quiz" },
            { label: "How It Works", path: "/works" },
          ].map(({ label, path }) => {
            const isActive = activePath === path;
            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: isActive ? "#34d399" : "#8ba3b0",
                  background: isActive ? "rgba(52,211,153,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(52,211,153,0.25)" : "1px solid transparent",
                  padding: "7px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#34d399";
                    e.currentTarget.style.background = "rgba(52,211,153,0.08)";
                    e.currentTarget.style.borderColor = "rgba(52,211,153,0.2)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#8ba3b0";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* User Button */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(52,211,153,0.12)",
          }}
        >
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
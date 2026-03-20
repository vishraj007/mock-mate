"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Plus, Briefcase, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import { MockInterview } from "@/utils/schema";
import { useRouter } from "next/navigation";

function ADDNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [questionsJSON, setQuestionsJSON] = useState("");

  const isFormValid =
    jobRole.trim() !== "" &&
    jobDesc.trim() !== "" &&
    experience !== "" &&
    Number(experience) >= 0 &&
    Number(experience) <= 35;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const inputPrompt =
        "Job Position: " + jobRole +
        ", Job Description: " + jobDesc +
        ", Years of Experience: " + experience +
        ". Based on this information, generate 5 interview questions with answers in JSON format.";

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputPrompt }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Gemini failed");

      const cleanJsonString = data.data
        .replace(/```json/gi, "").replace(/```/g, "").trim();

      setQuestionsJSON(cleanJsonString);

      if (cleanJsonString) {
        const resp = await db.insert(MockInterview).values({
          jsonMockResp: cleanJsonString,
          jobPostion: jobRole,
          jobDesc: jobDesc,
          jobExperience: experience,
          createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
          createdAt: new Date().toISOString(),
          mockId: uuidv4(),
        }).returning({ mockId: MockInterview.mockId });

        if (resp) {
          setOpenDialog(false);
          router.push("/dashboard/interview/" + resp[0].mockId);
        }
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error submitting interview:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#f0faf6",
    padding: "10px 14px",
    width: "100%",
    fontSize: "0.9rem",
    fontFamily: "var(--font-dm-sans), sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backdropFilter: "blur(8px)",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-syne), sans-serif",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: 8,
    letterSpacing: "0.02em",
  };

  return (
    <>
      {/* Add New Card */}
      <div
        onClick={() => setOpenDialog(true)}
        style={{
          width: "100%",
          padding: "28px 20px",
          borderRadius: 18,
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          textAlign: "center",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)";
          e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.45), 0 0 40px rgba(52,211,153,0.08)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)";
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(52,211,153,0.1)",
          border: "1px solid rgba(52,211,153,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(52,211,153,0.15)",
        }}>
          <Plus style={{ width: 22, height: 22, color: "#34d399" }} />
        </div>
        <div>
          <div style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700, fontSize: "0.95rem",
            color: "#f0faf6", marginBottom: 4,
          }}>
            Add New
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 300 }}>
            Start interview
          </div>
        </div>
      </div>

      {/* Glass Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          style={{
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)",
            background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 22,
            color: "#f0faf6",
            boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 40px 100px rgba(0,0,0,0.6)",
            maxWidth: 520,
          }}
        >
          {/* top shine */}
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)",
            borderRadius: "0 0 4px 4px",
          }} />

          <DialogHeader style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Briefcase style={{ width: 18, height: 18, color: "#34d399" }} />
              </div>
              <DialogTitle style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em",
                color: "#f0faf6",
              }}>
                New Mock Interview
              </DialogTitle>
            </div>
            <DialogDescription style={{ color: "#8ba3b0", fontSize: "0.875rem", fontWeight: 300 }}>
              Add your job details and let AI generate personalized interview questions
            </DialogDescription>
          </DialogHeader>

          <form style={{ display: "flex", flexDirection: "column", gap: 20 }} onSubmit={onSubmit}>
            {/* Job Role */}
            <div>
              <label style={labelStyle}>Job Position / Role</label>
              <input
                placeholder="Ex. Full Stack Developer"
                value={jobRole}
                required
                onChange={e => setJobRole(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(52,211,153,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Job Description */}
            <div>
              <label style={labelStyle}>Tech Stack / Job Description</label>
              <textarea
                placeholder="Ex. React, Next.js, Node.js, PostgreSQL"
                value={jobDesc}
                required
                onChange={e => setJobDesc(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "none", minHeight: 90 }}
                onFocus={e => { e.target.style.borderColor = "rgba(52,211,153,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Experience */}
            <div>
              <label style={labelStyle}>Years of Experience</label>
              <input
                type="number" min={0} max={35}
                placeholder="Ex. 2"
                value={experience}
                required
                onChange={e => {
                  const v = e.target.value;
                  if (v === "" || (Number(v) >= 0 && Number(v) <= 35)) setExperience(v);
                }}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(52,211,153,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 6 }}>0–35 years</p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8 }}>
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 600, fontSize: "0.85rem",
                  padding: "10px 22px", borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 700, fontSize: "0.85rem",
                  padding: "10px 24px", borderRadius: 10,
                  background: loading || !isFormValid
                    ? "rgba(52,211,153,0.2)"
                    : "linear-gradient(135deg, #34d399, #2dd4bf, #22d3ee)",
                  border: "none",
                  color: loading || !isFormValid ? "#64748b" : "#03070a",
                  cursor: loading || !isFormValid ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.25s",
                  boxShadow: !loading && isFormValid ? "0 8px 24px rgba(52,211,153,0.35)" : "none",
                }}
              >
                {loading ? (
                  <>
                    <LoaderCircle style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: 15, height: 15 }} />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default ADDNewInterview;
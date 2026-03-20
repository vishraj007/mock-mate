import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Calendar, Briefcase } from "lucide-react";

async function InterviewList() {
  const user = await currentUser();
  if (!user) return null;
  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const interviewList = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24,
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#34d399", marginBottom: 6,
          }}>
            Your History
          </div>
          <h2 style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "1.5rem", fontWeight: 800,
            letterSpacing: "-0.03em", color: "#f0faf6",
          }}>
            Previous Mock Interviews
          </h2>
        </div>
        <div style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: "0.75rem", fontWeight: 600,
          color: "#64748b",
        }}>
          {interviewList.length} session{interviewList.length !== 1 ? "s" : ""}
        </div>
      </div>

      {interviewList.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 32px",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          color: "#64748b",
          fontSize: "0.9rem",
          fontWeight: 300,
        }}>
          No interviews yet. Click <strong style={{ color: "#34d399" }}>Add New</strong> to get started!
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {interviewList.map((item) => (
          <div
            key={item.id}
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              padding: "28px 26px",
              transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px) rotateX(1deg)";
              e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)";
              e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.45), 0 0 40px rgba(52,211,153,0.07)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) rotateX(0)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
              e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)";
            }}
          >
            {/* top shine */}
            <div style={{
              position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            }} />
            {/* left accent bar */}
            <div style={{
              position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2,
              borderRadius: 2,
              background: "linear-gradient(180deg, #34d399, #22d3ee)",
              opacity: 0.4,
            }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(52,211,153,0.1)",
              }}>
                <Briefcase style={{ width: 18, height: 18, color: "#34d399" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 700, fontSize: "1rem",
                  letterSpacing: "-0.02em", color: "#f0faf6",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  marginBottom: 3,
                }}>
                  {item.jobPostion}
                </h3>
                <p style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 400 }}>
                  {item.jobExperience} Years of Experience
                </p>
              </div>
            </div>

            {/* Tech stack */}
            <p style={{
              fontSize: "0.82rem", color: "#8ba3b0", lineHeight: 1.65,
              fontWeight: 300, marginBottom: 16,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {item.jobDesc}
            </p>

            {/* Date */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.72rem", color: "#475569",
              marginBottom: 20,
            }}>
              <Calendar style={{ width: 12, height: 12 }} />
              <span>
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href={`/dashboard/interview/${item.mockId}/feedback`}
                style={{
                  flex: 1, textAlign: "center",
                  padding: "9px 0", borderRadius: 10,
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.8rem", fontWeight: 600,
                  color: "#94a3b8", textDecoration: "none",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#f0faf6";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                Feedback
              </Link>
              <Link
                href={`/dashboard/interview/${item.mockId}`}
                style={{
                  flex: 1, textAlign: "center",
                  padding: "9px 0", borderRadius: 10,
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.8rem", fontWeight: 700,
                  color: "#03070a", textDecoration: "none",
                  background: "linear-gradient(135deg, #34d399, #2dd4bf)",
                  boxShadow: "0 4px 16px rgba(52,211,153,0.3)",
                  transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}
              >
                Start
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewList;
"use client";

import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { eq, and } from "drizzle-orm";

function RecordAnswer({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  const stopRequestedRef = useRef(false);
  const speechBufferRef = useRef(""); // ✅ stores FULL speech

  const {
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // ✅ Accumulate speech safely
  useEffect(() => {
    if (!results.length) return;

    const transcript = results[results.length - 1]?.transcript || "";
    speechBufferRef.current += " " + transcript;
  }, [results]);

  // ✅ After recording stops → send full answer
  useEffect(() => {
    if (!isRecording && stopRequestedRef.current) {
      stopRequestedRef.current = false;

      const finalAnswer = speechBufferRef.current.trim();

      if (finalAnswer.length < 10) {
        toast.error("Please record answer again");
        return;
      }

      sendToGemini(finalAnswer);
    }
  }, [isRecording]);

  //  Ensure it's an array this is check because map only work on maps 
  if (!Array.isArray(mockInterviewQuestion)) {
    return null;
  }

  // 🔹 Gemini + DB
  const sendToGemini = async (finalAnswer) => {
    setLoading(true);

    const feedbackPrompt = `
Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
User Answer: ${finalAnswer}

Return ONLY valid JSON.
No markdown.
No explanation.
Keys must be: rating, feedback.
`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: feedbackPrompt }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Gemini failed");

      let text = data.data.replace(/```json|```/g, "").trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid Gemini JSON");

      const parsedFeedback = JSON.parse(jsonMatch[0]);

      const commonWhere = {
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      };

      // 🔍 CHECK IF ANSWER EXISTS
      const existing = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, commonWhere.mockIdRef),
            eq(UserAnswer.question, commonWhere.question),
            eq(UserAnswer.userEmail, commonWhere.userEmail)
          )
        );

      if (existing.length > 0) {
        // 🔄 UPDATE EXISTING ANSWER
        await db
          .update(UserAnswer)
          .set({
            userAns: finalAnswer,
            feedback: parsedFeedback.feedback,
            rating: String(parsedFeedback.rating),
            createdAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(UserAnswer.mockIdRef, commonWhere.mockIdRef),
              eq(UserAnswer.question, commonWhere.question),
              eq(UserAnswer.userEmail, commonWhere.userEmail)
            )
          );

        toast.success("Answer updated successfully");
      } else {
        //  INSERT NEW ANSWER
        await db.insert(UserAnswer).values({
          ...commonWhere,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: finalAnswer,
          feedback: parsedFeedback.feedback,
          rating: String(parsedFeedback.rating),
          createdAt: new Date().toISOString(),
        });

        toast.success("Answer recorded successfully");
      }

      //  RESET RESULTS FOR NEXT QUESTION
      setResults([]);
    } catch (err) {
      console.error(" Error:", err);
      toast.error("Failed to process answer");
    } finally {
      setLoading(false);
    }
  };

  //  Button logic
  const SaveUserAnswer = () => {
    if (loading) return;

    if (isRecording) {
      stopRequestedRef.current = true;
      stopSpeechToText();
    } else {
      // reset before new recording
      speechBufferRef.current = "";
      startSpeechToText();
      toast.info("Recording started");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Webcam Container */}
      <div className="relative bg-zinc-950 rounded-xl border-2 border-zinc-800 overflow-hidden shadow-2xl w-full" style={{ height: '300px' }}>
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-white text-xs font-semibold">Recording</span>
          </div>
        )}

        {/* Placeholder when webcam is off - SVG Webcam Icon */}
        {!webcamEnabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 z-10">
            <div className="relative mb-6">
              {/* SVG Webcam Icon */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Camera Body */}
                <circle cx="60" cy="50" r="35" fill="#18181B" stroke="#3F3F46" strokeWidth="3"/>
                <circle cx="60" cy="50" r="30" fill="#27272A" stroke="#52525B" strokeWidth="2"/>
                
                {/* Lens */}
                <circle cx="60" cy="50" r="22" fill="#10B981" opacity="0.2"/>
                <circle cx="60" cy="50" r="16" fill="#10B981" opacity="0.3"/>
                <circle cx="60" cy="50" r="10" fill="#10B981" opacity="0.5"/>
                <circle cx="60" cy="50" r="6" fill="#14B8A6"/>
                
                {/* LED Indicator */}
                <circle cx="85" cy="35" r="4" fill="#EF4444" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                </circle>
                
                {/* Stand */}
                <rect x="55" y="85" width="10" height="20" rx="2" fill="#3F3F46"/>
                <ellipse cx="60" cy="105" rx="25" ry="8" fill="#27272A"/>
                
                {/* Decorative ring */}
                <circle cx="60" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.3" strokeDasharray="4 4">
                  <animateTransform attributeName="transform" type="rotate" from="0 60 50" to="360 60 50" dur="20s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <p className="text-gray-300 text-base font-semibold mb-2">Webcam Disabled</p>
            <p className="text-gray-500 text-sm text-center max-w-xs px-4">
              Enable your webcam to practice with video recording
            </p>
          </div>
        )}

        <Webcam 
          mirrored 
          onUserMedia={() => setWebcamEnabled(true)}
          onUserMediaError={() => setWebcamEnabled(false)}
          style={{ 
            height: '100%', 
            width: "100%",
            objectFit: 'cover',
            borderRadius: "8px",
            display: webcamEnabled ? 'block' : 'none'
          }} 
        />
      </div>

      {/* Recording Button */}
      <button
        onClick={SaveUserAnswer}
        disabled={loading}
        className={`mt-8 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg
          ${loading 
            ? "bg-zinc-800 text-gray-400 cursor-not-allowed" 
            : isRecording 
              ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/30 hover:shadow-red-500/50" 
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50"
          }`}
      >
        {loading ? (
          <>
            <LoaderCircle className="w-5 h-5 animate-spin" />
            Processing Answer...
          </>
        ) : isRecording ? (
          <>
            <StopCircle className="w-5 h-5" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Record Answer
          </>
        )}
      </button>

      {/* Recording Status Text */}
      {isRecording && (
        <p className="mt-4 text-sm text-gray-400 animate-pulse">
          Speak clearly into your microphone...
        </p>
      )}
    </div>
  );
}

export default RecordAnswer;
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, StopCircle, LoaderCircle, Volume2, AlertTriangle, Shield, X } from "lucide-react";
import { toast } from "sonner";
import Webcam from "react-webcam";
import { useProctoring } from "@/lib/useProctoring";

function VoiceInterviewSession() {
  const params = useParams();
  const sessionId = params?.sessionId;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [proctorReady, setProctorReady] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const {
    flagCount, maxFlags, isFullscreen, showWarning,
    warningMessage, isCancelled, requestFullscreen, dismissWarning,
  } = useProctoring({
    enabled: proctorReady,
    onCancel: () => router.push("/dashboard"),
  });

  // Timer
  useEffect(() => {
    if (proctorReady && !isComplete) {
      timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [proctorReady, isComplete]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Fetch session on mount
  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/voice-interview?mockId=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setSessionData(data.session);

        // If the session was already completed, reset it for a fresh interview
        if (data.session.status === "completed") {
          const resetRes = await fetch("/api/voice-interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mockId: sessionId,
              reset: true,
              jobPosition: data.session.jobPosition,
              jobDesc: data.session.jobDesc,
              jobExperience: data.session.jobExperience,
              email: data.session.createdBy,
            }),
          });
          const resetData = await resetRes.json();
          if (resetData.success) {
            const freshLog = resetData.conversationLog || [];
            setConversation(freshLog);
            setCurrentQuestionNumber(1);
          }
        } else {
          const log = JSON.parse(data.session.conversationLog || "[]");
          setConversation(log);
          if (log.length > 0) {
            const lastAI = [...log].reverse().find((e) => e.role === "ai");
            if (lastAI) setCurrentQuestionNumber(lastAI.questionNumber || 1);
          }
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load session");
    }
  };

  // Start proctoring + speak first question
  const startInterview = async () => {
    await requestFullscreen();
    setProctorReady(true);
    if (conversation.length > 0) {
      speakText(conversation[0].content);
    }
  };

  // Browser TTS fallback
  const browserSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAISpeaking(false);
    }
  };

  // Sarvam TTS with browser fallback
  const speakText = async (text) => {
    setIsAISpeaking(true);
    try {
      const res = await fetch("/api/sarvam-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audioRef.current = audio;
        audio.onended = () => setIsAISpeaking(false);
        audio.onerror = () => {
          console.warn("Sarvam audio playback failed, using browser TTS");
          browserSpeak(text);
        };
        await audio.play();
      } else {
        console.warn("Sarvam TTS failed, falling back to browser TTS");
        browserSpeak(text);
      }
    } catch (err) {
      console.warn("Sarvam TTS error, falling back to browser TTS:", err);
      browserSpeak(text);
    }
  };

  // Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        processRecording();
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);
    try {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      if (blob.size < 1000) {
        toast.error("Recording too short, try again");
        setIsProcessing(false);
        return;
      }

      // STT
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      const sttRes = await fetch("/api/sarvam-stt", { method: "POST", body: formData });
      const sttData = await sttRes.json();

      if (!sttData.success || !sttData.transcript) {
        toast.error("Could not transcribe audio, try again");
        setIsProcessing(false);
        return;
      }

      const transcript = sttData.transcript;

      // Add user message to conversation UI
      setConversation((prev) => [
        ...prev,
        { role: "user", content: transcript, type: "answer", questionNumber: currentQuestionNumber, timestamp: new Date().toISOString() },
      ]);

      // Send to voice interview API
      const aiRes = await fetch("/api/voice-interview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mockId: sessionId,
          userAnswer: transcript,
          currentQuestionNumber,
        }),
      });
      const aiData = await aiRes.json();

      if (aiData.success) {
        setConversation((prev) => [
          ...prev,
          {
            role: "ai", content: aiData.nextQuestion, type: aiData.isComplete ? "closing" : "question",
            questionNumber: aiData.questionNumber, isFollowUp: aiData.isFollowUp, timestamp: new Date().toISOString(),
          },
        ]);

        if (aiData.isComplete) {
          setIsComplete(true);
          clearInterval(timerRef.current);
          speakText(aiData.nextQuestion);
        } else {
          setCurrentQuestionNumber(aiData.questionNumber);
          speakText(aiData.nextQuestion);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to process answer");
    } finally {
      setIsProcessing(false);
    }
  };

  const endInterview = async () => {
    setIsProcessing(true);
    clearInterval(timerRef.current);
    try {
      await fetch("/api/voice-interview", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockId: sessionId }),
      });
      router.push(`/dashboard/voice-interview/${sessionId}/feedback`);
    } catch {
      toast.error("Failed to generate feedback");
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading interview session...</p>
        </div>
      </div>
    );
  }

  // Pre-start screen
  if (!proctorReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-lg w-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Ready to Begin?</h1>
          <p className="text-gray-400 mb-2">
            <strong className="text-white">{sessionData?.jobPosition}</strong> — {sessionData?.jobExperience} yrs exp
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 my-6 text-left">
            <h3 className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Proctoring Rules
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Interview runs in <strong>fullscreen mode</strong></li>
              <li>• Switching tabs will result in a <strong>flag</strong></li>
              <li>• After <strong>{maxFlags} flags</strong>, interview is auto-cancelled</li>
              <li>• AI will speak questions, you answer with your mic</li>
            </ul>
          </div>
          <button onClick={startInterview} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Flag Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-8 text-center border ${isCancelled ? "bg-red-950/90 border-red-500/50" : "bg-amber-950/90 border-amber-500/50"}`}>
            <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${isCancelled ? "text-red-400" : "text-amber-400"}`} />
            <h2 className={`text-xl font-bold mb-3 ${isCancelled ? "text-red-400" : "text-amber-400"}`}>
              {isCancelled ? "Interview Cancelled" : "Warning!"}
            </h2>
            <p className="text-gray-300 mb-6">{warningMessage}</p>
            {!isCancelled && (
              <button onClick={dismissWarning} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-all">
                I Understand, Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-bold text-sm">MockMate Voice</span>
          <span className="text-gray-500 text-xs">|</span>
          <span className="text-gray-400 text-sm">Q{currentQuestionNumber}/5</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm font-mono">{formatTime(elapsedTime)}</span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${flagCount > 0 ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-gray-500"}`}>
            🚩 {flagCount}/{maxFlags}
          </div>
          {isComplete ? (
            <button onClick={endInterview} disabled={isProcessing} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-sm font-semibold transition-all">
              {isProcessing ? "Generating..." : "View Feedback"}
            </button>
          ) : (
            <button onClick={endInterview} disabled={isProcessing} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg text-sm font-medium transition-all">
              End Early
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left - Webcam + AI Visualizer */}
        <div className="w-80 border-r border-zinc-800 flex flex-col">
          {/* AI Visualizer */}
          <div className="p-4 flex-1 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Pulsing rings */}
              <div className={`absolute inset-0 rounded-full border-2 ${isAISpeaking ? "border-emerald-500/60 animate-ping" : "border-zinc-700"} transition-colors`} />
              <div className={`absolute inset-4 rounded-full border-2 ${isAISpeaking ? "border-teal-500/40 animate-pulse" : "border-zinc-800"} transition-colors`} />
              <div className={`absolute inset-8 rounded-full ${isAISpeaking ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/30" : "bg-zinc-900"} flex items-center justify-center transition-colors`}>
                <div className={`w-16 h-16 rounded-full ${isAISpeaking ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50" : "bg-zinc-800"} flex items-center justify-center transition-all`}>
                  <Volume2 className={`w-7 h-7 ${isAISpeaking ? "text-white animate-pulse" : "text-gray-600"}`} />
                </div>
              </div>
              {isAISpeaking && (
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-emerald-400 text-xs font-semibold whitespace-nowrap animate-pulse">
                  AI is speaking...
                </p>
              )}
            </div>
          </div>

          {/* Webcam */}
          <div className="p-4 border-t border-zinc-800">
            <div className="relative bg-zinc-950 rounded-lg overflow-hidden h-44 border border-zinc-800">
              {!webcamEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
                  <p className="text-gray-600 text-xs">Webcam off</p>
                </div>
              )}
              <Webcam mirrored onUserMedia={() => setWebcamEnabled(true)} onUserMediaError={() => setWebcamEnabled(false)}
                style={{ height: "100%", width: "100%", objectFit: "cover", display: webcamEnabled ? "block" : "none" }} />
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-500/90 rounded-full animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-white text-[10px] font-semibold">REC</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Conversation + Controls */}
        <div className="flex-1 flex flex-col">
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {conversation.map((entry, i) => (
              <div key={i} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
                  entry.role === "user"
                    ? "bg-emerald-600/20 border border-emerald-500/30 text-gray-200"
                    : "bg-zinc-800/80 border border-zinc-700 text-gray-300"
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-semibold ${entry.role === "user" ? "text-emerald-400" : "text-teal-400"}`}>
                      {entry.role === "user" ? "You" : "AI Interviewer"}
                    </span>
                    {entry.isFollowUp && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">Follow-up</span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{entry.content}</p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-zinc-800/80 border border-zinc-700 rounded-2xl px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="w-4 h-4 text-teal-400 animate-spin" />
                    <span className="text-sm text-gray-400">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Controls */}
          <div className="border-t border-zinc-800 p-6 bg-zinc-900/50">
            <div className="flex items-center justify-center gap-4">
              {isComplete ? (
                <button onClick={endInterview} disabled={isProcessing}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-2">
                  {isProcessing ? <><LoaderCircle className="w-5 h-5 animate-spin" /> Generating Feedback...</> : "View Feedback →"}
                </button>
              ) : (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing || isAISpeaking}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isProcessing || isAISpeaking
                      ? "bg-zinc-800 text-gray-600 cursor-not-allowed"
                      : isRecording
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/40 hover:shadow-red-500/60 animate-pulse"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/40 hover:shadow-emerald-500/60"
                  }`}>
                  {isProcessing ? <LoaderCircle className="w-8 h-8 animate-spin" /> : isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              )}
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              {isAISpeaking ? "Wait for AI to finish speaking..." : isRecording ? "Recording... click to stop" : isProcessing ? "Processing your answer..." : isComplete ? "Interview complete!" : "Click mic to answer"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceInterviewSession;

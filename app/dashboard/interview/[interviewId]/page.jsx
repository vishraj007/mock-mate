"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lightbulb, Play, Camera } from "lucide-react";

function Interview() {
  const params = useParams();
  const interviewId = params?.interviewId;
  const router = useRouter();

  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Fetch interview data from API route (server-side DB call) */
  useEffect(() => {
    if (!interviewId) return;

    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/interview/${interviewId}`);

        if (!res.ok) throw new Error("Failed to fetch interview data");

        const data = await res.json();
        setInterviewData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load interview details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  /* Enable webcam and microphone */
  const handleEnableWebcam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebcamEnabled(true);
    } catch (err) {
      console.error("Webcam error:", err);
      alert("Could not access webcam/microphone. Please check your permissions.");
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Let's Get Started
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Left Column ── */}
          <div className="space-y-6">

            {/* Loading State */}
            {loading && (
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-zinc-700 rounded w-3/4" />
                  <div className="h-4 bg-zinc-700 rounded w-1/2" />
                  <div className="h-4 bg-zinc-700 rounded w-2/3" />
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Interview Details Card */}
            {interviewData && !loading && (
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 space-y-5">
                <div>
                  <span className="font-bold text-base text-emerald-400">
                    Job Role / Position:
                  </span>{" "}
                  <span className="font-normal text-base text-gray-300">
                    {interviewData.jobPostion}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-base text-emerald-400">
                    Tech Stack / Description:
                  </span>{" "}
                  <span className="font-normal text-base text-gray-300">
                    {interviewData.jobDesc}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-base text-emerald-400">
                    Years of Experience:
                  </span>{" "}
                  <span className="font-normal text-base text-gray-300">
                    {interviewData.jobExperience}
                  </span>
                </div>
              </div>
            )}

            {/* Information Card */}
            <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-400 mb-2">Information</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Enable Video Web Cam and Microphone to start your AI-generated
                    mock interview. It has 5 questions which you can answer, and at
                    the end you will get a report based on your answers.{" "}
                    <span className="font-semibold text-white">NOTE:</span> We never
                    record your video. You can disable webcam access anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Webcam ── */}
          <div className="flex flex-col items-center justify-start">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 w-full">
              <div className="flex flex-col items-center gap-6">

                {/* Webcam Preview / Placeholder */}
                {webcamEnabled ? (
                  <div className="w-full h-72 bg-zinc-950 rounded-lg border-2 border-emerald-500/30 flex items-center justify-center relative overflow-hidden shadow-lg shadow-emerald-500/10">
                    <video
                      ref={(video) => {
                        if (video && !video.srcObject) {
                          navigator.mediaDevices
                            .getUserMedia({ video: true, audio: true })
                            .then((stream) => {
                              video.srcObject = stream;
                              video.play();
                            })
                            .catch((err) => console.error("Webcam error:", err));
                        }
                      }}
                      className="w-full h-full object-cover scale-x-[-1]"
                      autoPlay
                      playsInline
                      muted
                    />
                  </div>
                ) : (
                  <div className="w-full h-72 bg-zinc-950 rounded-lg border-2 border-zinc-800 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="50" r="35" fill="#18181B" stroke="#3F3F46" strokeWidth="3" />
                        <circle cx="60" cy="50" r="30" fill="#27272A" stroke="#52525B" strokeWidth="2" />
                        <circle cx="60" cy="50" r="22" fill="#10B981" opacity="0.2" />
                        <circle cx="60" cy="50" r="16" fill="#10B981" opacity="0.3" />
                        <circle cx="60" cy="50" r="10" fill="#10B981" opacity="0.5" />
                        <circle cx="60" cy="50" r="6"  fill="#14B8A6" />
                        <circle cx="85" cy="35" r="4"  fill="#EF4444" opacity="0.6" />
                        <rect x="55" y="85" width="10" height="20" rx="2" fill="#3F3F46" />
                        <ellipse cx="60" cy="105" rx="25" ry="8" fill="#27272A" />
                      </svg>
                      <p className="text-gray-500 text-sm">Webcam Disabled</p>
                    </div>
                  </div>
                )}

                {/* Enable Webcam Button */}
                <button
                  onClick={handleEnableWebcam}
                  disabled={webcamEnabled}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 text-base font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {webcamEnabled ? "Webcam Enabled" : "Enable Web Cam and Microphone"}
                </button>

                {/* Start Interview Button */}
                <button
                  onClick={() => router.push(`/dashboard/interview/${interviewId}/start`)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-4 text-base font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Interview
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
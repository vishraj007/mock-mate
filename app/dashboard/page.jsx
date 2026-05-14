export const dynamic = "force-dynamic";

import React from "react";
import AddVoiceInterview from "./_components/AddVoiceInterview";
import InterviewList from "./_components/InterviewList";
import { Mic, MessageSquare, Shield, Zap } from "lucide-react";

function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-black p-6 md:p-10 overflow-x-hidden">

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="font-bold text-4xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-gray-400 mt-2 text-lg">
            Practice, improve, and ace your next interview
          </p>
        </div>

        {/* Create New Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left - Info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <Zap className="w-3 h-3" /> AI-POWERED VOICE INTERVIEW
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Start a New Mock Interview
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                  AI speaks the questions, you answer with your voice. Get intelligent follow-up questions and detailed feedback — just like a real interview.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { icon: Mic, label: "Voice-to-Voice" },
                    { icon: MessageSquare, label: "Follow-up Questions" },
                    { icon: Shield, label: "Proctored Mode" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      {label}
                    </div>
                  ))}
                </div>

                <AddVoiceInterview />
              </div>

              {/* Right - Visual */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-52 h-52">
                  {/* Animated rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" style={{ animationDuration: "3s" }} />
                  <div className="absolute inset-4 rounded-full border-2 border-teal-500/15 animate-pulse" />
                  <div className="absolute inset-8 rounded-full border border-emerald-500/10" />
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center backdrop-blur-sm border border-emerald-500/20">
                      <Mic className="w-9 h-9 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Interviews */}
        <InterviewList />
      </div>
    </div>
  );
}

export default Dashboard;
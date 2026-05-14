"use client";

import React from "react";
import AddVoiceInterview from "../_components/AddVoiceInterview";
import { Mic, Zap, MessageSquare, Shield } from "lucide-react";

function VoiceInterviewPage() {
  return (
    <div className="min-h-screen w-full bg-black p-6 md:p-10 overflow-x-hidden">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="font-bold text-4xl bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            AI Voice Interview
          </h2>
          <p className="text-gray-400 mt-2 text-lg">
            Experience a real interview — AI speaks questions, you answer with your voice
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Mic, title: "Voice-to-Voice", desc: "AI speaks questions, you answer naturally with your microphone" },
            { icon: MessageSquare, title: "Follow-up Questions", desc: "AI asks intelligent follow-ups based on your answers" },
            { icon: Shield, title: "Proctored", desc: "Fullscreen mode with tab-switch detection for realistic conditions" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <AddVoiceInterview />
        </div>
      </div>
    </div>
  );
}

export default VoiceInterviewPage;

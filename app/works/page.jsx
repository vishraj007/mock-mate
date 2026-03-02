"use client";

import React from "react";
import { 
  Sparkles, 
  Video, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2, 
  PlayCircle,
  FileText,
  Brain,
  Target,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
  const router =useRouter();
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>

      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Complete Interview Preparation Guide
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            How MockMate Works
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your all-in-one platform for mastering technical interviews with AI-powered practice
          </p>
        </div>

        {/* Three Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Mock Interviews */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Video className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mock Interviews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-generated interview questions tailored to your job role, experience, and tech stack
            </p>
          </div>

          {/* AI Quizzes */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 hover:border-teal-500/50 transition-all group">
            <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Quizzes</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Domain-specific MCQ quizzes to test and improve your technical knowledge
            </p>
          </div>

          {/* DSA Practice */}
       

        </div>

        {/* Mock Interview Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Video className="w-8 h-8 text-emerald-400" />
            Mock Interview Process
          </h2>

          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Enter Job Details
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Provide your target job position, tech stack, and years of experience. Our AI uses this to generate personalized interview questions.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-teal-400" />
                  Practice with AI Questions
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Answer 5 AI-generated questions using your webcam and microphone. Speech-to-text captures your responses in real-time.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Get AI Feedback
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Gemini AI evaluates each answer and provides detailed feedback with ratings (0-10), strengths, and improvement suggestions.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Track Progress
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Review comprehensive reports, track improvement over time, and identify areas needing more practice.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Quiz Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-teal-400" />
            AI Quiz System
          </h2>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  How Quizzes Work
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">Enter topics you want to practice (e.g., React, Node.js, Docker)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">AI generates 10 MCQ questions tailored to your topics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">Answer all questions and get instant results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">See correct answers and explanations for each question</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-400" />
                  Quiz Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-300 text-sm">Quick knowledge assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-300 text-sm">Identify weak areas instantly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-300 text-sm">Practice any domain or technology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-300 text-sm">Perfect for last-minute revision</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Speech-to-Text</h3>
              <p className="text-gray-400 text-sm">
                Advanced speech recognition captures your answers accurately in real-time
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gemini AI Powered</h3>
              <p className="text-gray-400 text-sm">
                Cutting-edge AI provides intelligent feedback and personalized suggestions
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Practice Anytime</h3>
              <p className="text-gray-400 text-sm">
                24/7 access to unlimited mock interviews and quizzes at your convenience
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Analytics</h3>
              <p className="text-gray-400 text-sm">
                Comprehensive performance reports with strengths and improvement areas
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Content</h3>
              <p className="text-gray-400 text-sm">
                Questions tailored to your specific role, experience level, and tech stack
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-gray-400 text-sm">
                Monitor your improvement journey with historical data and trends
              </p>
            </div>

          </div>
        </section>

        {/* CTA Section */}
       <section className="text-center bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl border border-zinc-800 p-12">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
    You're All Set!
  </h2>
  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
    Head back to your dashboard to track your progress, manage interviews, and continue your preparation journey.
  </p>
  <button
    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
    onClick={() => router.push("/dashboard")}
  >
    Back To Dashboard
  </button>
</section>


      </div>
    </div>
  );
}
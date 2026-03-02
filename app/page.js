import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Video, Brain, BarChart3, Shield, Mic, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user=await currentUser();

  if(user){
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
          
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Platform
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent leading-tight">
              MockMate
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Master your interviews with AI-driven practice sessions. Get personalized questions, 
              real-time feedback, and performance analytics to land your dream job.
            </p>
          </div>

          {/* CTA Button */}
         
          <div className="flex justify-center mb-20">
             <Link href="/sign-in">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
            
          </div>


       {/* this is grid section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            
            <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/80 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Webcam Simulation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Practice with real-time video recording and speech-to-text conversion for authentic interview experience.
                </p>
              </div>
            </div>

            <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/80 hover:border-teal-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Gemini AI Feedback</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Get intelligent analysis with performance scores, strengths identification, and actionable improvement tips.
                </p>
              </div>
            </div>

            <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/80 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Personalized Questions</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  AI generates custom interview questions based on your job description, skills, and experience level.
                </p>
              </div>
            </div>

            <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/80 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Performance Analytics</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Track your progress with detailed reports and insights to improve interview performance over time.
                </p>
              </div>
            </div>

          </div>

          {/* How It Works Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="space-y-6">
              
              <div className="flex items-start gap-4 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Enter Job Details</h3>
                  <p className="text-gray-400">Provide your job description, skills, and experience to get started.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Practice Interview</h3>
                  <p className="text-gray-400">Answer AI-generated questions using your webcam and microphone in a realistic setting.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Get AI Feedback</h3>
                  <p className="text-gray-400">Receive instant feedback with scores, strengths, and areas for improvement.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Take Domain Quizzes</h3>
                  <p className="text-gray-400">Sharpen your technical knowledge with domain-specific mock quizzes and assessments.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Everything You Need to Succeed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Secure Authentication</h4>
                  <p className="text-gray-400 text-sm">Protected by Clerk for safe and seamless session management.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Speech Recognition</h4>
                  <p className="text-gray-400 text-sm">Advanced speech-to-text for accurate answer transcription.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Detailed Reports</h4>
                  <p className="text-gray-400 text-sm">Comprehensive performance analytics and progress tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Technical Quizzes</h4>
                  <p className="text-gray-400 text-sm">Domain-specific assessments to boost your knowledge.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} MockMate. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
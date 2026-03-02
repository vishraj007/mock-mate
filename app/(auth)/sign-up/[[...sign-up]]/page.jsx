import { SignUp } from '@clerk/nextjs'
import { Sparkles, Video, Brain, BarChart3 } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black">

      {/* LEFT SIDE */}
      <div className="relative flex items-center justify-center overflow-hidden p-8 md:p-12">

        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              MockMate
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Platform
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 overflow-hidden">
              
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl"></div>
              
              {/* SVG Illustration */}
              <div className="relative">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Monitor/Screen */}
                  <rect x="50" y="40" width="300" height="180" rx="8" fill="#18181B" stroke="#3F3F46" strokeWidth="2"/>
                  <rect x="60" y="50" width="280" height="160" rx="4" fill="#09090B"/>
                  
                  {/* Video feed simulation */}
                  <circle cx="120" cy="100" r="25" fill="#10B981" opacity="0.2"/>
                  <circle cx="120" cy="100" r="20" fill="#10B981" opacity="0.3"/>
                  <circle cx="120" cy="95" r="8" fill="#34D399"/>
                  <ellipse cx="120" cy="110" rx="12" ry="15" fill="#34D399"/>
                  
                  {/* AI Analysis Lines */}
                  <line x1="200" y1="70" x2="320" y2="70" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="200" y1="90" x2="300" y2="90" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="200" y1="110" x2="310" y2="110" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="200" y1="130" x2="280" y2="130" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
                  
                  {/* Microphone icon */}
                  <circle cx="120" cy="170" r="12" fill="#10B981" opacity="0.2"/>
                  <rect x="115" y="165" width="10" height="15" rx="5" fill="#34D399"/>
                  <path d="M 110 180 Q 120 185 130 180" stroke="#34D399" strokeWidth="2" fill="none"/>
                  
                  {/* Monitor stand */}
                  <rect x="190" y="220" width="20" height="40" fill="#27272A"/>
                  <rect x="160" y="260" width="80" height="8" rx="4" fill="#27272A"/>
                  
                  {/* Floating elements - sparkles */}
                  <circle cx="320" cy="50" r="3" fill="#10B981" opacity="0.6"/>
                  <circle cx="340" cy="80" r="2" fill="#14B8A6" opacity="0.6"/>
                  <circle cx="310" cy="100" r="2.5" fill="#06B6D4" opacity="0.6"/>
                  <circle cx="70" cy="60" r="2" fill="#10B981" opacity="0.6"/>
                  <circle cx="90" cy="180" r="3" fill="#14B8A6" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE (SIGN UP CARD) */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          
          {/* Sign Up Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Start your interview preparation journey</p>
          </div>

          {/* Clerk Sign Up Component with Custom Styling */}
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-zinc-900/50 backdrop-blur-sm shadow-2xl border border-zinc-800 rounded-xl",
                headerTitle: "text-white text-2xl",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 transition-all",
                socialButtonsBlockButtonText: "text-white font-medium",
                formButtonPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all",
                formFieldInput: "bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500",
                formFieldLabel: "text-gray-300 font-medium",
                footerActionLink: "text-emerald-400 hover:text-emerald-300 font-medium",
                identityPreviewEditButton: "text-emerald-400 hover:text-emerald-300",
                formResendCodeLink: "text-emerald-400 hover:text-emerald-300",
                otpCodeFieldInput: "bg-zinc-800 border-zinc-700 text-white focus:ring-emerald-500 focus:border-emerald-500",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
                footer: "hidden", // Hide default footer if you want to add custom one
              },
            }}
          />

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <a href="/sign-in" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
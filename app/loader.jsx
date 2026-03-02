"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function Loadermate() {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* Loader Content */}
      <div className="relative z-10 text-center">
        
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Spinning ring */}
            <div className="w-24 h-24 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
            
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 animate-pulse">
          MockMate
        </h1>

        {/* Loading text */}
        <p className="text-gray-400 text-lg mb-2">
          Preparing your dashboard...
        </p>

        {/* Loading dots animation */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// USAGE IN YOUR DASHBOARD OR LAYOUT
// ============================================

/*
// Option 1: In your dashboard page
"use client";

import { useEffect, useState } from "react";
import MockMateLoader from "@/components/MockMateLoader";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or wait for data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust based on your actual loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <MockMateLoader />;
  }

  return (
    <div>
      // Your dashboard content
    </div>
  );
}

// ============================================

// Option 2: In your root layout (app/layout.js)
import { Suspense } from "react";
import MockMateLoader from "@/components/MockMateLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<MockMateLoader />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}

// ============================================

// Option 3: Conditional rendering based on user/data loading
"use client";

import { useUser } from "@clerk/nextjs";
import MockMateLoader from "@/components/MockMateLoader";

export default function Dashboard() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <MockMateLoader />;
  }

  return (
    <div>
      // Your dashboard content
    </div>
  );
}
*/
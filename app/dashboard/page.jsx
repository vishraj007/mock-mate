
import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import ADDNewInterview from "./_components/ADDNewInterview";
import InterviewList from "./_components/InterviewList";
import { useUser } from '@clerk/nextjs';
import Loadermate from '../loader';
function Dashboard() {
 

  return (

    <div className="min-h-screen w-full bg-black p-6 md:p-10 overflow-x-hidden">
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none"></div>
      
      {/* Gradient Orbs */}
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h2 className="font-bold text-4xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-gray-400 mt-2 text-lg">
           "Practice, improve, and ace your next interview"
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Add New Interview */}
          <div className="lg:col-span-1">
            <ADDNewInterview />
          </div>

          {/* Previous Interviews */}
          <div className="lg:col-span-3">
            <InterviewList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
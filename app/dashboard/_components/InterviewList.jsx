import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Calendar, Briefcase } from "lucide-react";

async function InterviewList() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const interviewList = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-xl mb-4 text-white">
        Previous Mock Interviews
      </h2>

      {interviewList.length === 0 && (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <p className="text-gray-400">
            No interviews found. Create your first mock interview to get started!
          </p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {interviewList.map((item) => (
          <div
            key={item.id}
            className="group border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 hover:border-emerald-500/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            {/* Header with icon */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Job title */}
                <h3 className="font-semibold text-lg text-white truncate">
                  {item.jobPostion}
                </h3>
                {/* Experience */}
                <p className="text-sm text-gray-400 mt-1">
                  {item.jobExperience} Years of Experience
                </p>
              </div>
            </div>

            {/* Job description / tech stack */}
            <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">
              {item.jobDesc}
            </p>

            {/* Date */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <Link
                href={`/dashboard/interview/${item.mockId}/feedback`}
                className="flex-1 px-4 py-2.5 border border-zinc-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all text-center"
              >
                Feedback
              </Link>

              <Link
                href={`/dashboard/interview/${item.mockId}`}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-500/30 text-center"
              >
                Start
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewList;
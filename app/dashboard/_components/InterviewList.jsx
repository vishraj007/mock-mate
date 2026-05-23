import { db } from "@/utils/db";
import { VoiceInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Calendar, Briefcase, RefreshCw } from "lucide-react";

// Retry helper — tries up to `attempts` times with delay between
async function withRetry(fn, attempts = 3, delayMs = 1000) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err; // last attempt, rethrow
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

async function InterviewList() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  let interviewList = [];
  let dbError = false;

  try {
    interviewList = await withRetry(() =>
      db
        .select()
        .from(VoiceInterview)
        .where(eq(VoiceInterview.createdBy, email))
        .orderBy(desc(VoiceInterview.id))
    );
  } catch (error) {
    console.error("DB Error:", error?.cause?.message || error?.message);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="mt-8">
        <h2 className="font-semibold text-xl mb-4 text-white">
          Previous Voice Interviews
        </h2>
        <div className="flex flex-col items-center justify-center py-14 bg-zinc-900/30 border border-red-500/20 rounded-xl text-center px-4">
          <RefreshCw className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-red-400 font-semibold mb-1">Could not load interviews</p>
          <p className="text-gray-400 text-sm mb-4">
            The database is warming up. This usually takes a few seconds.
          </p>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all"
          >
            Refresh Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-xl mb-4 text-white">
        Previous Voice Interviews
      </h2>

      {interviewList.length === 0 && (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <p className="text-gray-400">
            No interviews found. Create your first voice interview to get started!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {interviewList.map((item) => (
          <div
            key={item.id}
            className="group border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 hover:border-emerald-500/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-white truncate">
                  {item.jobPosition}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {item.jobExperience} Years of Experience
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">
              {item.jobDesc}
            </p>

            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                href={`/dashboard/voice-interview/${item.mockId}/feedback`}
                className="flex-1 px-4 py-2.5 border border-zinc-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all text-center"
              >
                Feedback
              </Link>
              <Link
                href={`/dashboard/voice-interview/${item.mockId}`}
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
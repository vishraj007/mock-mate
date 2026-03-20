"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function ADDNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const isFormValid =
    jobRole.trim() !== "" &&
    jobDesc.trim() !== "" &&
    experience !== "" &&
    Number(experience) >= 0 &&
    Number(experience) <= 35;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Get questions from Gemini
      const inputPrompt =
        "Job Position: " + jobRole +
        ", Job Description: " + jobDesc +
        ", Years of Experience: " + experience +
        ". Based on this information, generate 5 interview questions with answers in JSON format.";

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      const data = await res.json();

      if (!data.success) throw new Error("Gemini failed");

      const cleanJsonString = data.data
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      if (!cleanJsonString) {
        console.error("Empty response from Gemini");
        return;
      }

      // Step 2: Save to database via API route
      const dbRes = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole,
          jobDesc,
          experience,
          email: user?.primaryEmailAddress?.emailAddress,
          cleanJsonString,
        }),
      });

      const dbData = await dbRes.json();

      if (dbData.success && dbData.mockId) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + dbData.mockId);
      } else {
        console.error("DB insert failed:", dbData.error);
      }
    } catch (error) {
      console.error("Error submitting interview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-6 w-40 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/80 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="font-semibold text-sm text-white text-center">Add New</h2>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              Tell us more about Job you are interviewing
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add details about job position, your skills and years of experience
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Job Position / Role name
              </label>
              <Input
                placeholder="Ex. Full Stack Developer"
                value={jobRole}
                required
                onChange={(e) => setJobRole(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Job Description / Tech Stack in short
              </label>
              <Textarea
                placeholder="Ex. React, Next.js, Node.js, PostgreSQL"
                className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
                value={jobDesc}
                required
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                No of Year Experience
              </label>
              <Input
                type="number"
                min={0}
                max={35}
                placeholder="Ex. 2"
                value={experience}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (Number(value) >= 0 && Number(value) <= 35)) {
                    setExperience(value);
                  }
                }}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500">
                Experience must be between 0 and 35 years
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Generating from AI</span>
                  </div>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ADDNewInterview;
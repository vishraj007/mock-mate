"use client";

import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Mic } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddVoiceInterview() {
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
      const res = await fetch("/api/voice-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition: jobRole,
          jobDesc,
          jobExperience: experience,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await res.json();

      if (data.success && data.mockId) {
        setOpenDialog(false);
        toast.success("Voice interview created!");
        router.push("/dashboard/voice-interview/" + data.mockId);
      } else {
        toast.error("Failed to create voice interview");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenDialog(true)}
        className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200 flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Mic className="w-4 h-4" />
        </div>
        Create New Interview
      </button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              Start AI Voice Interview
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              AI will ask questions verbally and you answer with your voice. Follow-up questions included!
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Job Position / Role</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                value={jobRole}
                required
                onChange={(e) => setJobRole(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Job Description / Tech Stack</label>
              <Textarea
                placeholder="Ex. React, Next.js, Node.js, PostgreSQL"
                className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-teal-500 focus:border-teal-500"
                value={jobDesc}
                required
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Years of Experience</label>
              <Input
                type="number" min={0} max={35} placeholder="Ex. 2"
                value={experience} required
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || (Number(v) >= 0 && Number(v) <= 35)) setExperience(v);
                }}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}
                className="bg-zinc-800 hover:bg-zinc-700 text-white">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !isFormValid}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/50">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Start Voice Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddVoiceInterview;

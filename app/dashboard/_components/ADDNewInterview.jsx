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
import { db } from "@/utils/db";
import { v4 as uuidv4 } from 'uuid';
import { MockInterview } from "@/utils/schema";
import { useRouter } from "next/navigation";

function ADDNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);

  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  const router = useRouter();

  // ✅ Store Gemini response as STRING (hidden)
  const [questionsJSON, setQuestionsJSON] = useState("");

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

      if (!data.success) {
        throw new Error("Gemini failed");
      }

      // ✅ Clean & save as string (NOT rendered)
      const cleanJsonString = data.data
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      setQuestionsJSON(cleanJsonString); // stored, but hidden
      console.log("Saved Interview JSON (string):", cleanJsonString);
      
      if(cleanJsonString){
        const resp = await db.insert(MockInterview).values({
          jsonMockResp:cleanJsonString,
          jobPostion:jobRole,
          jobDesc:jobDesc,
          jobExperience:experience,
          createdBy:user?.primaryEmailAddress?.emailAddress ||"unknown",
          createdAt:new Date().toISOString(),
          mockId:uuidv4(),
        }).returning({mockId:MockInterview.mockId});
        console.log("Database Insert Response:",resp);
    
        if(resp){
          setOpenDialog(false);
          router.push('/dashboard/interview/'+resp[0].mockId);
        }
      }
      else{
        console.log("some error in fetching data ")
      } 

      setOpenDialog(false);
    } catch (error) {
      console.error("Error submitting interview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add New Card - MockMate Theme */}
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

      {/* Dialog - MockMate Theme */}
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

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            {/* Job Role */}
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

            {/* Job Description */}
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

            {/* Experience */}
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
                  if (
                    value === "" ||
                    (Number(value) >= 0 && Number(value) <= 35)
                  ) {
                    setExperience(value);
                  }
                }}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500">
                Experience must be between 0 and 35 years
              </p>
            </div>

            {/* Actions */}
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
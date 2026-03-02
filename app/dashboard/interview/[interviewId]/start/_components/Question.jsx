"use client";

import { Lightbulb, Volume2 } from "lucide-react";

function Question({ mockInterviewQuestion, activeQuestionIndex }) {

  const textToSpeech = (text) => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);

      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;

      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support Text to Speech");
    }
  };

  //  Ensure it's an array this is check because map only work on maps 
  if (!Array.isArray(mockInterviewQuestion)) {
    return null;
  }

  return (
    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm my-10">
      
      {/* Question Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            className={`p-3 rounded-lg text-xs md:text-sm text-center cursor-pointer transition-all duration-200
            ${activeQuestionIndex === index 
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30" 
              : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"}`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Question Text */}
      <h2 className="my-6 text-lg md:text-xl text-white font-medium leading-relaxed">
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>

      {/* Text to Speech */}
      <button
        onClick={() =>
          textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
        }
        className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-400 transition-all duration-200 group"
      >
        <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">Listen to Question</span>
      </button>

      {/* Note Section */}
      <div className="border border-emerald-500/30 rounded-xl p-5 bg-emerald-500/5 mt-8">
        <h2 className="flex gap-2 items-center text-emerald-400 mb-3">
          <Lightbulb className="w-5 h-5" />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-gray-300 leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE || "Click the record button when you're ready to answer. Speak clearly and take your time. You can review your answer and AI feedback after recording."}
        </h2>
      </div>
    </div>
  );
}

export default Question;
"use client";

import { useState, useEffect, useRef } from "react";
import { Pause, Play, X, CheckCircle } from "lucide-react";

export default function TimerModal({ task, onComplete, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(task.duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [purpose, setPurpose] = useState(task.title);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowCompleteForm(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    return ((task.duration * 60 - timeLeft) / (task.duration * 60)) * 100;
  };

  const handleComplete = () => {
    const actualTimeSpent = Math.round((task.duration * 60 - timeLeft) / 60);
    onComplete(actualTimeSpent || 1, purpose);
  };

  if (showCompleteForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#37352F] mb-2">
              Great Work!
            </h2>
            <p className="text-[#787774]">You completed the focus session</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              What did you accomplish?
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] resize-none"
              placeholder="Describe what you worked on..."
              rows="4"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-[#E3E2E0] text-[#37352F] rounded-lg hover:bg-[#F7F6F3] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors font-medium"
            >
              Complete Task
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Close Button */}
      <button
        onClick={onCancel}
        className="absolute top-8 right-8 p-3 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
      >
        <X size={24} />
      </button>

      <div className="text-center">
        {/* Task Info */}
        <div className="mb-8">
          <span className="px-4 py-2 bg-[#2383E2] text-white rounded-full text-sm font-semibold">
            {task.subject}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-2">
            {task.title}
          </h1>
          {task.description && (
            <p className="text-gray-300 text-lg">{task.description}</p>
          )}
        </div>

        {/* Timer Display */}
        <div className="relative mb-12">
          {/* Progress Circle */}
          <svg
            className="w-72 h-72 md:w-96 md:h-96 mx-auto"
            viewBox="0 0 200 200"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#2383E2"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 85}`}
              strokeDashoffset={`${2 * Math.PI * 85 * (1 - getProgress() / 100)}`}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>

          {/* Time Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-white font-mono mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-gray-400 text-sm">
                {Math.round(getProgress())}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isRunning
                ? "bg-[#F59E0B] hover:bg-[#D97706]"
                : "bg-[#10B981] hover:bg-[#059669]"
            }`}
          >
            {isRunning ? (
              <Pause size={32} className="text-white" />
            ) : (
              <Play size={32} className="text-white ml-1" />
            )}
          </button>

          {!isRunning && timeLeft < task.duration * 60 && (
            <button
              onClick={() => setShowCompleteForm(true)}
              className="px-6 py-3 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors font-medium"
            >
              End Session
            </button>
          )}
        </div>

        {/* Tips */}
        {!isRunning && (
          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-white text-sm">
                💡 <span className="font-semibold">Focus Tip:</span> Put your
                phone on silent and close unnecessary tabs. You've got this!
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

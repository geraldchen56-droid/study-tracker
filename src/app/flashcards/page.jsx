"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  BookOpen,
  Trash2,
  Edit2,
  Brain,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import NavigationSidebar from "@/components/NavigationSidebar";
import DeadlinesSidebar from "@/components/DeadlinesSidebar";

export default function FlashcardsPage() {
  const [showCreateSet, setShowCreateSet] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [newSet, setNewSet] = useState({
    title: "",
    subject: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await fetch("/api/subjects");
      if (!response.ok) throw new Error("Failed to fetch subjects");
      return response.json();
    },
  });

  // Fetch flashcard sets
  const { data: flashcardSets = [], isLoading } = useQuery({
    queryKey: ["flashcard-sets", selectedSubject],
    queryFn: async () => {
      const url =
        selectedSubject === "all"
          ? "/api/flashcard-sets"
          : `/api/flashcard-sets?subject=${selectedSubject}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch flashcard sets");
      return response.json();
    },
  });

  // Create flashcard set mutation
  const createSetMutation = useMutation({
    mutationFn: async (setData) => {
      const response = await fetch("/api/flashcard-sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setData),
      });
      if (!response.ok) throw new Error("Failed to create flashcard set");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-sets"]);
      setShowCreateSet(false);
      setNewSet({ title: "", subject: "", description: "" });
    },
  });

  // Delete flashcard set mutation
  const deleteSetMutation = useMutation({
    mutationFn: async (setId) => {
      const response = await fetch(`/api/flashcard-sets/${setId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete flashcard set");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-sets"]);
    },
  });

  const handleCreateSet = () => {
    if (!newSet.title || !newSet.subject) return;
    createSetMutation.mutate(newSet);
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      <NavigationSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#E3E2E0] dark:border-[#2C2C2C] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#37352F] dark:text-[#DEDEDE] flex items-center gap-3">
                <Brain size={32} className="text-[#8B5CF6]" />
                Flashcards
              </h1>
              <p className="text-[#787774] dark:text-[#A3A3A3] mt-1">
                Master your subjects with active recall
              </p>
            </div>
            <button
              onClick={() => setShowCreateSet(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            >
              <Plus size={20} />
              New Set
            </button>
          </div>

          {/* Subject Filter */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedSubject("all")}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedSubject === "all"
                  ? "bg-[#8B5CF6] text-white"
                  : "bg-[#F7F6F3] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#EDECEA] dark:hover:bg-[#383838]"
              }`}
            >
              All Subjects
            </button>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSubject === subject
                    ? "bg-[#8B5CF6] text-white"
                    : "bg-[#F7F6F3] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#EDECEA] dark:hover:bg-[#383838]"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {isLoading ? (
              <div className="text-center py-12 text-[#787774] dark:text-[#A3A3A3]">
                Loading flashcard sets...
              </div>
            ) : flashcardSets.length === 0 ? (
              <div className="text-center py-12">
                <Brain
                  size={64}
                  className="mx-auto text-[#E3E2E0] dark:text-[#2C2C2C] mb-4"
                />
                <p className="text-[#787774] dark:text-[#A3A3A3] text-lg">
                  No flashcard sets yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcardSets.map((set) => (
                  <div
                    key={set.id}
                    className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E3E2E0] dark:border-[#2C2C2C] overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#37352F] dark:text-[#DEDEDE] mb-1">
                            {set.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#8B5CF6] bg-opacity-10 text-[#8B5CF6] dark:text-[#A78BFA]">
                            {set.subject}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteSetMutation.mutate(set.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 rounded-lg"
                        >
                          <Trash2
                            size={18}
                            className="text-red-500 dark:text-red-400"
                          />
                        </button>
                      </div>

                      {set.description && (
                        <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mb-4">
                          {set.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-[#787774] dark:text-[#A3A3A3]">
                          {set.card_count || 0} cards
                        </span>
                        <span className="text-[#10B981] dark:text-[#34D399]">
                          {set.mastered_count || 0} mastered
                        </span>
                      </div>

                      <a
                        href={`/flashcards/${set.id}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                      >
                        <BookOpen size={18} />
                        Study
                        <ChevronRight size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeadlinesSidebar />

      {/* Create Set Modal */}
      {showCreateSet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#37352F] dark:text-[#DEDEDE] mb-6">
              Create Flashcard Set
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newSet.title}
                  onChange={(e) =>
                    setNewSet({ ...newSet, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#121212] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="e.g., Biology Chapter 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Subject
                </label>
                <select
                  value={newSet.subject}
                  onChange={(e) =>
                    setNewSet({ ...newSet, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#121212] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newSet.description}
                  onChange={(e) =>
                    setNewSet({ ...newSet, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#121212] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  rows="3"
                  placeholder="What's this set about?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateSet(false)}
                className="flex-1 px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSet}
                disabled={!newSet.title || !newSet.subject}
                className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

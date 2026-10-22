"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Plus,
  RotateCw,
  Check,
  X,
  Trash2,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function FlashcardSetPage({ params }) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });

  const queryClient = useQueryClient();

  // Fetch flashcard set with cards
  const { data: flashcardSet, isLoading } = useQuery({
    queryKey: ["flashcard-set", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/flashcard-sets/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch flashcard set");
      return response.json();
    },
  });

  // Create flashcard mutation
  const createCardMutation = useMutation({
    mutationFn: async (cardData) => {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setId: params.id, ...cardData }),
      });
      if (!response.ok) throw new Error("Failed to create flashcard");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-set", params.id]);
      setShowAddCard(false);
      setNewCard({ question: "", answer: "" });
    },
  });

  // Update flashcard mutation
  const updateCardMutation = useMutation({
    mutationFn: async ({ id, mastered }) => {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mastered }),
      });
      if (!response.ok) throw new Error("Failed to update flashcard");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-set", params.id]);
    },
  });

  // Delete flashcard mutation
  const deleteCardMutation = useMutation({
    mutationFn: async (cardId) => {
      const response = await fetch(`/api/flashcards/${cardId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete flashcard");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-set", params.id]);
    },
  });

  const handleAddCard = () => {
    if (!newCard.question || !newCard.answer) return;
    createCardMutation.mutate(newCard);
  };

  const handleMarkMastered = (cardId, mastered) => {
    updateCardMutation.mutate({ id: cardId, mastered });

    if (studyMode && currentCardIndex < cards.length - 1) {
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      }, 300);
    }
  };

  const startStudyMode = () => {
    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const exitStudyMode = () => {
    setStudyMode(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-center">
        <div className="text-[#787774] dark:text-[#A3A3A3]">Loading...</div>
      </div>
    );
  }

  const cards = flashcardSet?.cards || [];
  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#E3E2E0] dark:border-[#2C2C2C] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/flashcards"
                className="p-2 rounded-lg hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
              >
                <ArrowLeft
                  size={20}
                  className="text-[#37352F] dark:text-[#DEDEDE]"
                />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-[#37352F] dark:text-[#DEDEDE]">
                  {flashcardSet?.title}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm px-2 py-1 rounded-full bg-[#8B5CF6] bg-opacity-10 text-[#8B5CF6] dark:text-[#A78BFA]">
                    {flashcardSet?.subject}
                  </span>
                  <span className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                    {cards.length} cards
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {!studyMode && cards.length > 0 && (
                <button
                  onClick={startStudyMode}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                >
                  <Brain size={20} />
                  Study Mode
                </button>
              )}
              {!studyMode && (
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors"
                >
                  <Plus size={20} />
                  Add Card
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {studyMode ? (
          /* Study Mode */
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={exitStudyMode}
                className="text-[#787774] dark:text-[#A3A3A3] hover:text-[#37352F] dark:hover:text-[#DEDEDE] transition-colors"
              >
                ← Exit Study Mode
              </button>
              <div className="text-[#787774] dark:text-[#A3A3A3]">
                Card {currentCardIndex + 1} of {cards.length}
              </div>
            </div>

            {currentCard && (
              <div className="space-y-6">
                {/* Flashcard */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl border-2 border-[#E3E2E0] dark:border-[#2C2C2C] p-12 min-h-[400px] flex items-center justify-center cursor-pointer hover:border-[#8B5CF6] transition-all transform hover:scale-[1.02]"
                >
                  <div className="text-center">
                    <div className="text-sm text-[#787774] dark:text-[#A3A3A3] mb-4">
                      {isFlipped ? "Answer" : "Question"}
                    </div>
                    <div className="text-2xl text-[#37352F] dark:text-[#DEDEDE] font-medium">
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </div>
                    <div className="mt-8 text-sm text-[#787774] dark:text-[#A3A3A3]">
                      Click to flip
                    </div>
                  </div>
                </div>

                {/* Active Recall Controls */}
                {isFlipped && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleMarkMastered(currentCard.id, false)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                      Need Practice
                    </button>
                    <button
                      onClick={() => handleMarkMastered(currentCard.id, true)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-colors"
                    >
                      <Check size={20} />
                      Mastered!
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={prevCard}
                    disabled={currentCardIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  <button
                    onClick={nextCard}
                    disabled={currentCardIndex === cards.length - 1}
                    className="flex items-center gap-2 px-4 py-2 text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Card List */
          <div>
            {cards.length === 0 ? (
              <div className="text-center py-12">
                <Brain
                  size={64}
                  className="mx-auto text-[#E3E2E0] dark:text-[#2C2C2C] mb-4"
                />
                <p className="text-[#787774] dark:text-[#A3A3A3] text-lg">
                  No cards yet. Add your first flashcard!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E3E2E0] dark:border-[#2C2C2C] p-6 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm font-medium text-[#787774] dark:text-[#A3A3A3]">
                        Card {index + 1}
                      </span>
                      <div className="flex gap-2">
                        {card.mastered && (
                          <span className="text-[#10B981] dark:text-[#34D399]">
                            <Check size={18} />
                          </span>
                        )}
                        <button
                          onClick={() => deleteCardMutation.mutate(card.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-[#787774] dark:text-[#A3A3A3] mb-1">
                          Question
                        </div>
                        <div className="text-[#37352F] dark:text-[#DEDEDE]">
                          {card.question}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#787774] dark:text-[#A3A3A3] mb-1">
                          Answer
                        </div>
                        <div className="text-[#37352F] dark:text-[#DEDEDE]">
                          {card.answer}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleMarkMastered(card.id, !card.mastered)
                      }
                      className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors ${
                        card.mastered
                          ? "bg-[#10B981] bg-opacity-10 text-[#10B981] dark:text-[#34D399] hover:bg-opacity-20"
                          : "bg-[#F7F6F3] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#EDECEA] dark:hover:bg-[#383838]"
                      }`}
                    >
                      {card.mastered ? "Mastered ✓" : "Mark as Mastered"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-[#37352F] dark:text-[#DEDEDE] mb-6">
              Add Flashcard
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Question
                </label>
                <textarea
                  value={newCard.question}
                  onChange={(e) =>
                    setNewCard({ ...newCard, question: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#121212] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  rows="3"
                  placeholder="What's the question?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Answer
                </label>
                <textarea
                  value={newCard.answer}
                  onChange={(e) =>
                    setNewCard({ ...newCard, answer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#121212] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  rows="3"
                  placeholder="What's the answer?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCard(false)}
                className="flex-1 px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                disabled={!newCard.question || !newCard.answer}
                className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

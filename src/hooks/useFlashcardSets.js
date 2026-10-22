import { useState, useEffect } from "react";

export function useFlashcardSets() {
  const [flashcardSets, setFlashcardSets] = useState([]);

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      const response = await fetch("/api/flashcard-sets");
      if (!response.ok) throw new Error("Failed to fetch flashcard sets");
      const sets = await response.json();
      setFlashcardSets(sets.slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch flashcard sets:", err);
    }
  };

  return { flashcardSets };
}

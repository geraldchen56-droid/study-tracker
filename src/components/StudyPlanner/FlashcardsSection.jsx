import { Brain, Plus, ChevronRight } from "lucide-react";

export function FlashcardsSection({ flashcardSets }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] mb-8">
      <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-[#8B5CF6]" />
            <div>
              <h2 className="text-xl font-bold text-[#37352F] dark:text-[#DEDEDE]">
                Flashcards
              </h2>
              <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                Active recall for better retention
              </p>
            </div>
          </div>
          <a
            href="/flashcards"
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
          >
            <Plus size={18} />
            New Set
          </a>
        </div>
      </div>

      <div className="p-6">
        {flashcardSets.length === 0 ? (
          <div className="text-center py-8">
            <Brain
              size={48}
              className="mx-auto text-[#E3E2E0] dark:text-[#2C2C2C] mb-3"
            />
            <p className="text-[#787774] dark:text-[#A3A3A3] mb-4">
              No flashcard sets yet
            </p>
            <a
              href="/flashcards"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            >
              Create Your First Set
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {flashcardSets.map((set) => (
                <a
                  key={set.id}
                  href={`/flashcards/${set.id}`}
                  className="block bg-[#F7F6F3] dark:bg-[#2C2C2C] rounded-lg p-4 hover:bg-[#EDECEA] dark:hover:bg-[#383838] transition-all group border border-transparent hover:border-[#8B5CF6]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-[#37352F] dark:text-[#DEDEDE] group-hover:text-[#8B5CF6] transition-colors">
                      {set.title}
                    </h3>
                    <ChevronRight
                      size={18}
                      className="text-[#787774] dark:text-[#A3A3A3] group-hover:text-[#8B5CF6] transition-colors"
                    />
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-[#8B5CF6] bg-opacity-10 text-[#8B5CF6] dark:text-[#A78BFA] inline-block mb-3">
                    {set.subject}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#787774] dark:text-[#A3A3A3]">
                      {set.card_count || 0} cards
                    </span>
                    <span className="text-[#10B981] dark:text-[#34D399]">
                      {set.mastered_count || 0} ✓
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-4 text-center">
              <a
                href="/flashcards"
                className="text-[#8B5CF6] hover:text-[#7C3AED] transition-colors text-sm font-medium"
              >
                View all flashcard sets →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

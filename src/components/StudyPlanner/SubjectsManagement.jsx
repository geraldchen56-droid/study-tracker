import { Plus, BookOpen, Trash2 } from "lucide-react";

export function SubjectsManagement({
  timeBySubject,
  onAddSubject,
  onDeleteSubject,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] mb-8">
      <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
              Your Subjects
            </h3>
            <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mt-1">
              Manage the subjects you're studying. Add new subjects or remove
              existing ones.
            </p>
          </div>
          <button
            onClick={onAddSubject}
            className="flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors text-sm"
          >
            <Plus size={16} />
            Add Subject
          </button>
        </div>
      </div>
      <div className="p-6">
        {timeBySubject.length === 0 ? (
          <div className="text-center py-8 text-[#787774] dark:text-[#A3A3A3]">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No subjects yet</p>
            <p className="text-xs mt-1">
              Click "Add Subject" to create your first subject
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeBySubject.map((item) => (
              <div
                key={item.subject}
                className="flex items-center justify-between p-4 rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] hover:border-[#2383E2] transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                    {item.subject}
                  </h4>
                  <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                    {Math.floor(item.total_time / 60)}h {item.total_time % 60}m
                    total
                  </p>
                </div>
                <button
                  onClick={() => onDeleteSubject(item.subject)}
                  className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-[#787774] dark:text-[#A3A3A3] hover:text-[#EF4444] dark:hover:text-red-400 transition-colors"
                  title="Delete subject"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

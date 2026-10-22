import { Clock, BookOpen, Target } from "lucide-react";

export function StatsOverview({
  totalHours,
  totalMinutes,
  sessionsCount,
  subjectsCount,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="text-[#2383E2]" size={24} />
          <h3 className="text-sm font-medium text-[#787774] dark:text-[#A3A3A3]">
            Total Time
          </h3>
        </div>
        <p className="text-3xl font-semibold text-[#37352F] dark:text-[#DEDEDE]">
          {totalHours}h {totalMinutes}m
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-[#10B981]" size={24} />
          <h3 className="text-sm font-medium text-[#787774] dark:text-[#A3A3A3]">
            Sessions
          </h3>
        </div>
        <p className="text-3xl font-semibold text-[#37352F] dark:text-[#DEDEDE]">
          {sessionsCount}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] p-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="text-[#F59E0B]" size={24} />
          <h3 className="text-sm font-medium text-[#787774] dark:text-[#A3A3A3]">
            Subjects
          </h3>
        </div>
        <p className="text-3xl font-semibold text-[#37352F] dark:text-[#DEDEDE]">
          {subjectsCount}
        </p>
      </div>
    </div>
  );
}

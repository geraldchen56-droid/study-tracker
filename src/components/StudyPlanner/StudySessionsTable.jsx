import { Plus } from "lucide-react";

export function StudySessionsTable({
  sessions,
  onAddSession,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C]">
      <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C] flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
          Study Sessions
        </h3>
        <button
          onClick={onAddSession}
          className="flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
        >
          <Plus size={20} />
          Add Session
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F6F3] dark:bg-[#262626]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-[#A3A3A3] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-[#A3A3A3] uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-[#A3A3A3] uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-[#A3A3A3] uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-[#A3A3A3] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E2E0] dark:divide-[#2C2C2C]">
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#37352F] dark:text-[#DEDEDE]">
                  {new Date(session.study_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#37352F]">
                  {Math.floor(session.time_done / 60)}h {session.time_done % 60}
                  m
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#E3F2FD] text-[#1976D2]">
                    {session.subject}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#37352F] max-w-md truncate">
                  {session.purpose}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onEdit(session)}
                    className="text-[#2383E2] hover:text-[#1a6ec7] mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(session.id)}
                    className="text-[#EF4444] hover:text-[#DC2626]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

export function GiveUpModal({ show, onConfirm, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center">
            <AlertTriangle size={24} className="text-[#DC2626]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#37352F]">Give Up?</h2>
            <p className="text-sm text-[#787774]">
              This will clear all your data
            </p>
          </div>
        </div>

        <p className="text-[#37352F] mb-6">
          Are you sure you want to give up on your studies? This will
          permanently delete all your:
        </p>

        <ul className="mb-6 space-y-2 text-sm text-[#787774]">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></div>
            Study sessions and progress
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></div>
            Tasks and schedules
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></div>
            Subjects and deadlines
          </li>
        </ul>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-[#E3E2E0] text-[#37352F] rounded-lg hover:bg-[#F7F6F3] transition-colors font-medium"
          >
            Keep Going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors font-medium"
          >
            Give Up
          </button>
        </div>
      </div>
    </div>
  );
}

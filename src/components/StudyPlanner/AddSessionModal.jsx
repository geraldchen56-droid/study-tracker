export function AddSessionModal({
  show,
  formData,
  setFormData,
  onSubmit,
  onClose,
  editingSession,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-[#37352F] mb-2">
          {editingSession ? "Edit Study Session" : "Add Study Session"}
        </h2>
        <p className="text-sm text-[#787774] mb-4">
          {editingSession
            ? "Update your study session details"
            : "Log a new study session"}
        </p>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.study_date}
              onChange={(e) =>
                setFormData({ ...formData, study_date: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              Time Spent (minutes)
            </label>
            <input
              type="number"
              value={formData.time_done}
              onChange={(e) =>
                setFormData({ ...formData, time_done: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              placeholder="60"
              required
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              placeholder="e.g. Mathematics, Physics"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              What did you study?
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] resize-none"
              placeholder="e.g. Reviewed chapters 1-3, practiced equations"
              rows="3"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#E3E2E0] text-[#37352F] rounded-lg hover:bg-[#F7F6F3] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors font-medium"
            >
              {editingSession ? "Update" : "Add Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

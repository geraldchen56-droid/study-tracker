"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function DeadlinesSidebar() {
  const [deadlines, setDeadlines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [error, setError] = useState(null);
  const [showPastDeadlines, setShowPastDeadlines] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    due_date: new Date().toISOString().split("T")[0],
    deadline_type: "assessment",
    subject: "",
    what_to_do: "",
    what_to_study: "",
  });

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const response = await fetch("/api/deadlines");
      if (!response.ok) throw new Error("Failed to fetch deadlines");
      const data = await response.json();
      setDeadlines(data.deadlines);
    } catch (err) {
      console.error(err);
      setError("Failed to load deadlines");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingDeadline
        ? `/api/deadlines/${editingDeadline.id}`
        : "/api/deadlines";
      const method = editingDeadline ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save deadline");

      setShowAddModal(false);
      setEditingDeadline(null);
      setFormData({
        title: "",
        due_date: new Date().toISOString().split("T")[0],
        deadline_type: "assessment",
        subject: "",
        what_to_do: "",
        what_to_study: "",
      });
      fetchDeadlines();
    } catch (err) {
      console.error(err);
      setError("Failed to save deadline");
    }
  };

  const handleEdit = (deadline) => {
    setEditingDeadline(deadline);
    setFormData({
      title: deadline.title,
      due_date: deadline.due_date.split("T")[0],
      deadline_type: deadline.deadline_type,
      subject: deadline.subject,
      what_to_do: deadline.what_to_do || "",
      what_to_study: deadline.what_to_study || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this deadline?")) return;

    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete deadline");
      fetchDeadlines();
    } catch (err) {
      console.error(err);
      setError("Failed to delete deadline");
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update deadline");
      fetchDeadlines();
    } catch (err) {
      console.error(err);
      setError("Failed to update deadline");
    }
  };

  const getDaysUntil = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days) => {
    if (days < 0) return "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]";
    if (days <= 3) return "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]";
    if (days <= 7) return "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]";
    return "bg-[#F7F6F3] text-[#37352F] border-[#E3E2E0]";
  };

  const activeDeadlines = deadlines.filter((d) => !d.completed);
  const pastDeadlines = deadlines.filter((d) => d.completed);

  return (
    <>
      <div className="w-80 bg-white dark:bg-[#1E1E1E] border-l border-[#E3E2E0] dark:border-[#2C2C2C] h-screen overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-[#E3E2E0] dark:border-[#2C2C2C] flex justify-between items-center sticky top-0 bg-white dark:bg-[#1E1E1E] z-10">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-[#F59E0B]" size={20} />
            <h2 className="font-semibold text-[#37352F] dark:text-[#DEDEDE]">
              Deadlines
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingDeadline(null);
              setFormData({
                title: "",
                due_date: new Date().toISOString().split("T")[0],
                deadline_type: "assessment",
                subject: "",
                what_to_do: "",
                what_to_study: "",
              });
              setShowAddModal(true);
            }}
            className="p-1.5 rounded hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
          >
            <Plus size={18} className="text-[#37352F] dark:text-[#DEDEDE]" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 p-4 space-y-3">
          {activeDeadlines.length === 0 && pastDeadlines.length === 0 ? (
            <div className="text-center py-12 text-[#787774] dark:text-[#A3A3A3]">
              <AlertCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No deadlines yet</p>
              <p className="text-xs mt-1">Click + to add one</p>
            </div>
          ) : (
            <>
              {/* Active Deadlines */}
              {activeDeadlines.map((deadline) => {
                const daysUntil = getDaysUntil(deadline.due_date);
                const urgencyColor = getUrgencyColor(daysUntil);

                return (
                  <div
                    key={deadline.id}
                    className={`p-4 rounded-lg border ${urgencyColor} transition-all hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <button
                        onClick={() =>
                          handleToggleComplete(deadline.id, deadline.completed)
                        }
                        className="mt-0.5 w-5 h-5 rounded border-2 border-current flex items-center justify-center hover:bg-white hover:bg-opacity-30 transition-colors flex-shrink-0"
                      >
                        {deadline.completed && <Check size={14} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-white bg-opacity-50">
                            {deadline.deadline_type}
                          </span>
                          <span className="text-xs font-medium">
                            {deadline.subject}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">
                          {deadline.title}
                        </h3>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(deadline)}
                          className="p-1 rounded hover:bg-white hover:bg-opacity-50 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(deadline.id)}
                          className="p-1 rounded hover:bg-white hover:bg-opacity-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs mb-3 ml-7">
                      <Calendar size={12} />
                      <span>
                        {new Date(deadline.due_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="font-semibold">
                        {daysUntil < 0
                          ? `${Math.abs(daysUntil)} days overdue`
                          : daysUntil === 0
                            ? "Due today!"
                            : `${daysUntil} days left`}
                      </span>
                    </div>

                    {deadline.what_to_do && (
                      <div className="mb-2 ml-7">
                        <p className="text-xs font-semibold mb-1">To Do:</p>
                        <p className="text-xs opacity-90">
                          {deadline.what_to_do}
                        </p>
                      </div>
                    )}

                    {deadline.what_to_study && (
                      <div className="ml-7">
                        <p className="text-xs font-semibold mb-1">To Study:</p>
                        <p className="text-xs opacity-90">
                          {deadline.what_to_study}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Past Deadlines Section */}
              {pastDeadlines.length > 0 && (
                <div className="pt-4 border-t border-[#E3E2E0]">
                  <button
                    onClick={() => setShowPastDeadlines(!showPastDeadlines)}
                    className="flex items-center gap-2 text-sm font-medium text-[#787774] hover:text-[#37352F] transition-colors mb-3"
                  >
                    {showPastDeadlines ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    Past Deadlines ({pastDeadlines.length})
                  </button>
                  {showPastDeadlines && (
                    <div className="space-y-2">
                      {pastDeadlines.map((deadline) => (
                        <div
                          key={deadline.id}
                          className="p-3 rounded-lg border border-[#E3E2E0] bg-[#F7F6F3] opacity-60"
                        >
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() =>
                                handleToggleComplete(
                                  deadline.id,
                                  deadline.completed,
                                )
                              }
                              className="mt-0.5 w-4 h-4 rounded border-2 border-[#10B981] bg-[#10B981] flex items-center justify-center flex-shrink-0"
                            >
                              <Check size={12} className="text-white" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-white">
                                  {deadline.deadline_type}
                                </span>
                                <span className="text-xs font-medium">
                                  {deadline.subject}
                                </span>
                              </div>
                              <h3 className="font-semibold text-sm line-through">
                                {deadline.title}
                              </h3>
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <Calendar size={10} />
                                <span>
                                  {new Date(
                                    deadline.due_date,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(deadline.id)}
                              className="p-1 rounded hover:bg-white transition-colors flex-shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#37352F] dark:text-[#DEDEDE] mb-4">
              {editingDeadline ? "Edit Deadline" : "Add Deadline"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="Final Exam"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                    Type
                  </label>
                  <select
                    value={formData.deadline_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deadline_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                    required
                  >
                    <option value="assessment">Assessment</option>
                    <option value="exam">Exam</option>
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="Mathematics"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  What to Do
                </label>
                <textarea
                  value={formData.what_to_do}
                  onChange={(e) =>
                    setFormData({ ...formData, what_to_do: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] resize-none"
                  placeholder="Complete practice problems, review notes..."
                  rows="3"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  What to Study
                </label>
                <textarea
                  value={formData.what_to_study}
                  onChange={(e) =>
                    setFormData({ ...formData, what_to_study: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] resize-none"
                  placeholder="Chapters 1-5, focus on calculus..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDeadline(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] text-[#37352F] dark:text-[#DEDEDE] rounded-lg hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
                >
                  {editingDeadline ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Check,
  Trash2,
  X,
  Edit2,
  GripVertical,
} from "lucide-react";
import DeadlinesSidebar from "@/components/DeadlinesSidebar";
import NavigationSidebar from "@/components/NavigationSidebar";

export default function KanbanPage() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStudyLogModal, setShowStudyLogModal] = useState(false);
  const [completingTask, setCompletingTask] = useState(null);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showCompleted, setShowCompleted] = useState({});
  const [editingSubject, setEditingSubject] = useState(null);
  const [editedSubjectName, setEditedSubjectName] = useState("");
  const [showNavigator, setShowNavigator] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
  });

  const [studyLogData, setStudyLogData] = useState({
    time_done: "",
    purpose: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchSubjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects");
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects(data.subjects);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save task");

      setShowAddModal(false);
      setFormData({
        subject: "",
        title: "",
        description: "",
      });
      fetchTasks();
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setError("Failed to save task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task status");
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to update task status");
    }
  };

  const handleToggleComplete = async (task) => {
    if (!task.completed) {
      // Show study log modal when marking as complete
      setCompletingTask(task);
      setStudyLogData({
        time_done: "",
        purpose: task.title,
      });
      setShowStudyLogModal(true);
    } else {
      // Just toggle back to incomplete
      try {
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: false }),
        });

        if (!response.ok) throw new Error("Failed to update task");
        fetchTasks();
      } catch (err) {
        console.error(err);
        setError("Failed to update task");
      }
    }
  };

  const handleStudyLogSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Create study session
      const sessionResponse = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_date: new Date().toISOString().split("T")[0],
          time_done: parseInt(studyLogData.time_done),
          purpose: studyLogData.purpose,
          subject: completingTask.subject,
        }),
      });

      if (!sessionResponse.ok) throw new Error("Failed to log study session");

      // Mark task as completed
      const taskResponse = await fetch(`/api/tasks/${completingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      if (!taskResponse.ok) throw new Error("Failed to complete task");

      setShowStudyLogModal(false);
      setCompletingTask(null);
      setStudyLogData({ time_done: "", purpose: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to complete task");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      handleStatusChange(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };

  const handleRenameSubject = async (oldSubject) => {
    if (!editedSubjectName.trim() || editedSubjectName === oldSubject) {
      setEditingSubject(null);
      setEditedSubjectName("");
      return;
    }

    try {
      // Update all tasks with this subject
      const tasksToUpdate = tasks.filter((t) => t.subject === oldSubject);

      for (const task of tasksToUpdate) {
        await fetch(`/api/tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: editedSubjectName.trim() }),
        });
      }

      setEditingSubject(null);
      setEditedSubjectName("");
      fetchTasks();
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setError("Failed to rename subject");
    }
  };

  const TaskCard = ({ task }) => (
    <div
      draggable={!task.completed}
      onDragStart={(e) => handleDragStart(e, task)}
      className={`bg-white p-3 rounded-lg border border-[#E3E2E0] shadow-sm hover:shadow-md transition-shadow ${!task.completed ? "cursor-move" : "opacity-60"}`}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => handleToggleComplete(task)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center hover:bg-[#F7F6F3] transition-colors flex-shrink-0 ${
            task.completed
              ? "border-[#10B981] bg-[#10B981]"
              : "border-[#E3E2E0]"
          }`}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-[#37352F] text-sm mb-1 ${task.completed ? "line-through" : ""}`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-[#787774] mb-2">{task.description}</p>
          )}
        </div>
        <button
          onClick={() => handleDelete(task.id)}
          className="text-[#787774] hover:text-[#EF4444] flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  const SubjectBoard = ({ subject }) => {
    const subjectTasks = tasks.filter((t) => t.subject === subject);
    const todoTasks = subjectTasks.filter(
      (t) => t.status === "todo" && !t.completed,
    );
    const inProgressTasks = subjectTasks.filter(
      (t) => t.status === "in_progress" && !t.completed,
    );
    const doneTasks = subjectTasks.filter(
      (t) => t.status === "done" && !t.completed,
    );
    const completedTasks = subjectTasks.filter((t) => t.completed);

    return (
      <div className="mb-8 bg-white rounded-lg border border-[#E3E2E0] p-6">
        <div className="flex justify-between items-center mb-6">
          {editingSubject === subject ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editedSubjectName}
                onChange={(e) => setEditedSubjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubject(subject);
                  if (e.key === "Escape") {
                    setEditingSubject(null);
                    setEditedSubjectName("");
                  }
                }}
                className="px-3 py-2 border border-[#2383E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] text-xl font-semibold text-[#37352F] max-w-md"
                autoFocus
              />
              <button
                onClick={() => handleRenameSubject(subject)}
                className="p-2 rounded-lg bg-[#10B981] text-white hover:bg-[#059669] transition-colors"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => {
                  setEditingSubject(null);
                  setEditedSubjectName("");
                }}
                className="p-2 rounded-lg bg-[#E3E2E0] text-[#37352F] hover:bg-[#D1D0CE] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-[#37352F]">
                {subject}
              </h2>
              <button
                onClick={() => {
                  setEditingSubject(subject);
                  setEditedSubjectName(subject);
                }}
                className="p-1.5 rounded hover:bg-[#F7F6F3] text-[#787774] hover:text-[#37352F] transition-colors"
                title="Rename subject"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setFormData({
                subject: subject,
                title: "",
                description: "",
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors text-sm"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do Column */}
          <div
            className="bg-[#FAFAFA] rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "todo")}
          >
            <h3 className="font-semibold text-[#37352F] flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#787774]"></div>
              To Do
              <span className="text-xs text-[#787774] font-normal">
                {todoTasks.length}
              </span>
            </h3>
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {todoTasks.length === 0 && (
                <div className="text-center py-8 text-[#787774] text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div
            className="bg-[#FAFAFA] rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "in_progress")}
          >
            <h3 className="font-semibold text-[#37352F] flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#2383E2]"></div>
              In Progress
              <span className="text-xs text-[#787774] font-normal">
                {inProgressTasks.length}
              </span>
            </h3>
            <div className="space-y-2">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-8 text-[#787774] text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div
            className="bg-[#FAFAFA] rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "done")}
          >
            <h3 className="font-semibold text-[#37352F] flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              Done
              <span className="text-xs text-[#787774] font-normal">
                {doneTasks.length}
              </span>
            </h3>
            <div className="space-y-2">
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {doneTasks.length === 0 && (
                <div className="text-center py-8 text-[#787774] text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E3E2E0]">
            <button
              onClick={() =>
                setShowCompleted({
                  ...showCompleted,
                  [subject]: !showCompleted[subject],
                })
              }
              className="flex items-center gap-2 text-sm font-medium text-[#787774] hover:text-[#37352F] transition-colors mb-3"
            >
              <Check size={16} />
              Completed ({completedTasks.length})
            </button>
            {showCompleted[subject] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      {/* Navigation Sidebar */}
      <NavigationSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C] bg-white dark:bg-[#1E1E1E] sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                  Task Board
                </h1>
                <p className="text-[#787774] dark:text-[#A3A3A3] text-sm">
                  Organize tasks by subject with drag-and-drop
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {subjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#787774] mb-4">
                No subjects yet. Add a study session on the main page to get
                started!
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          ) : (
            subjects.map((subject) => (
              <SubjectBoard key={subject} subject={subject} />
            ))
          )}
        </div>
      </div>

      {/* Deadlines Sidebar */}
      <DeadlinesSidebar />

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[#37352F] mb-4">
              Add Task
            </h2>
            <form onSubmit={handleSubmit}>
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
                  className="w-full px-3 py-2 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="Mathematics"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="Complete chapter 5 exercises"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#37352F] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] resize-none"
                  placeholder="Focus on problems 1-20..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-[#E3E2E0] text-[#37352F] rounded-lg hover:bg-[#F7F6F3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Log Modal */}
      {showStudyLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[#37352F] mb-2">
              Log Study Time
            </h2>
            <p className="text-sm text-[#787774] mb-4">
              Great job completing &quot;{completingTask?.title}&quot;! How much
              time did you spend?
            </p>
            <form onSubmit={handleStudyLogSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] mb-2">
                  Time Spent (minutes)
                </label>
                <input
                  type="number"
                  value={studyLogData.time_done}
                  onChange={(e) =>
                    setStudyLogData({
                      ...studyLogData,
                      time_done: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="60"
                  required
                  min="1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#37352F] mb-2">
                  Purpose
                </label>
                <textarea
                  value={studyLogData.purpose}
                  onChange={(e) =>
                    setStudyLogData({
                      ...studyLogData,
                      purpose: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] resize-none"
                  placeholder="What did you work on?"
                  rows="3"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowStudyLogModal(false);
                    setCompletingTask(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#E3E2E0] text-[#37352F] rounded-lg hover:bg-[#F7F6F3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors"
                >
                  Complete Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

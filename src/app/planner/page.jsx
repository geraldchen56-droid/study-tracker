"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Clock,
  Play,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  GripVertical,
  Menu,
  LayoutGrid,
  Home,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TimerModal from "@/components/TimerModal";

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedScheduledTask, setDraggedScheduledTask] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [dropTime, setDropTime] = useState(null);
  const [durationInput, setDurationInput] = useState(60);
  const [showNavigator, setShowNavigator] = useState(false);
  const [collapsedSubjects, setCollapsedSubjects] = useState({});

  useEffect(() => {
    fetchScheduledTasks();
    fetchAvailableTasks();
  }, [selectedDate]);

  const fetchScheduledTasks = async () => {
    try {
      const response = await fetch(`/api/scheduled-tasks?date=${selectedDate}`);
      if (!response.ok) throw new Error("Failed to fetch scheduled tasks");
      const data = await response.json();
      setScheduledTasks(data.scheduledTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      const incompleteTasks = data.tasks.filter((t) => !t.completed);
      setAvailableTasks(incompleteTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStartPending = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragStartScheduled = (e, scheduledTask) => {
    setDraggedScheduledTask(scheduledTask);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const handleDropOnTimeSlot = async (e, time) => {
    e.preventDefault();

    if (draggedTask) {
      setDropTime(time);
      setShowDurationModal(true);
    } else if (draggedScheduledTask) {
      await moveScheduledTask(draggedScheduledTask, time);
      setDraggedScheduledTask(null);
    }
  };

  const scheduleTaskAtTime = async () => {
    if (!draggedTask || !dropTime) return;

    try {
      const newTaskMinutes = timeToMinutes(dropTime);
      const newTaskEnd = newTaskMinutes + durationInput;

      const tasksToShift = scheduledTasks.filter((st) => {
        const taskStart = timeToMinutes(st.start_time.substring(0, 5));
        return taskStart >= newTaskMinutes && taskStart < newTaskEnd;
      });

      const response = await fetch("/api/scheduled-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: draggedTask.id,
          scheduled_date: selectedDate,
          start_time: dropTime,
          duration: durationInput,
        }),
      });

      if (!response.ok) throw new Error("Failed to schedule task");

      for (const task of tasksToShift) {
        const taskStart = timeToMinutes(task.start_time.substring(0, 5));
        const shiftedStart = minutesToTime(
          newTaskEnd + (taskStart - newTaskMinutes),
        );

        await fetch(`/api/scheduled-tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start_time: shiftedStart }),
        });
      }

      setShowDurationModal(false);
      setDraggedTask(null);
      setDropTime(null);
      setDurationInput(60);
      fetchScheduledTasks();
      fetchAvailableTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const moveScheduledTask = async (scheduledTask, newTime) => {
    try {
      const oldStart = timeToMinutes(scheduledTask.start_time.substring(0, 5));
      const newStart = timeToMinutes(newTime);
      const taskDuration = scheduledTask.duration;
      const newEnd = newStart + taskDuration;

      const tasksToShift = scheduledTasks.filter((st) => {
        if (st.id === scheduledTask.id) return false;
        const taskStart = timeToMinutes(st.start_time.substring(0, 5));

        if (newStart > oldStart) {
          return taskStart > oldStart && taskStart < newEnd;
        } else {
          return taskStart >= newStart && taskStart < oldStart;
        }
      });

      await fetch(`/api/scheduled-tasks/${scheduledTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_time: newTime }),
      });

      for (const task of tasksToShift) {
        const taskStart = timeToMinutes(task.start_time.substring(0, 5));
        let shiftedStart;

        if (newStart > oldStart) {
          shiftedStart = minutesToTime(taskStart - taskDuration);
        } else {
          shiftedStart = minutesToTime(taskStart + taskDuration);
        }

        await fetch(`/api/scheduled-tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start_time: shiftedStart }),
        });
      }

      fetchScheduledTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBeginTask = (scheduledTask) => {
    setActiveTask(scheduledTask);
    setShowTimerModal(true);
  };

  const handleDeleteScheduledTask = async (id) => {
    if (!confirm("Remove this task from your schedule?")) return;

    try {
      const response = await fetch(`/api/scheduled-tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete scheduled task");
      fetchScheduledTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimerComplete = async (timeSpent, purpose) => {
    try {
      await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_date: selectedDate,
          time_done: timeSpent,
          purpose: purpose,
          subject: activeTask.subject,
        }),
      });

      await fetch(`/api/tasks/${activeTask.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      await fetch(`/api/scheduled-tasks/${activeTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      setShowTimerModal(false);
      setActiveTask(null);
      fetchScheduledTasks();
      fetchAvailableTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check if a task occupies this time slot
  const isSlotOccupied = (time) => {
    const slotMinutes = timeToMinutes(time);
    return scheduledTasks.some((st) => {
      const taskStart = timeToMinutes(st.start_time.substring(0, 5));
      const taskEnd = taskStart + st.duration;
      return slotMinutes >= taskStart && slotMinutes < taskEnd;
    });
  };

  // Get task that starts at this time slot
  const getTaskStartingAt = (time) => {
    return scheduledTasks.find((st) => st.start_time.substring(0, 5) === time);
  };

  // Calculate task height based on duration (each slot is 60px, so 30 min = 60px, 60 min = 120px, etc)
  const getTaskHeight = (duration) => {
    return (duration / 30) * 60; // 60px per 30-minute slot
  };

  // Group tasks by subject
  const tasksBySubject = availableTasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = [];
    }
    acc[task.subject].push(task);
    return acc;
  }, {});

  const subjects = Object.keys(tasksBySubject).sort();

  const toggleSubject = (subject) => {
    setCollapsedSubjects((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]">
        <div className="bg-white border-b border-[#E3E2E0] sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a
                  href="/"
                  className="p-2 rounded-lg hover:bg-[#F7F6F3] transition-colors"
                >
                  <ArrowLeft size={20} className="text-[#37352F]" />
                </a>
                <div>
                  <h1 className="text-2xl font-bold text-[#37352F]">
                    Daily Planner
                  </h1>
                  <p className="text-sm text-[#787774]">
                    Drag tasks to schedule them
                  </p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNavigator(!showNavigator)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#37352F] text-white rounded-lg hover:bg-[#2C2A26] transition-colors"
                >
                  <Menu size={18} />
                  Navigator
                </button>

                {showNavigator && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowNavigator(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#E3E2E0] z-30">
                      <div className="py-2">
                        <a
                          href="/"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F3] transition-colors text-[#37352F]"
                        >
                          <Home size={18} />
                          <span className="font-medium">Dashboard</span>
                        </a>
                        <a
                          href="/planner"
                          className="flex items-center gap-3 px-4 py-3 bg-[#F0F7FF] text-[#2383E2] font-semibold"
                        >
                          <CalendarDays size={18} />
                          <span>Daily Planner</span>
                        </a>
                        <a
                          href="/kanban"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F3] transition-colors text-[#37352F]"
                        >
                          <LayoutGrid size={18} />
                          <span className="font-medium">Task Board</span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-[#E3E2E0]">
              <div className="p-6 border-b border-[#E3E2E0] bg-gradient-to-r from-[#2383E2] to-[#1a6ec7] text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => changeDate(-1)}
                    className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </h2>
                    <p className="text-sm opacity-90">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => changeDate(1)}
                    className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[700px] overflow-y-auto">
                <div className="space-y-0">
                  {timeSlots.map((time, index) => {
                    const taskStartingHere = getTaskStartingAt(time);
                    const isOccupied = isSlotOccupied(time);
                    const isHourMark = time.endsWith(":00");

                    // Skip rendering this slot if it's occupied by a task that started earlier
                    if (isOccupied && !taskStartingHere) {
                      return null;
                    }

                    return (
                      <div
                        key={time}
                        className={`flex gap-4 group ${isHourMark ? "border-t border-[#E3E2E0] pt-2" : ""}`}
                        style={{
                          minHeight: taskStartingHere
                            ? `${getTaskHeight(taskStartingHere.duration)}px`
                            : "60px",
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnTimeSlot(e, time)}
                      >
                        <div
                          className={`w-24 flex-shrink-0 text-sm ${isHourMark ? "font-semibold" : "font-normal"} text-[#787774] pt-2`}
                        >
                          {formatTime(time)}
                        </div>
                        <div
                          className={`flex-1 border-l-2 ${draggedTask || draggedScheduledTask ? "border-[#2383E2] bg-[#F0F7FF]" : "border-[#E3E2E0]"} pl-4 pb-2 group-hover:border-[#2383E2] transition-colors`}
                        >
                          {taskStartingHere ? (
                            <div
                              draggable
                              onDragStart={(e) =>
                                handleDragStartScheduled(e, taskStartingHere)
                              }
                              className="bg-gradient-to-r from-[#EBF4FF] to-[#E3F2FD] border border-[#2383E2] rounded-lg p-3 hover:shadow-md transition-all cursor-move h-full flex flex-col"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 flex-1">
                                  <GripVertical
                                    size={16}
                                    className="text-[#2383E2] mt-1 flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#2383E2] text-white">
                                        {taskStartingHere.subject}
                                      </span>
                                      <span className="text-xs text-[#787774] flex items-center gap-1">
                                        <Clock size={12} />
                                        {taskStartingHere.duration} min
                                      </span>
                                    </div>
                                    <h3 className="font-semibold text-[#37352F] text-sm mb-1">
                                      {taskStartingHere.title}
                                    </h3>
                                    {taskStartingHere.description && (
                                      <p className="text-xs text-[#787774] line-clamp-2">
                                        {taskStartingHere.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-2">
                                  <button
                                    onClick={() =>
                                      handleBeginTask(taskStartingHere)
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium"
                                  >
                                    <Play size={12} />
                                    Begin
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteScheduledTask(
                                        taskStartingHere.id,
                                      )
                                    }
                                    className="p-1.5 text-[#787774] hover:text-[#EF4444] hover:bg-red-50 rounded transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-[#C4C4C4] pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              Drop task here
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-[#E3E2E0]">
              <div className="p-6 border-b border-[#E3E2E0] bg-[#F7F6F3]">
                <h3 className="font-bold text-[#37352F] flex items-center gap-2">
                  <CalendarIcon size={20} className="text-[#2383E2]" />
                  Pending Tasks
                </h3>
                <p className="text-xs text-[#787774] mt-1">
                  Drag tasks to calendar to schedule
                </p>
              </div>
              <div className="p-4 max-h-[700px] overflow-y-auto">
                {subjects.length === 0 ? (
                  <div className="text-center py-12 text-[#787774]">
                    <CalendarIcon
                      size={48}
                      className="mx-auto mb-3 opacity-30"
                    />
                    <p className="text-sm">No pending tasks</p>
                    <a
                      href="/kanban"
                      className="text-xs text-[#2383E2] hover:underline mt-2 inline-block"
                    >
                      Go to Task Board to add tasks
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <div
                        key={subject}
                        className="border border-[#E3E2E0] rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSubject(subject)}
                          className="w-full flex items-center justify-between p-3 bg-[#F7F6F3] hover:bg-[#EEEDE9] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#2383E2] text-white">
                              {subject}
                            </span>
                            <span className="text-xs text-[#787774]">
                              {tasksBySubject[subject].length}{" "}
                              {tasksBySubject[subject].length === 1
                                ? "task"
                                : "tasks"}
                            </span>
                          </div>
                          {collapsedSubjects[subject] ? (
                            <ChevronDown size={16} className="text-[#787774]" />
                          ) : (
                            <ChevronUp size={16} className="text-[#787774]" />
                          )}
                        </button>

                        {!collapsedSubjects[subject] && (
                          <div className="p-2 space-y-2 bg-white">
                            {tasksBySubject[subject].map((task) => (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={(e) =>
                                  handleDragStartPending(e, task)
                                }
                                className="p-3 rounded-lg border border-[#E3E2E0] hover:border-[#2383E2] hover:shadow-sm transition-all cursor-move bg-white"
                              >
                                <div className="flex items-start gap-2">
                                  <GripVertical
                                    size={16}
                                    className="text-[#787774] mt-1 flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-[#37352F] text-sm">
                                      {task.title}
                                    </h4>
                                    {task.description && (
                                      <p className="text-xs text-[#787774] mt-1 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        task.status === "todo"
                                          ? "bg-[#787774]"
                                          : task.status === "in_progress"
                                            ? "bg-[#2383E2]"
                                            : "bg-[#10B981]"
                                      }`}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDurationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#37352F] mb-4">
              Set Duration
            </h2>
            <p className="text-sm text-[#787774] mb-4">
              How long will{" "}
              <span className="font-semibold">{draggedTask?.title}</span> take?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#37352F] mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={durationInput}
                onChange={(e) =>
                  setDurationInput(parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-3 border border-[#E3E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2] text-lg"
                min="15"
                step="15"
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                {[30, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationInput(mins)}
                    className="px-3 py-1 text-xs border border-[#E3E2E0] rounded hover:bg-[#F7F6F3] transition-colors"
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDurationModal(false);
                  setDraggedTask(null);
                  setDropTime(null);
                }}
                className="flex-1 px-4 py-3 border border-[#E3E2E0] text-[#37352F] rounded-lg hover:bg-[#F7F6F3] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={scheduleTaskAtTime}
                className="flex-1 px-4 py-3 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors font-medium"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimerModal && activeTask && (
        <TimerModal
          task={activeTask}
          onComplete={handleTimerComplete}
          onCancel={() => {
            setShowTimerModal(false);
            setActiveTask(null);
          }}
        />
      )}
    </>
  );
}

import { useState } from "react";

export function useSubjectManagement(onSuccess) {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectSession, setNewSubjectSession] = useState({
    time_done: "",
    purpose: "",
  });
  const [error, setError] = useState(null);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      const response = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_date: new Date().toISOString().split("T")[0],
          time_done: parseInt(newSubjectSession.time_done),
          purpose: newSubjectSession.purpose,
          subject: newSubjectName.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to add subject");

      setNewSubjectName("");
      setNewSubjectSession({
        time_done: "",
        purpose: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to add subject");
    }
  };

  const handleDeleteSubject = async (subject) => {
    if (
      !confirm(
        `Are you sure you want to delete all data for ${subject}? This will remove all tasks, sessions, and deadlines for this subject.`,
      )
    )
      return;

    try {
      const response = await fetch("/api/subjects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) throw new Error("Failed to delete subject");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to delete subject");
    }
  };

  const resetSubjectForm = () => {
    setNewSubjectName("");
    setNewSubjectSession({
      time_done: "",
      purpose: "",
    });
  };

  return {
    newSubjectName,
    setNewSubjectName,
    newSubjectSession,
    setNewSubjectSession,
    error,
    handleAddSubject,
    handleDeleteSubject,
    resetSubjectForm,
  };
}

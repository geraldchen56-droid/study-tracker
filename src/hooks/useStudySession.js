import { useState } from "react";

export function useStudySession(onSuccess) {
  const [editingSession, setEditingSession] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    study_date: new Date().toISOString().split("T")[0],
    time_done: "",
    purpose: "",
    subject: "",
  });

  const resetForm = () => {
    setFormData({
      study_date: new Date().toISOString().split("T")[0],
      time_done: "",
      purpose: "",
      subject: "",
    });
    setEditingSession(null);
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      study_date: session.study_date.split("T")[0],
      time_done: session.time_done.toString(),
      purpose: session.purpose,
      subject: session.subject,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingSession
        ? `/api/study-sessions/${editingSession.id}`
        : "/api/study-sessions";

      const method = editingSession ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          time_done: parseInt(formData.time_done),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save study session");
      }

      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to save study session");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this study session?")) return;

    try {
      const response = await fetch(`/api/study-sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete study session");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to delete study session");
    }
  };

  return {
    formData,
    setFormData,
    editingSession,
    error,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm,
  };
}

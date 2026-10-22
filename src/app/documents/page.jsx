"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Plus,
  FileText,
  Link as LinkIcon,
  Upload,
  Trash2,
  Edit2,
  ExternalLink,
  Menu,
  Home,
  LayoutGrid,
  CalendarDays,
  Sparkles,
  Settings,
} from "lucide-react";
import useUpload from "@/utils/useUpload";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [error, setError] = useState(null);
  const [showNavigator, setShowNavigator] = useState(false);
  const [upload, { loading: uploading }] = useUpload();

  const [formData, setFormData] = useState({
    title: "",
    document_type: "link",
    url: "",
    subject: "",
    linked_task_id: null,
  });

  useEffect(() => {
    fetchDocuments();
    fetchTasks();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data.documents);
    } catch (err) {
      console.error(err);
      setError("Failed to load documents");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target.result;
          const { url, error } = await upload({ base64 });

          if (error) {
            setError("Failed to upload file");
            return;
          }

          setFormData((prev) => ({
            ...prev,
            url,
            title: prev.title || file.name,
            document_type: "pdf",
          }));
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        setError("Failed to upload file");
      }
    },
    [upload],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingDocument
        ? `/api/documents/${editingDocument.id}`
        : "/api/documents";
      const method = editingDocument ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save document");

      setShowAddModal(false);
      setEditingDocument(null);
      setFormData({
        title: "",
        document_type: "link",
        url: "",
        subject: "",
        linked_task_id: null,
      });
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError("Failed to save document");
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      document_type: document.document_type,
      url: document.url,
      subject: document.subject || "",
      linked_task_id: document.linked_task_id,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete document");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError("Failed to delete document");
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    const key = doc.subject || "Uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#E3E2E0] dark:border-[#2C2C2C] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="p-2 rounded-lg hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
              >
                <ArrowLeft
                  size={20}
                  className="text-[#37352F] dark:text-[#DEDEDE]"
                />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-[#37352F] dark:text-[#DEDEDE]">
                  Documents
                </h1>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Organize your study materials
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingDocument(null);
                  setFormData({
                    title: "",
                    document_type: "link",
                    url: "",
                    subject: "",
                    linked_task_id: null,
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
              >
                <Plus size={20} />
                Add Document
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNavigator(!showNavigator)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#37352F] dark:bg-[#2C2C2C] text-white rounded-lg hover:bg-[#2C2A26] dark:hover:bg-[#3C3C3C] transition-colors"
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
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1E1E] rounded-lg shadow-xl border border-[#E3E2E0] dark:border-[#2C2C2C] z-30">
                      <div className="py-2">
                        <a
                          href="/"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors text-[#37352F] dark:text-[#DEDEDE]"
                        >
                          <Home size={18} />
                          <span className="font-medium">Dashboard</span>
                        </a>
                        <a
                          href="/planner"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors text-[#37352F] dark:text-[#DEDEDE]"
                        >
                          <CalendarDays size={18} />
                          <span className="font-medium">Daily Planner</span>
                        </a>
                        <a
                          href="/kanban"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors text-[#37352F] dark:text-[#DEDEDE]"
                        >
                          <LayoutGrid size={18} />
                          <span className="font-medium">Task Board</span>
                        </a>
                        <a
                          href="/documents"
                          className="flex items-center gap-3 px-4 py-3 bg-[#F0F7FF] dark:bg-[#1a2942] text-[#2383E2] dark:text-[#6B9FDB] font-semibold"
                        >
                          <FileText size={18} />
                          <span>Documents</span>
                        </a>
                        <div className="border-t border-[#E3E2E0] dark:border-[#2C2C2C] my-2"></div>
                        <a
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors text-[#37352F] dark:text-[#DEDEDE]"
                        >
                          <Settings size={18} />
                          <span className="font-medium">Settings</span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {Object.keys(groupedDocuments).length === 0 ? (
          <div className="text-center py-24">
            <FileText
              size={64}
              className="mx-auto mb-4 text-[#C4C4C4] dark:text-[#4C4C4C]"
            />
            <h2 className="text-xl font-semibold text-[#37352F] dark:text-[#DEDEDE] mb-2">
              No documents yet
            </h2>
            <p className="text-[#787774] dark:text-[#A3A3A3] mb-6">
              Add links to Google Docs, upload PDFs, or save other study
              materials
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
            >
              <Plus size={20} />
              Add Your First Document
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDocuments).map(([subject, docs]) => (
              <div key={subject}>
                <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#2383E2] rounded-full"></div>
                  {subject}
                  <span className="text-sm font-normal text-[#787774] dark:text-[#A3A3A3]">
                    ({docs.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              doc.document_type === "pdf"
                                ? "bg-red-50 dark:bg-red-900/20"
                                : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                          >
                            {doc.document_type === "pdf" ? (
                              <FileText
                                size={20}
                                className="text-red-600 dark:text-red-400"
                              />
                            ) : (
                              <LinkIcon
                                size={20}
                                className="text-blue-600 dark:text-blue-400"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#37352F] dark:text-[#DEDEDE] truncate">
                              {doc.title}
                            </h3>
                            <p className="text-xs text-[#787774] dark:text-[#A3A3A3] capitalize">
                              {doc.document_type}
                            </p>
                          </div>
                        </div>
                      </div>

                      {doc.task_title && (
                        <div className="mb-3 px-2 py-1 bg-[#F0F7FF] dark:bg-[#1a2942] rounded text-xs text-[#2383E2] dark:text-[#6B9FDB]">
                          Linked to: {doc.task_title}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors text-sm"
                        >
                          <ExternalLink size={14} />
                          Open
                        </a>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors"
                        >
                          <Edit2
                            size={16}
                            className="text-[#787774] dark:text-[#A3A3A3]"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                        >
                          <Trash2
                            size={16}
                            className="text-[#EF4444] dark:text-red-400"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#37352F] dark:text-[#DEDEDE] mb-4">
              {editingDocument ? "Edit Document" : "Add Document"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Document Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, document_type: "link" })
                    }
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.document_type === "link"
                        ? "border-[#2383E2] bg-[#F0F7FF] dark:bg-[#1a2942]"
                        : "border-[#E3E2E0] dark:border-[#2C2C2C]"
                    }`}
                  >
                    <LinkIcon size={18} />
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, document_type: "pdf" })
                    }
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.document_type === "pdf"
                        ? "border-[#2383E2] bg-[#F0F7FF] dark:bg-[#1a2942]"
                        : "border-[#E3E2E0] dark:border-[#2C2C2C]"
                    }`}
                  >
                    <FileText size={18} />
                    PDF
                  </button>
                </div>
              </div>

              {formData.document_type === "pdf" && !formData.url && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                    Upload PDF
                  </label>
                  <div className="border-2 border-dashed border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg p-6 text-center">
                    <Upload
                      size={32}
                      className="mx-auto mb-2 text-[#787774] dark:text-[#A3A3A3]"
                    />
                    <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mb-3">
                      {uploading ? "Uploading..." : "Click to upload PDF"}
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="inline-block px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              )}

              {(formData.document_type === "link" || formData.url) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                    {formData.document_type === "link" ? "URL" : "PDF URL"}
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                    placeholder="https://docs.google.com/document/..."
                    required
                  />
                </div>
              )}

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
                  className="w-full px-4 py-3 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="Chapter 5 Notes"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                  placeholder="Mathematics"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Link to Task (Optional)
                </label>
                <select
                  value={formData.linked_task_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      linked_task_id: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E3E2E0] dark:border-[#2C2C2C] dark:bg-[#262626] dark:text-[#DEDEDE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
                >
                  <option value="">No task</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title} - {task.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDocument(null);
                  }}
                  className="flex-1 px-4 py-3 border border-[#E3E2E0] dark:border-[#2C2C2C] text-[#37352F] dark:text-[#DEDEDE] rounded-lg hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors font-medium"
                  disabled={uploading}
                >
                  {editingDocument ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

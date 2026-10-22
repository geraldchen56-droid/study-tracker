"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import DeadlinesSidebar from "@/components/DeadlinesSidebar";
import NavigationSidebar from "@/components/NavigationSidebar";
import { PeriodSelector } from "@/components/StudyPlanner/PeriodSelector";
import { StatsOverview } from "@/components/StudyPlanner/StatsOverview";
import { FlashcardsSection } from "@/components/StudyPlanner/FlashcardsSection";
import { StudyCharts } from "@/components/StudyPlanner/StudyCharts";
import { SubjectsManagement } from "@/components/StudyPlanner/SubjectsManagement";
import { StudySessionsTable } from "@/components/StudyPlanner/StudySessionsTable";
import { AddSessionModal } from "@/components/StudyPlanner/AddSessionModal";
import { AddSubjectModal } from "@/components/StudyPlanner/AddSubjectModal";
import { GiveUpModal } from "@/components/StudyPlanner/GiveUpModal";
import { useStudyData } from "@/hooks/useStudyData";
import { useFlashcardSets } from "@/hooks/useFlashcardSets";
import { useStudySession } from "@/hooks/useStudySession";
import { useSubjectManagement } from "@/hooks/useSubjectManagement";
import {
  prepareChartData,
  prepareSubjectChartData,
  calculateTotalTime,
} from "@/utils/chartHelpers";

export default function StudyPlanner() {
  const [period, setPeriod] = useState("week");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

  const { sessions, timeByDate, timeBySubject, refetch } = useStudyData(period);
  const { flashcardSets } = useFlashcardSets();

  const {
    formData,
    setFormData,
    editingSession,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm,
  } = useStudySession(() => {
    setShowAddModal(false);
    refetch();
  });

  const {
    newSubjectName,
    setNewSubjectName,
    newSubjectSession,
    setNewSubjectSession,
    handleAddSubject,
    handleDeleteSubject,
    resetSubjectForm,
  } = useSubjectManagement(() => {
    setShowAddSubjectModal(false);
    refetch();
  });

  const handleGiveUp = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all your study data? This action cannot be undone.",
      )
    )
      return;

    try {
      for (const item of timeBySubject) {
        await fetch("/api/subjects", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: item.subject }),
        });
      }

      setShowGiveUpModal(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const { totalTime, totalHours, totalMinutes } = calculateTotalTime(sessions);
  const chartData = prepareChartData(timeByDate);
  const subjectChartData = prepareSubjectChartData(timeBySubject, totalTime);

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      <NavigationSidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-semibold text-[#37352F] dark:text-[#DEDEDE] mb-2">
                  Study Planner
                </h1>
                <p className="text-[#787774] dark:text-[#A3A3A3]">
                  Track your study sessions and analyze your progress
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGiveUpModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] dark:bg-red-900/20 text-[#DC2626] dark:text-red-400 border border-[#FCA5A5] dark:border-red-900/50 rounded-lg hover:bg-[#FEE2E2] dark:hover:bg-red-900/30 transition-colors"
                >
                  <AlertTriangle size={18} />
                  Give Up
                </button>
              </div>
            </div>
          </div>

          <PeriodSelector period={period} setPeriod={setPeriod} />

          <StatsOverview
            totalHours={totalHours}
            totalMinutes={totalMinutes}
            sessionsCount={sessions.length}
            subjectsCount={timeBySubject.length}
          />

          <FlashcardsSection flashcardSets={flashcardSets} />

          <StudyCharts
            chartData={chartData}
            subjectChartData={subjectChartData}
          />

          <SubjectsManagement
            timeBySubject={timeBySubject}
            onAddSubject={() => setShowAddSubjectModal(true)}
            onDeleteSubject={handleDeleteSubject}
          />

          <StudySessionsTable
            sessions={sessions}
            onAddSession={() => {
              resetForm();
              setShowAddModal(true);
            }}
            onEdit={(session) => {
              handleEdit(session);
              setShowAddModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <DeadlinesSidebar />

      <GiveUpModal
        show={showGiveUpModal}
        onConfirm={handleGiveUp}
        onClose={() => setShowGiveUpModal(false)}
      />

      <AddSubjectModal
        show={showAddSubjectModal}
        newSubjectName={newSubjectName}
        setNewSubjectName={setNewSubjectName}
        newSubjectSession={newSubjectSession}
        setNewSubjectSession={setNewSubjectSession}
        onSubmit={handleAddSubject}
        onClose={() => {
          setShowAddSubjectModal(false);
          resetSubjectForm();
        }}
      />

      <AddSessionModal
        show={showAddModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        editingSession={editingSession}
      />
    </div>
  );
}

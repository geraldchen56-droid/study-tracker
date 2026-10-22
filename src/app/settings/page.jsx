"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Palette,
  Layout,
  Save,
} from "lucide-react";
import useSettingsStore from "@/app/../store/settingsStore";

export default function SettingsPage() {
  const { theme, setTheme, pageSettings, setPageSettings, getPageSettings } =
    useSettingsStore();
  const [hasChanges, setHasChanges] = useState(false);

  // Page-specific settings
  const [homeSettings, setHomeSettings] = useState({
    accentColor: "#2383E2",
    showStats: true,
    showCharts: true,
    compactMode: false,
  });

  const [kanbanSettings, setKanbanSettings] = useState({
    columnColor: "#3B82F6",
    compactCards: false,
    showPriority: true,
  });

  const [plannerSettings, setPlannerSettings] = useState({
    defaultView: "week",
    showWeekends: true,
    startHour: 8,
    endHour: 22,
  });

  const [documentsSettings, setDocumentsSettings] = useState({
    viewMode: "grid",
    sortBy: "date",
    showPreviews: true,
  });

  useEffect(() => {
    // Load page settings from store
    const home = getPageSettings("home");
    const kanban = getPageSettings("kanban");
    const planner = getPageSettings("planner");
    const documents = getPageSettings("documents");

    if (Object.keys(home).length > 0)
      setHomeSettings({ ...homeSettings, ...home });
    if (Object.keys(kanban).length > 0)
      setKanbanSettings({ ...kanbanSettings, ...kanban });
    if (Object.keys(planner).length > 0)
      setPlannerSettings({ ...plannerSettings, ...planner });
    if (Object.keys(documents).length > 0)
      setDocumentsSettings({ ...documentsSettings, ...documents });
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSavePageSettings = async () => {
    await setPageSettings("home", homeSettings);
    await setPageSettings("kanban", kanbanSettings);
    await setPageSettings("planner", plannerSettings);
    await setPageSettings("documents", documentsSettings);
    setHasChanges(false);
  };

  const markChanges = () => setHasChanges(true);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#E3E2E0] dark:border-[#2C2C2C] sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
                  Settings
                </h1>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Customize your study planner experience
                </p>
              </div>
            </div>
            {hasChanges && (
              <button
                onClick={handleSavePageSettings}
                className="flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-lg hover:bg-[#1a6ec7] transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E3E2E0] dark:border-[#2C2C2C] overflow-hidden">
          <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
            <div className="flex items-center gap-3">
              <Palette size={24} className="text-[#2383E2]" />
              <div>
                <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                  Appearance
                </h2>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mt-1">
                  Choose how Study Planner looks across THE ENTIRE WEBSITE
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div
                onClick={() => handleThemeChange("light")}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  theme === "light"
                    ? "border-[#2383E2] bg-[#F0F7FF] dark:bg-[#1a2942]"
                    : "border-[#E3E2E0] dark:border-[#2C2C2C] hover:border-[#2383E2] dark:hover:border-[#2383E2]"
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-[#E3E2E0] flex items-center justify-center">
                  <Sun size={24} className="text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                    Light
                  </h3>
                  <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                    Bright and clean interface
                  </p>
                </div>
                {theme === "light" && (
                  <div className="w-5 h-5 rounded-full bg-[#2383E2] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>

              <div
                onClick={() => handleThemeChange("dark")}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  theme === "dark"
                    ? "border-[#2383E2] bg-[#F0F7FF] dark:bg-[#1a2942]"
                    : "border-[#E3E2E0] dark:border-[#2C2C2C] hover:border-[#2383E2] dark:hover:border-[#2383E2]"
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-[#1E1E1E] border border-[#2C2C2C] flex items-center justify-center">
                  <Moon size={24} className="text-[#8B5CF6]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                    Dark
                  </h3>
                  <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                    Easy on the eyes in low light
                  </p>
                </div>
                {theme === "dark" && (
                  <div className="w-5 h-5 rounded-full bg-[#2383E2] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>

              <div
                onClick={() => handleThemeChange("system")}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  theme === "system"
                    ? "border-[#2383E2] bg-[#F0F7FF] dark:bg-[#1a2942]"
                    : "border-[#E3E2E0] dark:border-[#2C2C2C] hover:border-[#2383E2] dark:hover:border-[#2383E2]"
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-[#1E1E1E] border border-[#E3E2E0] dark:border-[#2C2C2C] flex items-center justify-center">
                  <Monitor
                    size={24}
                    className="text-[#37352F] dark:text-[#DEDEDE]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                    System
                  </h3>
                  <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                    Follows your device settings
                  </p>
                </div>
                {theme === "system" && (
                  <div className="w-5 h-5 rounded-full bg-[#2383E2] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Home Page Settings */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E3E2E0] dark:border-[#2C2C2C] overflow-hidden">
          <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
            <div className="flex items-center gap-3">
              <Layout size={24} className="text-[#10B981]" />
              <div>
                <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
                  Home Page
                </h2>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mt-1">
                  Customize your dashboard layout and appearance
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#37352F] dark:text-[#DEDEDE]">
                  Show Statistics
                </h4>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Display stats overview cards
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeSettings.showStats}
                  onChange={(e) => {
                    setHomeSettings({
                      ...homeSettings,
                      showStats: e.target.checked,
                    });
                    markChanges();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2383E2]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#37352F] dark:text-[#DEDEDE]">
                  Show Charts
                </h4>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Display analytics charts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeSettings.showCharts}
                  onChange={(e) => {
                    setHomeSettings({
                      ...homeSettings,
                      showCharts: e.target.checked,
                    });
                    markChanges();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2383E2]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#37352F] dark:text-[#DEDEDE]">
                  Compact Mode
                </h4>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Reduce spacing and padding
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeSettings.compactMode}
                  onChange={(e) => {
                    setHomeSettings({
                      ...homeSettings,
                      compactMode: e.target.checked,
                    });
                    markChanges();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2383E2]"></div>
              </label>
            </div>

            <div>
              <label className="block font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                Accent Color
              </label>
              <input
                type="color"
                value={homeSettings.accentColor}
                onChange={(e) => {
                  setHomeSettings({
                    ...homeSettings,
                    accentColor: e.target.value,
                  });
                  markChanges();
                }}
                className="w-full h-12 rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Kanban Page Settings */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E3E2E0] dark:border-[#2C2C2C] overflow-hidden">
          <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
            <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
              Kanban Board
            </h2>
            <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mt-1">
              Customize your task board appearance
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#37352F] dark:text-[#DEDEDE]">
                  Compact Cards
                </h4>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Show smaller task cards
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={kanbanSettings.compactCards}
                  onChange={(e) => {
                    setKanbanSettings({
                      ...kanbanSettings,
                      compactCards: e.target.checked,
                    });
                    markChanges();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2383E2]"></div>
              </label>
            </div>

            <div>
              <label className="block font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                Column Color
              </label>
              <input
                type="color"
                value={kanbanSettings.columnColor}
                onChange={(e) => {
                  setKanbanSettings({
                    ...kanbanSettings,
                    columnColor: e.target.value,
                  });
                  markChanges();
                }}
                className="w-full h-12 rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Planner Page Settings */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E3E2E0] dark:border-[#2C2C2C] overflow-hidden">
          <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
            <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
              Study Planner
            </h2>
            <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mt-1">
              Configure your schedule view preferences
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#37352F] dark:text-[#DEDEDE]">
                  Show Weekends
                </h4>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Display Saturday and Sunday
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={plannerSettings.showWeekends}
                  onChange={(e) => {
                    setPlannerSettings({
                      ...plannerSettings,
                      showWeekends: e.target.checked,
                    });
                    markChanges();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2383E2]"></div>
              </label>
            </div>

            <div>
              <label className="block font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                Start Hour
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={plannerSettings.startHour}
                onChange={(e) => {
                  setPlannerSettings({
                    ...plannerSettings,
                    startHour: parseInt(e.target.value),
                  });
                  markChanges();
                }}
                className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                End Hour
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={plannerSettings.endHour}
                onChange={(e) => {
                  setPlannerSettings({
                    ...plannerSettings,
                    endHour: parseInt(e.target.value),
                  });
                  markChanges();
                }}
                className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              />
            </div>
          </div>
        </div>

        {/* Documents Page Settings */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E3E2E0] dark:border-[#2C2C2C] overflow-hidden">
          <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C]">
            <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE]">
              Documents
            </h2>
            <p className="text-sm text-[#787774] dark:text-[#A3A3A3] mt-1">
              Control how documents are displayed
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                View Mode
              </label>
              <select
                value={documentsSettings.viewMode}
                onChange={(e) => {
                  setDocumentsSettings({
                    ...documentsSettings,
                    viewMode: e.target.value,
                  });
                  markChanges();
                }}
                className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#37352F] dark:text-[#DEDEDE] mb-2">
                Sort By
              </label>
              <select
                value={documentsSettings.sortBy}
                onChange={(e) => {
                  setDocumentsSettings({
                    ...documentsSettings,
                    sortBy: e.target.value,
                  });
                  markChanges();
                }}
                className="w-full px-4 py-2 border border-[#E3E2E0] dark:border-[#2C2C2C] rounded-lg bg-white dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#2383E2]"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#37352F] dark:text-[#DEDEDE]">
                  Show Previews
                </h4>
                <p className="text-sm text-[#787774] dark:text-[#A3A3A3]">
                  Display document thumbnails
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={documentsSettings.showPreviews}
                  onChange={(e) => {
                    setDocumentsSettings({
                      ...documentsSettings,
                      showPreviews: e.target.checked,
                    });
                    markChanges();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2383E2]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { create } from "zustand";

// Generate or retrieve settings key
const getSettingsKey = () => {
  if (typeof window === "undefined") return null;

  let key = localStorage.getItem("settingsKey");
  if (!key) {
    key = `settings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("settingsKey", key);
  }
  return key;
};

const useSettingsStore = create((set, get) => ({
  settingsKey: null,
  theme: "system",
  pageSettings: {},
  isLoaded: false,
  isLoading: false,

  // Initialize settings from backend
  initialize: async () => {
    if (typeof window === "undefined") return;

    const key = getSettingsKey();
    set({ settingsKey: key, isLoading: true });

    try {
      // Try to fetch existing settings
      const response = await fetch(`/api/settings?key=${key}`);

      if (response.ok) {
        const data = await response.json();
        set({
          theme: data.theme || "system",
          pageSettings: data.page_settings || {},
          isLoaded: true,
          isLoading: false,
        });
        get().applyTheme(data.theme || "system");
      } else {
        // Create new settings if not found
        const createResponse = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settingsKey: key,
            theme: "system",
            pageSettings: {},
          }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          set({
            theme: data.theme || "system",
            pageSettings: data.page_settings || {},
            isLoaded: true,
            isLoading: false,
          });
          get().applyTheme(data.theme || "system");
        }
      }
    } catch (error) {
      console.error("Failed to initialize settings:", error);
      set({ isLoaded: true, isLoading: false });
    }
  },

  // Apply theme to document
  applyTheme: (newTheme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  },

  // Update theme
  setTheme: async (newTheme) => {
    const { settingsKey } = get();
    if (!settingsKey) return;

    set({ theme: newTheme });
    get().applyTheme(newTheme);

    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settingsKey,
          theme: newTheme,
        }),
      });
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  },

  // Update page settings
  setPageSettings: async (pageName, settings) => {
    const { settingsKey, pageSettings } = get();
    if (!settingsKey) return;

    const updatedPageSettings = {
      ...pageSettings,
      [pageName]: {
        ...pageSettings[pageName],
        ...settings,
      },
    };

    set({ pageSettings: updatedPageSettings });

    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settingsKey,
          pageSettings: updatedPageSettings,
        }),
      });
    } catch (error) {
      console.error("Failed to save page settings:", error);
    }
  },

  // Get settings for a specific page
  getPageSettings: (pageName) => {
    const { pageSettings } = get();
    return pageSettings[pageName] || {};
  },
}));

export default useSettingsStore;

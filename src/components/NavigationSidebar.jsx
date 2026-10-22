"use client";

import { useState, useEffect } from "react";
import {
  Home,
  CalendarDays,
  LayoutGrid,
  FileText,
  Sparkles,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function NavigationSidebar() {
  const [pathname, setPathname] = useState("/");
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    // Get current pathname
    setPathname(window.location.pathname);

    // Load pinned state from localStorage
    const savedPinned = localStorage.getItem("sidebarPinned");
    if (savedPinned === "true") {
      setIsPinned(true);
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Auto-show when mouse is within 50px of left edge
      if (e.clientX < 50 && !isPinned) {
        setIsHovered(true);
        setIsOpen(true);
      } else if (e.clientX > 280 && !isPinned) {
        // Delay hiding to prevent flickering
        setTimeout(() => {
          setIsHovered(false);
        }, 100);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPinned]);

  useEffect(() => {
    // Close sidebar when not hovered and not pinned
    if (!isHovered && !isPinned) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHovered, isPinned]);

  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem("sidebarPinned", newPinned.toString());
    if (newPinned) {
      setIsOpen(true);
    }
  };

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/planner", icon: CalendarDays, label: "Daily Planner" },
    { href: "/kanban", icon: LayoutGrid, label: "Task Board" },
    { href: "/flashcards", icon: Brain, label: "Flashcards" },
    { href: "/documents", icon: FileText, label: "Documents" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && !isPinned && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            setIsOpen(false);
            setIsHovered(false);
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-[#1E1E1E] border-r border-[#E3E2E0] dark:border-[#2C2C2C] shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px" }}
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E3E2E0] dark:border-[#2C2C2C] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#37352F] dark:text-[#DEDEDE]">
              Study Planner
            </h2>
            <p className="text-xs text-[#787774] dark:text-[#A3A3A3] mt-1">
              Navigate your workspace
            </p>
          </div>
          <button
            onClick={togglePin}
            className={`p-2 rounded-lg transition-colors ${
              isPinned
                ? "bg-[#2383E2] text-white"
                : "hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C] text-[#787774] dark:text-[#A3A3A3]"
            }`}
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {isPinned ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-[#F0F7FF] dark:bg-[#1a2942] text-[#2383E2] dark:text-[#6B9FDB] font-semibold shadow-sm"
                    : "text-[#37352F] dark:text-[#DEDEDE] hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C]"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Footer Help Text */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E3E2E0] dark:border-[#2C2C2C] bg-[#F7F6F3] dark:bg-[#262626]">
          <div className="text-xs text-[#787774] dark:text-[#A3A3A3] text-center">
            {isPinned ? (
              <p>
                <span className="font-semibold">Pinned</span> - Click{" "}
                <ChevronLeft className="inline" size={14} /> to unpin
              </p>
            ) : (
              <p>
                Hover near <span className="font-semibold">left edge</span> to
                show
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsHovered(true);
          }}
          className="fixed top-6 left-4 z-40 p-3 bg-[#37352F] dark:bg-[#2C2C2C] text-white rounded-lg shadow-lg hover:bg-[#2C2A26] dark:hover:bg-[#3C3C3C] transition-all hover:scale-110"
          title="Open navigation"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
}

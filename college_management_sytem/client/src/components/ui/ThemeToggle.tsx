import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2 text-sm font-medium ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="sr-only sm:not-sr-only text-xs">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="sr-only sm:not-sr-only text-xs">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;

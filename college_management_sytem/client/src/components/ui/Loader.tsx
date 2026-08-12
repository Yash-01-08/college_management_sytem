import React from "react";
import { Loader2 } from "lucide-react";

export const Loader: React.FC<{ size?: "sm" | "md" | "lg"; className?: string; message?: string; label?: string }> = ({
  size = "md",
  className = "",
  message,
  label,
}) => {
  const displayText = message || label;
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (displayText) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-3">
        <Loader2 className={`animate-spin text-indigo-600 dark:text-indigo-400 ${sizeClasses[size]} ${className}`} />
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{displayText}</p>
      </div>
    );
  }

  return (
    <Loader2 className={`animate-spin text-indigo-600 dark:text-indigo-400 ${sizeClasses[size]} ${className}`} />
  );
};

export const PageLoader: React.FC<{ message?: string; label?: string }> = ({ message, label }) => {
  const displayText = message || label || "Loading system...";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-4 border-indigo-500/20 animate-ping" />
          <Loader size="lg" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">College Management System</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{displayText}</p>
        </div>
      </div>
    </div>
  );
};

export const ButtonLoader: React.FC<{ text?: string }> = ({ text = "Processing..." }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </span>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />
  );
};

export default Loader;

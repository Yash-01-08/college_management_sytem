import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  message?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data available",
  description,
  message,
  action,
  icon: Icon = Inbox,
  className = "",
}) => {
  const text = description || message || "There are no items to display at this time.";

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 ${className}`}>
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mb-6">{text}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;

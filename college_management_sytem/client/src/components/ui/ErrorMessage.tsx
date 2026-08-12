import React from "react";
import { AlertCircle } from "lucide-react";

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div className={`p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 flex items-start justify-between gap-3 text-sm ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 underline hover:no-underline shrink-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

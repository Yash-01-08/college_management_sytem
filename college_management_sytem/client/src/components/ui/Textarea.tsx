import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-500"
          } ${className}`}
          rows={3}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

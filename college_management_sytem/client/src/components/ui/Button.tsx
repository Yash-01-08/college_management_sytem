import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loading = false,
  leftIcon,
  rightIcon,
  icon: IconProp,
  className = "",
  disabled,
  ...props
}) => {
  const activeLoading = isLoading || loading;
  const renderLeftIcon = leftIcon || (IconProp ? <IconProp className="w-4 h-4" /> : null);

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-500/20 focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500",
    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:focus:ring-slate-600",
    outline:
      "border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-indigo-500 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300",
    danger:
      "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-500/20 focus:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-700",
    success:
      "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-500/20 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700",
    ghost:
      "hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300 focus:ring-slate-400",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || activeLoading}
      {...props}
    >
      {activeLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {renderLeftIcon && <span className="inline-flex shrink-0">{renderLeftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

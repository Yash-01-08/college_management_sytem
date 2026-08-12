import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface SidebarProps {
  roleTitle: string;
  navItems: SidebarNavItem[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  roleTitle,
  navItems,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const location = useLocation();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800/80 transition-colors duration-200">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-800">
          <Link to="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight block leading-none">
                Campus<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
              </span>
              <span className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold capitalize mt-1 block">
                {roleTitle}
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer copyright note */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-400 dark:text-slate-500 text-center">
        CampusPulse &copy; {new Date().getFullYear()}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;

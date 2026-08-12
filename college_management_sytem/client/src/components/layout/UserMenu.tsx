import React, { useState } from "react";
import { User } from "../../types";
import { ShieldCheck, ChevronDown, UserCircle } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";

interface UserMenuProps {
  user: User | null;
  profilePath?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, profilePath = "/student/profile" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-[11px]">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <span className="hidden sm:inline font-semibold text-gray-800 dark:text-slate-200 max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 p-3 animate-fadeIn">
            <div className="pb-3 border-b border-gray-100 dark:border-slate-800 mb-2 px-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                <span>{user.role}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                to={profilePath}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <UserCircle className="w-4 h-4 text-gray-400" />
                <span>View Profile</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 mt-2">
              <LogoutButton className="w-full justify-center" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;

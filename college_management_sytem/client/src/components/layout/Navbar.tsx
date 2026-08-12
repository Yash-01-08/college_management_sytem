import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import { Notification } from "../../types";

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  notifications?: Notification[];
  profilePath?: string;
  notificationsPath?: string;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  notifications = [],
  profilePath,
  notificationsPath,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Hamburger & Portal Title */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="lg:hidden font-bold text-sm text-gray-900 dark:text-white">
            Campus<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
          </div>
        </div>

        {/* Action Controls: NotificationBell, ThemeToggle, UserMenu */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          <NotificationBell
            notifications={notifications}
            viewAllPath={notificationsPath}
            onMarkRead={onMarkNotificationRead}
            onMarkAllRead={onMarkAllNotificationsRead}
          />

          <ThemeToggle />

          <UserMenu user={user} profilePath={profilePath} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

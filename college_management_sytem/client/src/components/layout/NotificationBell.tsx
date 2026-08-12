import React, { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Notification } from "../../types";

interface NotificationBellProps {
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  viewAllPath?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  viewAllPath = "/notifications",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const list = Array.isArray(notifications)
    ? notifications
    : (notifications as any)?.notifications && Array.isArray((notifications as any).notifications)
    ? (notifications as any).notifications
    : [];

  const unreadCount = list.filter((n: any) => n && !n.read && !n.isRead).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-40 overflow-hidden animate-fadeIn">
            <div className="p-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {onMarkAllRead && unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
              {list.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 dark:text-gray-500">
                  No notifications
                </div>
              ) : (
                list.slice(0, 5).map((n: any) => {
                  const isUnread = !n.read && !n.isRead;
                  return (
                    <div
                      key={n.id || n._id}
                      className={`p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex items-start justify-between gap-2 ${
                        isUnread ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${isUnread ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                          {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                      </div>
                      {isUnread && onMarkRead && (
                        <button
                          onClick={() => onMarkRead(n.id || n._id || "")}
                          className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-2.5 bg-gray-50 dark:bg-slate-950/60 border-t border-gray-100 dark:border-gray-800 text-center">
              <a
                href={viewAllPath}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all notifications
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;

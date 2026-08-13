import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Filter, X, Volume2, Info, Calendar, DollarSign, Award } from "lucide-react";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "attendance" | "result" | "fee" | "event" | "announcement" | "system" | "assignment_due" | "assignment_graded" | "event_created" | "fee_due";
  isRead: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications: initialNotifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "result":
      case "assignment_graded":
        return <Award className="w-5 h-5 text-purple-500" />;
      case "fee":
      case "fee_due":
        return <DollarSign className="w-5 h-5 text-amber-500" />;
      case "event":
      case "event_created":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "announcement":
        return <Volume2 className="w-5 h-5 text-indigo-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleMarkOne = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    if (onMarkAsRead) onMarkAsRead(id);
  };

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (onMarkAllAsRead) onMarkAllAsRead();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
              Notification Center
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {["all", "unread", "announcement", "attendance", "result", "fee", "event"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-full capitalize transition whitespace-nowrap ${
                filter === tab
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center text-xs">
            <span className="text-indigo-700 dark:text-indigo-300">
              You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </span>
            <button
              onClick={handleMarkAll}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Mark all as read
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications found</p>
              <p className="text-xs mt-1 text-slate-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleMarkOne(notification._id)}
                className={`p-4 flex items-start space-x-3 cursor-pointer transition ${
                  notification.isRead
                    ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850"
                    : "bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40"
                }`}
              >
                <div className="mt-0.5 shrink-0">{getTypeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm ${
                        notification.isRead
                          ? "font-medium text-slate-800 dark:text-slate-200"
                          : "font-bold text-slate-900 dark:text-white"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

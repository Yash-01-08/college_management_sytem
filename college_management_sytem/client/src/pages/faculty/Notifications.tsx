import React, { useEffect, useState } from "react";
import { getFacultyNotifications } from "../../services/facultyService";
import { Notification } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Bell, Check, CheckCheck } from "lucide-react";

export const FacultyNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFacultyNotifications()
      .then((res) => setNotifications(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
  };

  if (loading) return <Loader label="Loading notifications..." />;
  if (error) return <ErrorMessage message={error} />;

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Faculty Notifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Official announcements, academic deadlines, and coordinator alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <Button size="sm" variant="outline" icon={CheckCheck} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No Notifications" description="You have no unread notifications." icon={Bell} />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = !n.read && !n.isRead;
            const nid = n.id || n._id || "";
            return (
              <Card
                key={nid}
                className={`transition-all ${
                  isUnread ? "border-l-4 border-l-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary">{n.type}</Badge>
                      {isUnread && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                          Unread
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{n.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-slate-400">{n.message}</p>
                  </div>

                  {isUnread && (
                    <Button size="sm" variant="ghost" icon={Check} onClick={() => handleMarkRead(nid)}>
                      Read
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FacultyNotifications;

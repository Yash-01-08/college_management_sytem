import React, { useEffect, useState } from "react";
import { Notification } from "../../types";
import { getCoordinatorNotifications } from "../../services/coordinatorService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { Bell } from "lucide-react";

export const CoordinatorNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCoordinatorNotifications();
      if (res.data) setNotifications(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.message?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading department broadcasts..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchNotifications} />;

  const columns = [
    {
      header: "Title & Details",
      accessor: (n: Notification) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{n.title}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{n.message}</div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: (n: Notification) => <Badge variant="indigo">{n.type || "Notice"}</Badge>,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-500" />
          <span>Coordinator Notifications</span>
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Recent administrative alerts and notices.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search notifications..." className="w-full sm:w-72" />
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="No Notifications" description="No department notifications found." />
      ) : (
        <Table columns={columns} data={filteredNotifications} />
      )}
    </div>
  );
};

export default CoordinatorNotificationsPage;

import React, { useEffect, useState } from "react";
import { Notification } from "../../types";
import { getAdminNotifications, createAdminNotification, deleteAdminNotification } from "../../services/adminService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Bell, Plus, Trash2 } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"System" | "Academic" | "Alert">("System");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminNotifications();
      if (res.data) setNotifications(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch system notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    try {
      setIsSaving(true);
      const res = await createAdminNotification({
        title,
        message,
        type,
        read: false,
      });

      const newNotif = res.data || ({
        id: `an_${Date.now()}`,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      } as Notification);

      setNotifications((prev) => [newNotif, ...prev]);
      setIsModalOpen(false);
      setTitle("");
      setMessage("");
    } catch (err: any) {
      alert(err.message || "Failed to broadcast notification.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminNotification(deleteTarget.id || (deleteTarget as any)._id);
      setNotifications((prev) => prev.filter((n) => (n.id || (n as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete notification.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.message?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading system broadcasts..." />;
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
      accessor: (n: Notification) => <Badge variant="indigo">{n.type || "System"}</Badge>,
    },
    {
      header: "Actions",
      accessor: (n: Notification) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(n)} icon={Trash2}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            <span>System Notifications & Announcements</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Broadcast announcements and system alerts across the portal.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Broadcast
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search notifications..." className="w-full sm:w-72" />
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications Found"
          description="Send your first broadcast notification using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredNotifications} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send System Notification Broadcast">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Notification Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Maintenance Notice" required />
          <Textarea label="Message Content" value={message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)} placeholder="System will undergo scheduled maintenance..." required />
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm">
              <option value="System">System</option>
              <option value="Academic">Academic</option>
              <option value="Alert">Alert</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Notification"
          message={`Are you sure you want to delete ${deleteTarget.title}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default NotificationsPage;

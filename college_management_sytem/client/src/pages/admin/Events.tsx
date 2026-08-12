import React, { useEffect, useState } from "react";
import { Event } from "../../types";
import { getAdminEvents, createAdminEvent, deleteAdminEvent } from "../../services/adminService";
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
import { Sparkles, Plus, Trash2 } from "lucide-react";

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Academic" | "Cultural" | "Sports" | "Workshop">("Academic");
  const [startDate, setStartDate] = useState("2026-09-10");
  const [endDate, setEndDate] = useState("2026-09-12");
  const [venue, setVenue] = useState("Main Auditorium");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminEvents();
      if (res.data) setEvents(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch campus events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;
    try {
      setIsSaving(true);
      const res = await createAdminEvent({
        title,
        description,
        type,
        startDate,
        endDate,
        venue,
        published: true,
      });

      const newEvt = res.data || ({
        id: `ev_${Date.now()}`,
        title,
        description,
        type,
        startDate,
        endDate,
        venue,
        published: true,
      } as Event);

      setEvents((prev) => [newEvt, ...prev]);
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      alert(err.message || "Failed to publish event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminEvent(deleteTarget.id || (deleteTarget as any)._id);
      setEvents((prev) => prev.filter((e) => (e.id || (e as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading campus event calendar..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEvents} />;

  const columns = [
    {
      header: "Event Title",
      accessor: (e: Event) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{e.title}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-xs">{e.description}</div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (e: Event) => <Badge variant="indigo">{e.type}</Badge>,
    },
    {
      header: "Dates & Venue",
      accessor: (e: Event) => (
        <div>
          <div className="text-xs font-medium text-gray-800 dark:text-slate-200">{e.startDate} - {e.endDate}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">Venue: {e.venue}</div>
        </div>
      ),
    },
    {
      header: "Published",
      accessor: (e: Event) => <Badge variant="emerald">Published</Badge>,
    },
    {
      header: "Actions",
      accessor: (e: Event) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(e)} icon={Trash2}>
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
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span>Campus Event Management</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Publish academic seminars, hackathons, and cultural events.
          </p>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Event
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events..." className="w-full sm:w-72" />
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Events Found"
          description="Create your first event using the button above."
        />
      ) : (
        <Table columns={columns} data={filteredEvents} />
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Campus Event">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Annual Hackathon 2026" required />
          <Textarea label="Description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Event details..." required />
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">Category</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white text-sm">
              <option value="Academic">Academic</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <Input label="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Main Auditorium" required />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Publish Event
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
          title="Delete Event"
          message={`Are you sure you want to delete ${deleteTarget.title}?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default EventsPage;

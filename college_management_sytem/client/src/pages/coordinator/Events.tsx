import React, { useEffect, useState } from "react";
import { Event } from "../../types";
import { getCoordinatorEvents } from "../../services/coordinatorService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { Sparkles } from "lucide-react";

export const CoordinatorEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCoordinatorEvents();
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

  const filteredEvents = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading campus events..." />;
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
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <span>Department & Campus Events</span>
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          View upcoming institutional events, workshops, and seminars.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events..." className="w-full sm:w-72" />
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState icon={Sparkles} title="No Events Scheduled" description="No department events found." />
      ) : (
        <Table columns={columns} data={filteredEvents} />
      )}
    </div>
  );
};

export default CoordinatorEventsPage;

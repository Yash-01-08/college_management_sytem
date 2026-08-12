import React, { useEffect, useState } from "react";
import { getFacultyEvents } from "../../services/facultyService";
import { Event } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Sparkles, Calendar, MapPin } from "lucide-react";

export const FacultyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFacultyEvents()
      .then((res) => setEvents(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading events..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Academic & Campus Events
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Faculty meetings, curriculum workshops, and department notices
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No Events Available" description="No faculty events published." icon={Sparkles} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <Card key={ev.id || ev._id}>
              <Badge variant="primary" className="mb-2">{ev.type}</Badge>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{ev.title}</h3>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-4">{ev.description}</p>
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{new Date(ev.startDate).toLocaleDateString()} – {new Date(ev.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Venue: {ev.venue}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyEvents;

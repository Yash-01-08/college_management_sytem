import React, { useEffect, useState } from "react";
import { getStudentEvents } from "../../services/studentService";
import { Event } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Sparkles, Calendar, MapPin, Building2 } from "lucide-react";

export const StudentEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentEvents();
      setEvents(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <Loader message="Loading published campus events..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEvents} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Campus Events & Announcements
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Explore upcoming academic workshops, hackathons, and cultural fests
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No Upcoming Events" description="There are currently no active events published." icon={Sparkles} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <Card key={ev.id || ev._id} className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="primary">{ev.type}</Badge>
                  <span className="text-[11px] text-gray-400 font-medium">
                    Published
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {ev.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-3 mb-4">
                  {ev.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80 space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>
                    {new Date(ev.startDate).toLocaleDateString()} – {new Date(ev.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Venue: {ev.venue}</span>
                </div>

                {ev.department && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Dept: {ev.department}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;

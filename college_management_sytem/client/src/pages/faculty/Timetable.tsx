import React, { useEffect, useState } from "react";
import { getFacultyTimetable } from "../../services/facultyService";
import { TimetableSlot } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Calendar, Clock, MapPin } from "lucide-react";

export const FacultyTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getFacultyTimetable();
      setTimetable(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load teaching schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  if (loading) return <Loader label="Loading teaching schedule..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTimetable} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Teaching Timetable
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Weekly lecture assignments, lab sessions, and classroom schedules
        </p>
      </div>

      {timetable.length === 0 ? (
        <EmptyState title="No Teaching Schedule" description="You have no assigned lecture slots for this academic period." icon={Calendar} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {timetable.map((slot) => (
            <Card key={slot.id || slot._id} className="relative">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {slot.subjectCode}
                </span>
                <Badge variant={slot.type === "Theory" ? "primary" : "warning"}>
                  {slot.type}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {slot.subjectName || "Subject"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{slot.courseName} &bull; Sem {slot.semester}</p>

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{slot.day}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>{slot.startTime} – {slot.endTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Room: {slot.room}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyTimetable;

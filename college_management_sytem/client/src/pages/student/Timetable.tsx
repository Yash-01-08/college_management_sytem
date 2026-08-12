import React, { useEffect, useState } from "react";
import { getStudentTimetable } from "../../services/studentService";
import { TimetableSlot } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { EmptyState } from "../../components/ui/EmptyState";
import { Calendar, Clock, MapPin, UserCheck } from "lucide-react";

export const StudentTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentTimetable();
      setTimetable(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load class schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  if (loading) return <Loader message="Weekly class schedule..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTimetable} />;

  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Weekly Class Timetable
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Your active lecture sessions, lab periods, and room assignments
        </p>
      </div>

      {timetable.length === 0 ? (
        <EmptyState title="No Schedule Found" description="There are no classes scheduled for your current term." icon={Calendar} />
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const slotsForDay = timetable.filter((t) => t.day === day);
            if (slotsForDay.length === 0) return null;

            return (
              <div key={day} className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>{day}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slotsForDay.map((slot) => (
                    <Card key={slot.id || slot._id} className="relative">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {slot.subjectCode}
                        </span>
                        <Badge
                          variant={
                            slot.type === "Theory"
                              ? "primary"
                              : slot.type === "Lab"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {slot.type}
                        </Badge>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                        {slot.subjectName || (typeof slot.subject === "object" ? slot.subject.name : "Subject")}
                      </h4>

                      <div className="space-y-1.5 text-xs text-gray-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>Room: {slot.room}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">
                            {slot.facultyName || (typeof slot.faculty === "object" ? slot.faculty.name : "Faculty")}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;

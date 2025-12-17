import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import { getStudyCalendar, updateCalendarEvent } from '../lib/api';
import { Loader2, RefreshCw, Upload, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function StudyPlanner() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudyCalendar();
      if (response.success) {
        // Convert date components to local Date objects
        const formattedEvents = response.data.map((event: any) => {
          // Handle both object format (new) and string format (legacy)
          const startDate = typeof event.start === 'object' && event.start.year
            ? new Date(event.start.year, event.start.month, event.start.day, event.start.hour, event.start.minute)
            : new Date(event.start);
          const endDate = typeof event.end === 'object' && event.end.year
            ? new Date(event.end.year, event.end.month, event.end.day, event.end.hour, event.end.minute)
            : new Date(event.end);

          return {
            ...event,
            start: startDate,
            end: endDate,
          };
        });
        setEvents(formattedEvents);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load calendar');
      // Fallback to demo events
      setEvents([
        {
          id: '1',
          title: 'Study: Quantum Physics',
          start: new Date(new Date().setHours(10, 0, 0)),
          end: new Date(new Date().setHours(12, 0, 0)),
          type: 'study',
        },
        {
          id: '2',
          title: 'Exam: Organic Chemistry',
          start: new Date(new Date().setDate(new Date().getDate() + 1)),
          end: new Date(new Date().setDate(new Date().getDate() + 1)),
          allDay: true,
          type: 'exam',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = async (event: any) => {
    if (event.id) {
      try {
        await updateCalendarEvent(event.id, !event.completed);
        fetchEvents(); // Refresh
      } catch (err) {
        console.error('Failed to update event');
      }
    }
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#6C63FF'; // nebula-purple
    if (event.type === 'exam') backgroundColor = '#FF4D4D';
    if (event.type === 'review') backgroundColor = '#00F0FF';
    if (event.completed) backgroundColor = '#22C55E';

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: event.completed ? 0.6 : 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        textDecoration: event.completed ? 'line-through' : 'none',
      },
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Planner</h1>
          <p className="text-gray-400">
            Your roadmap to mastery. Click on events to mark them complete.
          </p>
        </div>
        <Button variant="outline" onClick={fetchEvents} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
          {error} - Showing demo data
        </div>
      )}

      <Card className="h-full bg-cosmic-blue/40 border-white/10 p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-nebula-purple animate-spin" />
          </div>
        ) : events.length === 0 && !error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-nebula-purple/20 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-nebula-purple" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Study Plan Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Upload your syllabus to generate a personalized study plan. Our AI will analyze your curriculum and create a smart schedule.
            </p>
            <Link to="/upload">
              <Button variant="neon" size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Upload Syllabus
              </Button>
            </Link>
          </div>
        ) : (
          <div className="h-full study-calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              defaultView="week"
              onSelectEvent={handleSelectEvent}
              scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
              min={new Date(1970, 1, 1, 6, 0, 0)}
              max={new Date(1970, 1, 1, 22, 0, 0)}
            />
          </div>
        )}
      </Card>

      <style>{`
        .rbc-calendar { color: #EAEAEA; }
        .rbc-today { background-color: rgba(108, 99, 255, 0.1); }
        .rbc-off-range-bg { background-color: rgba(255,255,255,0.05); }
        .rbc-header { padding: 10px; font-weight: bold; color: #00F0FF; border-bottom-color: rgba(255,255,255,0.1); }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: rgba(255,255,255,0.1); }
        .rbc-day-bg + .rbc-day-bg { border-left-color: rgba(255,255,255,0.1); }
        .rbc-month-row + .rbc-month-row { border-top-color: rgba(255,255,255,0.1); }
        .rbc-time-header-content { border-left-color: rgba(255,255,255,0.1); }
        .rbc-time-content { border-top-color: rgba(255,255,255,0.1); }
        .rbc-time-content > * + * > * { border-left-color: rgba(255,255,255,0.1); }
        .rbc-timeslot-group { border-bottom-color: rgba(255,255,255,0.05); }
        .rbc-day-slot .rbc-time-slot { border-top-color: rgba(255,255,255,0.05); }
        .rbc-toolbar button { color: #EAEAEA; border-color: rgba(255,255,255,0.2); }
        .rbc-toolbar button:hover { background-color: rgba(255,255,255,0.1); }
        .rbc-toolbar button.rbc-active { background-color: #6C63FF; color: white; border-color: #6C63FF; }
      `}</style>
    </div>
  );
}

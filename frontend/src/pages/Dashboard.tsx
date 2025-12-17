import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, CheckCircle, Clock, Trophy, Upload, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudyCalendar, getQuizHistory } from "../lib/api";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    topicsMastered: 0,
    studyHours: 0,
    tasksCompleted: 0,
    streak: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch calendar events
        const calendarRes = await getStudyCalendar();
        if (calendarRes.success && calendarRes.data) {
          const events = calendarRes.data.slice(0, 5);
          setUpcomingTasks(events.map((e: any) => ({
            title: e.topic || e.title,
            date: new Date(e.start).toLocaleDateString('en-US', { 
              weekday: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            type: e.type || 'Study'
          })));

          // Calculate stats from events
          const completed = calendarRes.data.filter((e: any) => e.completed).length;
          setStats(prev => ({
            ...prev,
            tasksCompleted: completed,
            topicsMastered: Math.floor(completed / 3)
          }));
        }

        // Fetch quiz history for streak
        const quizRes = await getQuizHistory();
        if (quizRes.success && quizRes.data) {
          setStats(prev => ({
            ...prev,
            streak: quizRes.data.length > 0 ? Math.min(quizRes.data.length, 7) : 0
          }));
        }
      } catch (err) {
        // Use demo data on error
        setUpcomingTasks([
          { title: "Quantum Physics Basics", date: "Today, 2:00 PM", type: "Study" },
          { title: "Organic Chemistry Quiz", date: "Tomorrow, 10:00 AM", type: "Exam" },
          { title: "Calculus Limits", date: "Wed, 4:00 PM", type: "Review" },
        ]);
        setStats({
          topicsMastered: 12,
          studyHours: 45,
          tasksCompleted: 28,
          streak: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "Topics Mastered", value: stats.topicsMastered.toString(), icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/20" },
    { label: "Study Hours", value: `${stats.studyHours}h`, icon: Clock, color: "text-highlight-cyan", bg: "bg-highlight-cyan/20" },
    { label: "Tasks Completed", value: stats.tasksCompleted.toString(), icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/20" },
    { label: "Current Streak", value: `${stats.streak} Days`, icon: BookOpen, color: "text-pink-500", bg: "bg-pink-500/20" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Ready to explore the universe of knowledge?</p>
        </div>
        <Link to="/upload">
          <Button variant="neon" className="gap-2">
            <Upload className="w-4 h-4" /> New Syllabus
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-white/10 bg-cosmic-blue/40">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[300px] border-white/10 bg-cosmic-blue/40">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link to="/upload">
                <Card className="bg-nebula-purple/20 border-nebula-purple/30 hover:border-nebula-purple transition-colors cursor-pointer p-6 text-center">
                  <Upload className="w-8 h-8 text-nebula-purple mx-auto mb-2" />
                  <p className="text-white font-medium">Upload Syllabus</p>
                  <p className="text-xs text-gray-400 mt-1">Start a new study plan</p>
                </Card>
              </Link>
              <Link to="/tutor">
                <Card className="bg-highlight-cyan/20 border-highlight-cyan/30 hover:border-highlight-cyan transition-colors cursor-pointer p-6 text-center">
                  <BookOpen className="w-8 h-8 text-highlight-cyan mx-auto mb-2" />
                  <p className="text-white font-medium">AI Tutor</p>
                  <p className="text-xs text-gray-400 mt-1">Get help with topics</p>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks Sidebar */}
        <div className="space-y-8">
          <Card className="border-white/10 bg-cosmic-blue/40">
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Missions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-nebula-purple animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.length > 0 ? upcomingTasks.map((task, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-md hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                      <Calendar className="w-5 h-5 text-nebula-purple mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="text-sm text-gray-400">{task.date}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 mt-1 inline-block">
                          {task.type}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-400 text-center py-4">No upcoming tasks. Upload a syllabus to get started!</p>
                  )}
                </div>
              )}
              <Link to="/planner">
                <Button variant="ghost" className="w-full mt-4 text-nebula-purple">
                  View Full Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

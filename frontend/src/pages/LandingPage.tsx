import { Button } from "../components/ui/Button";
import { Card, CardContent, CardTitle } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Calendar, Upload } from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-[url('/bg-stars.svg')] bg-cover relative overflow-hidden">
        {/* Background Elements using CSS pseudo or inline styles for simple shapes */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-nebula-purple/20 rounded-full blur-3xl animate-float -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-blue/40 rounded-full blur-3xl animate-pulse-glow -z-10" />

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-highlight-cyan to-nebula-purple animate-fade-in-up">
          Master Your Syllabus <br /> <span className="text-starlight-white">In Light Speed</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10 text-lg">
          AI-powered study planner and tutor that adapts to your learning style. Upload your syllabus and let us chart the course to success.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/upload">
            <Button size="lg" variant="neon" className="gap-2">
              <Upload className="w-4 h-4" /> Upload Syllabus
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="gap-2">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-deep-void">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Why Learn-Flow?
            </h2>
            <p className="mt-4 text-gray-400">Everything you need to ace your exams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-cosmic-blue/30 border-white/5 hover:border-nebula-purple/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-nebula-purple/20 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-nebula-purple" />
                </div>
                <CardTitle className="mb-2">Smart Planner</CardTitle>
                <p className="text-gray-400">
                  Auto-generates a personalized study schedule based on your syllabus and exam dates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-blue/30 border-white/5 hover:border-nebula-purple/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-highlight-cyan/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-highlight-cyan" />
                </div>
                <CardTitle className="mb-2">AI Tutor</CardTitle>
                <p className="text-gray-400">
                  Stuck on a concept? Get instant explanations with analogies like Marvel or Football.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-blue/30 border-white/5 hover:border-nebula-purple/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-pink-500/20 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-pink-500" />
                </div>
                <CardTitle className="mb-2">Instant Setup</CardTitle>
                <p className="text-gray-400">
                  Simply upload your syllabus PDF and we'll extract the topics and deadlines for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

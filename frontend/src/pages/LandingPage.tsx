import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Brain, BarChart3, Lock } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-text pt-24 font-inter">
      
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gray/20 via-brand-black to-brand-black -z-10 blur-3xl opacity-50" />
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          The Smarter Way <br />
          <span className="text-brand-text-muted">to Master Learning</span>
        </h1>
        
        <p className="text-lg md:text-xl text-brand-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
          Learn-Flow helps modern students streamline their education with a powerful, AI-driven platform that adapts to you.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-sm tracking-wide transition-all transform hover:scale-105">
              Start for free
            </Button>
          </Link>
          <Link to="/features">
            <Button size="lg" variant="ghost" className="h-12 px-8 rounded-full border border-brand-gray text-brand-text hover:bg-brand-gray/50 text-sm font-semibold">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* Main Large Card */}
          <div className="md:col-span-2 md:row-span-2 bg-brand-dark border border-brand-gray rounded-[32px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-full bg-brand-gray flex items-center justify-center mb-6">
                 <Brain className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-3xl font-bold mb-4">Smart Matching</h3>
               <p className="text-brand-text-muted text-lg">Our AI analyzes your syllabus to find your perfect learning path.</p>
             </div>
             <div className="mt-8 relative h-64 w-full bg-brand-black/50 rounded-2xl border border-brand-gray/30 p-6 flex flex-col items-center justify-center gap-4 group-hover:bg-brand-black/70 transition-colors">
                <div className="w-16 h-16 rounded-full bg-brand-light-gray flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="text-center">
                  <div className="font-bold">Student</div>
                  <div className="text-xs text-brand-text-muted">Analysis Complete</div>
                </div>
             </div>
          </div>

          {/* Top Right Wide Card */}
          <div className="md:col-span-2 md:row-span-1 bg-brand-dark border border-brand-gray rounded-[32px] p-10 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-2xl font-bold mb-2">Live Collaboration</h3>
            <p className="text-brand-text-muted mb-6">Code editor and chat in one place (Coming Soon).</p>
            <div className="bg-brand-black rounded-lg p-4 font-mono text-xs text-brand-text-muted border border-brand-gray/50">
               <span className="text-purple-400">function</span> <span className="text-blue-400">learn</span>() {'{'} <br/>
               &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-400">"success"</span>;<br/>
               {'}'}
            </div>
          </div>

          {/* Bottom Small Card 1 */}
          <div className="md:col-span-1 md:row-span-1 bg-brand-dark border border-brand-gray rounded-[32px] p-8 flex flex-col justify-between group hover:border-white/20 transition-colors">
            <Lock className="w-8 h-8 text-brand-text-muted mb-4" />
            <div>
              <h3 className="text-lg font-bold mb-1">Secure</h3>
              <p className="text-xs text-brand-text-muted">Enterprise grade security for your data.</p>
            </div>
          </div>

          {/* Bottom Small Card 2 */}
          <div className="md:col-span-1 md:row-span-1 bg-brand-dark border border-brand-gray rounded-[32px] p-8 flex flex-col justify-between group hover:border-white/20 transition-colors">
            <BarChart3 className="w-8 h-8 text-white mb-4" />
            <div>
              <h3 className="text-lg font-bold mb-1">Growth</h3>
              <p className="text-xs text-brand-text-muted">Track your progress with detailed charts.</p>
            </div>
            <div className="flex gap-1 mt-4 items-end h-8">
               <div className="w-1/4 bg-brand-gray h-2/3 rounded-sm"></div>
               <div className="w-1/4 bg-brand-gray h-1/2 rounded-sm"></div>
               <div className="w-1/4 bg-brand-gray h-3/4 rounded-sm"></div>
               <div className="w-1/4 bg-white h-full rounded-sm shadow-[0_0_10px_white]"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-gray py-12 text-center text-brand-text-muted text-sm">
        <p>&copy; 2025 Learn-Flow. All rights reserved.</p>
      </footer>

    </div>
  );
}

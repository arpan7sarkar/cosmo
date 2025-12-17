import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Rocket } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-cosmic-blue bg-space-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-nebula-purple animate-pulse" />
              <span className="font-bold text-xl text-white tracking-wider">Learn-Flow</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link to="/planner" className="text-gray-300 hover:text-white transition-colors">Planner</Link>
            <Link to="/tutor" className="text-gray-300 hover:text-white transition-colors">AI Tutor</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="neon" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

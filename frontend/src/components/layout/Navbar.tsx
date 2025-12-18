import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Rocket } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Planner', path: '/planner' },
    { name: 'AI Tutor', path: '/tutor' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="bg-brand-dark/80 backdrop-blur-md border border-brand-gray rounded-full px-6 h-14 flex items-center shadow-lg w-full max-w-4xl justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-white text-brand-black p-1 rounded-full group-hover:scale-110 transition-transform">
             <Rocket className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-sm tracking-wide text-brand-text">Learn-Flow</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={cn(
                "text-xs font-medium transition-colors hover:text-white",
                location.pathname === link.path ? "text-white" : "text-brand-text-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-full px-4 bg-white text-black border-none hover:bg-gray-200 hover:text-black font-semibold">
              Get Started
            </Button>
          </Link>
        </div>

      </nav>
    </div>
  );
}

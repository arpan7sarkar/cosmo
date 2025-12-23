import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Features } from "./Features";
import { Testimonials } from "../components/landing/Testimonials";
import { FAQ } from "../components/landing/FAQ";
import { CTA } from "../components/landing/CTA";
import { Pricing } from "../components/landing/Pricing";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";

export function LandingPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }; // Smooth physics
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const background = useMotionTemplate`radial-gradient(
    600px circle at ${springX}px ${springY}px,
    rgba(20, 20, 20, 0.6),
    transparent 80%
  )`;

  function handleMouseMove({ clientX, clientY, currentTarget }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="min-h-screen bg-[#050505] text-white pt-24 font-inter selection:bg-white/20 relative group overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)'
        }}
      />

      {/* Interactive Cursor Gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 group-hover:opacity-100 opacity-40 mix-blend-screen"
        style={{
          background: background,
        }}
      />

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-48 text-center max-w-5xl mx-auto z-10">

        {/* Floating Accents (Stars/Plus) */}
        <div className="absolute top-20 left-[10%] text-gray-700 animate-pulse">+</div>
        <div className="absolute top-40 right-[15%] text-gray-700 animate-pulse delay-700">+</div>
        <div className="absolute bottom-32 left-[20%] h-1 w-1 bg-white rounded-full opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-gray-400 mb-12 tracking-wide uppercase hover:bg-white/[0.08] transition-colors cursor-default backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            Trusted Education Platform
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.1] bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent pb-3">
            Revolutionize Your <br />
            Learning Experience
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Experience the future of education with our state-of-the-art AI technology.
            Secure, personalized, and designed to help you master every concept.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link to="/sign-in">
              <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 font-medium text-base tracking-wide transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Horizon Glow Effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[300px] bg-gradient-to-t from-white/[0.08] to-transparent blur-[80px] rounded-[100%] pointer-events-none" />
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 pb-24 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <span className="relative inline-flex items-center gap-3 bg-[#050505] px-6 py-2 rounded-full border border-white/10 text-sm text-gray-300 font-medium shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-pulse"></span>
            Powering Your Success
          </span>
        </div>
        <Features />
      </section>

      {/* Social Proof */}
      <Testimonials />

      {/* Pricing */}
      <Pricing />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <CTA />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center relative z-10 bg-[#050505]">
        <p className="text-gray-500 text-sm">
          &copy; 2025 Learn-Flow. Crafted with <span className="text-gray-300">Intelligence</span>.
        </p>
      </footer>

    </div>
  );
}

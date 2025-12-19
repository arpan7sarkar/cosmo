import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Rocket, Sparkles, BookOpen, Brain, Target } from "lucide-react";
import { motion } from "framer-motion";

export function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter flex">
      {/* Background Grid */}
      <div
        className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/[0.05] to-transparent blur-[80px]" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="bg-white text-black p-2 rounded-full group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl tracking-wide">Learn-Flow</span>
          </Link>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl xl:text-5xl font-medium tracking-tight mb-6 leading-tight"
          >
            Start your
            <br />
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              learning journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed"
          >
            Join thousands of students who are mastering their subjects with
            AI-powered study tools.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              { icon: Sparkles, text: "Personalized Study Plans" },
              { icon: BookOpen, text: "Upload Any Syllabus" },
              { icon: Brain, text: "24/7 AI Tutor Access" },
              { icon: Target, text: "Track Your Progress" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-gray-300"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-gray-500 text-sm">
              Trusted by <span className="text-white font-medium">10,000+</span>{" "}
              students worldwide
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-white text-black p-2 rounded-full">
              <Rocket className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl tracking-wide">Learn-Flow</span>
          </div>

          {/* Clerk SignUp Component */}
          <SignUp
            appearance={{
              variables: {
                colorPrimary: "white",
                colorText: "white",
                colorBackground: "#0a0a0a",
                colorInputBackground: "#050505",
                colorInputText: "white",
                colorTextSecondary: "#9ca3af",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-black/50 rounded-2xl",
                headerTitle: "text-white text-2xl font-medium",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton:
                  "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors",
                socialButtonsBlockButtonText: "text-white font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-gray-500",
                formFieldLabel: "text-gray-300 text-sm",
                formFieldInput:
                  "bg-[#050505] border border-white/10 text-white rounded-lg focus:border-white/30 focus:ring-0 placeholder:text-gray-600",
                formButtonPrimary:
                  "bg-white text-black hover:bg-gray-200 font-medium rounded-full transition-all shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]",
                footer: "bg-transparent",
                footerActionText: "text-gray-500",
                footerActionLink: "text-white hover:text-gray-300",
                identityPreviewEditButton: "text-white hover:text-gray-300",
                formFieldAction: "text-gray-400 hover:text-white",
                alertText: "text-gray-300",
                logoBox: "hidden",
                navbar: "hidden",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />

          {/* Additional Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

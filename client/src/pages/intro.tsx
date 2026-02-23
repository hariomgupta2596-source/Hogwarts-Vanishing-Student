import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { useLogin } from "@/hooks/use-game";
import { FloatingOrbs } from "@/components/FloatingOrbs";

export function Intro() {
  const [username, setUsername] = useState("");
  const { mutate: login, isPending } = useLogin();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    login({ username }, {
      onSuccess: () => {
        setLocation("/hub");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingOrbs />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel max-w-lg w-full p-8 md:p-12 rounded-2xl relative z-10 box-glow"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded-full border border-primary/20">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center mt-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-primary/70 font-display text-sm tracking-[0.2em] uppercase mb-4">Department of Mysteries</h2>
            <h1 className="font-display text-4xl md:text-5xl text-primary text-glow leading-tight mb-6">
              The Vanishing<br/>Student
            </h1>
            <p className="font-serif text-muted-foreground leading-relaxed text-lg">
              A student has been erased from the archives of Hogwarts. The Wizengamot requires an investigator to piece together the scattered fragments of truth.
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-serif text-sm text-primary/80 uppercase tracking-wider block text-center">
              Sign the Register
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your investigator name..."
              className="w-full bg-background/50 border-2 border-primary/30 rounded-xl px-6 py-4 text-center text-lg font-serif text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isPending}
            className="w-full relative group overflow-hidden rounded-xl p-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-background px-8 py-4 rounded-[10px] flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-background/80">
              <span className="font-display font-bold text-primary tracking-wider text-lg">
                {isPending ? "Opening Archives..." : "Begin Investigation"}
              </span>
              <Sparkles className="w-5 h-5 text-primary group-hover:animate-spin" />
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  );
}

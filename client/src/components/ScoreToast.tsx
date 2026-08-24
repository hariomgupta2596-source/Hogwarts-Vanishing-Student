import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

interface ScoreToastProps {
  delta: number | null;
  message?: string;
}

export function ScoreToast({ delta, message }: ScoreToastProps) {
  if (delta === null || delta === 0) return null;

  const isPositive = delta > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        className="fixed top-6 right-6 z-50 pointer-events-none"
      >
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md shadow-2xl ${
            isPositive
              ? "bg-primary/20 border-primary/50 text-primary box-glow"
              : "bg-red-950/40 border-red-500/50 text-red-400"
          }`}
        >
          {isPositive ? <Sparkles className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5 text-red-400" />}
          <div>
            <div className="font-display font-bold text-lg tracking-wider">
              {isPositive ? `+${delta} PTS` : `${delta} PTS`}
            </div>
            {message && <div className="text-xs font-serif opacity-90">{message}</div>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

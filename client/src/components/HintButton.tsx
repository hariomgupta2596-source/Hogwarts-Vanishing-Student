import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, AlertTriangle, X, HelpCircle, Sparkles } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { useUpdateProgress } from "@/hooks/use-game";
import { soundManager } from "@/lib/audio";

interface HintButtonProps {
  gameId: number;
  freeHint: string;
  deepHint: string;
}

export function HintButton({ gameId, freeHint, deepHint }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeep, setShowDeep] = useState(false);
  const user = useGameStore((state) => state.user);
  const usedHints = useGameStore((state) => state.usedHints);
  const setHintUsed = useGameStore((state) => state.setHintUsed);
  const isMuted = useGameStore((state) => state.isMuted);
  const { mutate: updateProgress } = useUpdateProgress();

  const isHintUsed = usedHints[gameId];

  const handleOpen = () => {
    if (!isMuted) soundManager.playHint();
    setIsOpen(true);
  };

  const handleRequestDeepHint = () => {
    if (isHintUsed) {
      setShowDeep(true);
      return;
    }
    if (!isMuted) soundManager.playError();
    setHintUsed(gameId);
    setShowDeep(true);

    if (user) {
      // Subtle penalty of 20 points
      updateProgress({ scoreAdded: -20, gameCompleted: user.completedGames });
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="glass-panel px-4 py-2 rounded-xl text-primary border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all flex items-center gap-2 font-display text-sm box-glow"
      >
        <BookOpen className="w-4 h-4 text-primary" />
        <span>Consult Restricted Section</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel max-w-lg w-full p-8 rounded-2xl border-2 border-primary/40 relative box-glow-strong"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/30">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-primary text-glow">The Restricted Section</h3>
                  <p className="font-serif text-xs text-muted-foreground uppercase tracking-widest">Archival Clues & Transmutation Logic</p>
                </div>
              </div>

              <div className="space-y-4 my-6">
                <div className="p-4 rounded-xl bg-background/50 border border-primary/20">
                  <div className="flex items-center gap-2 font-display text-xs text-primary mb-2">
                    <Sparkles className="w-4 h-4" /> Free Investigator Insight
                  </div>
                  <p className="font-serif text-foreground/90 text-sm leading-relaxed">{freeHint}</p>
                </div>

                {showDeep ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/40"
                  >
                    <div className="flex items-center gap-2 font-display text-xs text-primary mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Deep Archival Revelation (-20 PTS)
                    </div>
                    <p className="font-serif text-foreground text-sm font-semibold leading-relaxed">{deepHint}</p>
                  </motion.div>
                ) : (
                  <button
                    onClick={handleRequestDeepHint}
                    className="w-full py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-serif text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Reveal Deep Clue (-20 PTS Penalty)</span>
                  </button>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-display text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Return to Investigation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

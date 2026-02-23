import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FloatingOrbs } from "@/components/FloatingOrbs";

export function Entry() {
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Start loading sequence
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setShowButton(true);
      }, 500);
    }, 5500); // 5s for the bar + small delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0f]">
      <FloatingOrbs />
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg flex flex-col items-center gap-8 relative z-10"
          >
            <div className="text-center space-y-4">
              <h2 className="font-display text-primary/70 text-sm tracking-[0.3em] uppercase">Preparing the Archives</h2>
              <div className="wand-container">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: [0.4, 0, 0.2, 1] }}
                  className="wand-progress"
                />
                <div className="magic-glow" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative z-10"
          >
            <button
              onClick={() => setLocation("/login")}
              className="image-button group show-button"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-colors" />
                <div className="relative bg-background/40 p-8 rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors box-glow">
                  <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-display text-2xl text-primary text-glow tracking-widest uppercase">Enter Hogwarts</p>
                <p className="font-serif text-muted-foreground text-sm italic">Begin your investigation</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

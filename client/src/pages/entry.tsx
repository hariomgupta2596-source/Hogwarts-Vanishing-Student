import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import entryBg from "@assets/Entry_Background_1772032172890.png";
import playBtnImg from "@assets/play1_1772032184266.png";

export function Entry() {
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setShowButton(true);
      }, 500);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.7), rgba(10, 10, 15, 0.7)), url(${entryBg})` }}
    >
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
              className="group transition-transform hover:scale-110 active:scale-95"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-colors" />
                <img 
                  src={playBtnImg} 
                  alt="Enter Hogwarts" 
                  className="relative w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                />
              </div>
              <div className="text-center mt-4 space-y-2">
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

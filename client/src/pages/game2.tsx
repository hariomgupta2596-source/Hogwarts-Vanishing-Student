import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { Lock, Unlock, HelpCircle, FileText } from "lucide-react";
import receiptBg from "@assets/recipt_bg.jpg";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { Lock, Unlock, HelpCircle as HelpCircleIcon, FileText } from "lucide-react";
import receiptBg from "@assets/recipt_bg.jpg";

const CODE = "052";
const CLUES = [
  { hint: "682", text: "One digit is correct and in the right place" },
  { hint: "615", text: "One digit is correct but in the wrong place" },
  { hint: "206", text: "Two digits are correct but in the wrong place" },
  { hint: "738", text: "Nothing is correct" },
];

export function Game2() {
  const [phase, setStep] = useState<"lock" | "assemble" | "math">("lock");
  const [inputCode, setInputCode] = useState(["", "", ""]);
  const [mathAnswers, setMathAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newCode = [...inputCode];
    newCode[idx] = val;
    setInputCode(newCode);
    if (newCode.join("") === CODE) {
      setTimeout(() => setStep("assemble"), 500);
    }
  };

  const checkMath = () => {
    if (mathAnswers.q1 === "2" && mathAnswers.q2 === "3" && mathAnswers.q3 === "7") {
      if (user && user.completedGames < 2) {
        updateProgress({ scoreAdded: 100, gameCompleted: 2 }, {
          onSuccess: () => setLocation("/hub")
        });
      } else {
        setLocation("/hub");
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <Link href="/guide" className="absolute top-8 right-8 z-20 text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif">
        <HelpCircleIcon className="w-5 h-5" />
        style={{ 
          backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.8), rgba(10, 10, 15, 0.8)), url(${receiptBg})` 
        }}
      >
        
        <AnimatePresence mode="wait">
          {phase === "lock" && (
            <motion.div 
              key="lock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-md w-full"
            >
              <div className="glass-panel p-8 rounded-2xl text-center border-primary/30 box-glow">
                <Lock className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                <h2 className="font-display text-2xl text-primary mb-6">Code Breaker</h2>
                
                <div className="space-y-4 mb-8">
                  {CLUES.map((clue, i) => (
                    <div key={i} className="flex items-center gap-4 text-left p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <span className="font-mono text-xl font-bold text-primary">{clue.hint}</span>
                      <span className="font-serif text-sm text-muted-foreground">{clue.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  {inputCode.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      className="w-16 h-20 bg-background/50 border-2 border-primary/30 rounded-xl text-center text-4xl font-display text-primary focus:border-primary focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <button 
                  onClick={() => setShowHint(true)}
                  className="text-primary/60 hover:text-primary transition-colors flex items-center gap-2 mx-auto text-sm font-serif"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showHint ? "Clue: 0 and 5 are the other digits" : "Need a hint?"}
                </button>
              </div>
            </motion.div>
          )}

          {phase === "assemble" && (
            <motion.div 
              key="assemble"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onAnimationComplete={() => setTimeout(() => setStep("math"), 2500)}
              className="relative w-full max-w-lg aspect-square flex items-center justify-center"
            >
              <Unlock className="absolute top-0 w-12 h-12 text-primary animate-bounce" />
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: (Math.random() - 0.5) * 600, 
                    y: (Math.random() - 0.5) * 600,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 2, ease: "circOut", delay: i * 0.05 }}
                  className="absolute w-24 h-24 bg-[#f4e4bc] border border-[#3a2f24]/20 shadow-lg"
                  style={{ 
                    clipPath: `polygon(${Math.random()*20}% 0%, ${80+Math.random()*20}% 0%, 100% ${80+Math.random()*20}%, 0% 100%)`,
                     backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")'
                  }}
                />
              ))}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-display text-3xl text-primary text-glow"
              >
                Restoring Records...
              </motion.div>
            </motion.div>
          )}

          {phase === "math" && (
            <motion.div 
              key="math"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full"
            >
              <div className="bg-[#f4e4bc] text-[#3a2f24] p-10 rounded-sm shadow-2xl relative overflow-hidden font-serif" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' }}>
                <div className="absolute top-0 left-0 w-full h-4 bg-background/80 blur-[2px]" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }} />
                <h2 className="font-display text-2xl text-center mb-8 border-b-2 border-[#3a2f24]/30 pb-4">Three Broomsticks</h2>
                
                <div className="space-y-6 text-xl">
                  <div className="flex justify-between items-center border-b border-[#3a2f24]/10 pb-2">
                    <span>Butterbeer (x2)</span>
                    <div className="flex items-center gap-2">
                      <span>@</span>
                      <input 
                        type="text" 
                        value={mathAnswers.q1}
                        onChange={(e) => setMathAnswers({...mathAnswers, q1: e.target.value})}
                        className="w-8 h-8 bg-transparent border-b-2 border-[#3a2f24] text-center focus:outline-none" 
                      />
                      <span>S. = 4 S.</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#3a2f24]/10 pb-2">
                    <span>Pumpkin Pasty (x1)</span>
                    <div className="flex items-center gap-2">
                      <span>@ 3 S. = </span>
                      <input 
                        type="text" 
                        value={mathAnswers.q2}
                        onChange={(e) => setMathAnswers({...mathAnswers, q2: e.target.value})}
                        className="w-8 h-8 bg-transparent border-b-2 border-[#3a2f24] text-center focus:outline-none" 
                      />
                      <span>S.</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 font-bold text-2xl">
                    <span>TOTAL:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={mathAnswers.q3}
                        onChange={(e) => setMathAnswers({...mathAnswers, q3: e.target.value})}
                        className="w-12 h-10 bg-transparent border-b-2 border-[#3a2f24] text-center focus:outline-none" 
                      />
                      <span>Sickles</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                {error && <p className="text-destructive font-serif mb-4">The math does not align.</p>}
                <button
                  onClick={checkMath}
                  className="bg-primary text-primary-foreground px-12 py-4 rounded-xl font-display font-bold text-xl hover:bg-primary/90 transition-all box-glow"
                >
                  {isPending ? "Verifying..." : "Verify Record"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </GameLayout>
  );
}

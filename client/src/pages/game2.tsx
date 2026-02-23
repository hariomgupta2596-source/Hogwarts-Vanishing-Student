import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";

export function Game2() {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [error, setError] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const checkAnswers = () => {
    if (q1 === "2" && q2 === "3" && q3 === "7") {
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

  const isComplete = q1.length > 0 && q2.length > 0 && q3.length > 0;

  return (
    <GameLayout title="The Torn Receipt">
      <div className="flex-1 flex flex-col items-center justify-center mt-8">
        
        <p className="font-serif text-muted-foreground max-w-lg text-center mb-12 text-lg">
          A receipt from The Three Broomsticks was found torn. Mathematical consistency is required to reveal the missing data.
        </p>

        <motion.div 
          initial={{ rotate: -2, scale: 0.95 }}
          animate={{ rotate: 0, scale: 1 }}
          className="bg-[#f4e4bc] text-[#3a2f24] p-10 rounded-sm shadow-2xl max-w-md w-full relative overflow-hidden"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' }}
        >
          {/* Jagged top edge simulation */}
          <div className="absolute top-0 left-0 w-full h-4 bg-background/80 blur-[2px]" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }} />

          <h2 className="font-display text-2xl text-center mb-8 border-b-2 border-[#3a2f24]/30 pb-4">Three Broomsticks</h2>
          
          <div className="space-y-6 font-serif text-xl">
            <div className="flex justify-between items-center border-b border-[#3a2f24]/10 pb-2">
              <span>Butterbeer (x2)</span>
              <div className="flex items-center gap-2">
                <span>@</span>
                <input 
                  type="text" 
                  maxLength={1}
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="w-8 h-8 bg-transparent border-b-2 border-[#3a2f24] text-center focus:outline-none focus:bg-white/30" 
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
                  maxLength={1}
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="w-8 h-8 bg-transparent border-b-2 border-[#3a2f24] text-center focus:outline-none focus:bg-white/30" 
                />
                <span>S.</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 font-bold text-2xl">
              <span>TOTAL:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  maxLength={2}
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  className="w-12 h-10 bg-transparent border-b-2 border-[#3a2f24] text-center focus:outline-none focus:bg-white/30" 
                />
                <span>Sickles</span>
              </div>
            </div>
          </div>

        </motion.div>

        <div className="mt-12 h-20">
          {error && <p className="text-destructive font-serif text-center mb-4">The math does not align. Check your figures.</p>}
          <button
            onClick={checkAnswers}
            disabled={!isComplete || isPending || error}
            className="bg-primary text-primary-foreground px-12 py-4 rounded-xl font-display font-bold text-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:transform-none hover:-translate-y-1 box-glow"
          >
            {isPending ? "Verifying..." : "Verify Record"}
          </button>
        </div>

      </div>
    </GameLayout>
  );
}

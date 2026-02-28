import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import entryBg from "@assets/Entry_Background_1772032172890.png";

const ANOMALIES = [
  { id: 1, top: "25%", left: "45%", name: "Floating Quill" },
  { id: 2, top: "65%", left: "20%", name: "Hidden Rune" },
  { id: 3, top: "15%", left: "75%", name: "Silver Chalice" },
];

export function Game2() {
  const [found, setFound] = useState<number[]>([]);
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const handlePointClick = (id: number) => {
    if (!found.includes(id)) {
      setFound([...found, id]);
    }
  };

  const isComplete = found.length === ANOMALIES.length;

  const handleFinish = () => {
    if (user && user.completedGames < 2) {
      updateProgress({ scoreAdded: 100, gameCompleted: 2 }, {
        onSuccess: () => setLocation("/hub")
      });
    } else {
      setLocation("/hub");
    }
  };

  return (
    <GameLayout title="The Hidden Evidence">
      <div className="flex-1 flex flex-col items-center justify-center mt-4">
        <p className="font-serif text-muted-foreground max-w-lg text-center mb-8 text-lg">
          The Three Broomsticks archives contain hidden magical traces. Locate all 3 anomalies in the scene to proceed.
        </p>

        <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border-4 border-primary/30 box-glow shadow-2xl bg-black">
          <img 
            src={entryBg} 
            alt="Investigation Scene" 
            className="w-full h-full object-cover opacity-80"
          />
          
          {ANOMALIES.map((anomaly) => {
            const isFound = found.includes(anomaly.id);
            return (
              <button
                key={anomaly.id}
                onClick={() => handlePointClick(anomaly.id)}
                className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                  isFound 
                    ? "bg-primary/40 border-2 border-primary scale-125" 
                    : "bg-transparent hover:bg-primary/10"
                }`}
                style={{ top: anomaly.top, left: anomaly.left }}
              >
                {isFound && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full box-glow" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {ANOMALIES.map((a) => (
              <div 
                key={a.id}
                className={`px-4 py-2 rounded-full border text-xs font-serif uppercase tracking-widest transition-all ${
                  found.includes(a.id) ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground"
                }`}
              >
                {a.name}
              </div>
            ))}
          </div>

          <button
            onClick={handleFinish}
            disabled={!isComplete || isPending}
            className="mt-4 bg-primary text-primary-foreground px-12 py-4 rounded-xl font-display font-bold text-xl hover:bg-primary/90 transition-all disabled:opacity-50 hover:-translate-y-1 box-glow-strong"
          >
            {isPending ? "Recording Evidence..." : isComplete ? "Secure Evidence" : `Found ${found.length}/3`}
          </button>
        </div>
      </div>
    </GameLayout>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";

const EVENTS = [
  { id: 1, time: "08:00 AM", text: "Student spotted in the Great Hall eating breakfast." },
  { id: 2, time: "09:30 AM", text: "Student attended Charms class and cast a perfect levitation charm." },
  { id: 3, time: "09:30 AM", text: "Student was seen purchasing Sugar Quills in Hogsmeade." }, // The paradox
  { id: 4, time: "11:00 AM", text: "Student was reprimanded for wandering the 3rd floor corridor." },
];

export function Game3() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    if (id === 3) {
      // Correct!
      if (user && user.completedGames < 3) {
        updateProgress({ scoreAdded: 150, gameCompleted: 3 }, {
          onSuccess: () => setLocation("/hub")
        });
      } else {
        setLocation("/hub");
      }
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setSelectedId(null);
      }, 1500);
    }
  };

  return (
    <GameLayout title="The Pensieve Paradox">
      <div className="max-w-3xl mx-auto w-full mt-8">
        <p className="font-serif text-muted-foreground text-center mb-12 text-lg">
          Memories are fragile. One of these events contradicts the timeline and proves memory modification. Identify the impossible event.
        </p>

        <div className="relative space-y-8 pl-8">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-primary/20 rounded-full" />

          {EVENTS.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 ${selectedId === evt.id ? (error ? 'bg-destructive border-destructive box-glow' : 'bg-primary border-primary box-glow') : 'bg-background border-primary/50'} transition-colors duration-300`} />
              
              <button
                onClick={() => handleSelect(evt.id)}
                disabled={isPending || error}
                className={`
                  w-full text-left p-6 rounded-xl border-2 transition-all duration-300
                  ${selectedId === evt.id 
                    ? (error ? 'border-destructive bg-destructive/10' : 'border-primary bg-primary/10 box-glow') 
                    : 'border-primary/10 bg-card hover:bg-card/80 hover:border-primary/50 hover:translate-x-2'
                  }
                `}
              >
                <div className="font-display text-primary/80 mb-2 text-sm tracking-widest">{evt.time}</div>
                <div className="font-serif text-xl text-foreground">{evt.text}</div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}

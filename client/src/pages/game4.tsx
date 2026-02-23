import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { Eye, Search } from "lucide-react";

const ROWS = [
  { id: 1, name: "Cedric D.", attendance: "Present", traces: "None", identity: "Verified" },
  { id: 2, name: "Unknown", attendance: "Present", traces: "High", identity: "Missing" }, // Target
  { id: 3, name: "Draco M.", attendance: "Absent", traces: "High", identity: "Verified" },
  { id: 4, name: "Luna L.", attendance: "Present", traces: "Low", identity: "Verified" },
];

export function Game4() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    if (id === 2) {
      if (user && user.completedGames < 4) {
        updateProgress({ scoreAdded: 200, gameCompleted: 4 }, {
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
    <GameLayout title="The Ministry Register">
      <div className="max-w-4xl mx-auto w-full mt-8">
        <div className="glass-panel p-6 rounded-xl mb-8 flex items-start gap-4 border-l-4 border-l-primary">
          <Search className="w-8 h-8 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-display text-lg text-primary mb-1">Directive:</h3>
            <p className="font-serif text-muted-foreground">
              Cross-reference the attendance logs with magical trace data. The vanished student must have been marked <span className="text-foreground font-bold">Present</span>, left <span className="text-foreground font-bold">High</span> magical traces, but their identity will be <span className="text-foreground font-bold">Missing</span>.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-primary/20">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-primary/20 bg-background/50 font-display text-primary/70 text-sm tracking-wider">
            <div>Subject</div>
            <div>Attendance</div>
            <div>Magical Traces</div>
            <div>Identity Status</div>
          </div>
          
          <div className="divide-y divide-primary/10">
            {ROWS.map((row) => (
              <motion.button
                key={row.id}
                disabled={isPending || error}
                onClick={() => handleSelect(row.id)}
                whileHover={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
                className={`
                  w-full grid grid-cols-4 gap-4 p-6 text-left transition-all font-serif text-lg
                  ${selectedId === row.id 
                    ? (error ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary box-glow border-y border-primary') 
                    : 'text-foreground hover:text-primary'}
                `}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 opacity-50" />
                  <span className={row.name === "Unknown" ? "blur-[3px] hover:blur-none transition-all" : ""}>{row.name}</span>
                </div>
                <div>{row.attendance}</div>
                <div>{row.traces}</div>
                <div>{row.identity}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-destructive font-serif text-center mt-6 text-lg"
          >
            Incorrect subject identified. The Ministry warns against false accusations.
          </motion.p>
        )}
      </div>
    </GameLayout>
  );
}

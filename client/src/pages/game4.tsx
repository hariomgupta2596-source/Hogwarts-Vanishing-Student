import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { Eye, Search, Swords, Trophy } from "lucide-react";

const ROWS = [
  { id: 1, name: "Cedric D.", attendance: "Present", traces: "None", identity: "Verified" },
  { id: 2, name: "Unknown", attendance: "Present", traces: "High", identity: "Missing" }, // Target
  { id: 3, name: "Draco M.", attendance: "Absent", traces: "High", identity: "Verified" },
  { id: 4, name: "Luna L.", attendance: "Present", traces: "Low", identity: "Verified" },
];

export function Game4() {
  const [isChessSolved, setIsChessSolved] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [chessError, setChessError] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const handleChessMove = (square: string) => {
    if (square === "h7") {
      setIsChessSolved(true);
    } else {
      setChessError(true);
      setTimeout(() => setChessError(false), 1000);
    }
  };

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
        <AnimatePresence mode="wait">
          {!isChessSolved ? (
            <motion.div
              key="chess-puzzle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="glass-panel p-6 rounded-xl mb-8 flex items-start gap-4 border-l-4 border-l-primary w-full">
                <Swords className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg text-primary mb-1">Wizard's Chess Security:</h3>
                  <p className="font-serif text-muted-foreground">
                    To access the classified Ministry Register, you must first bypass the guardian's defense. 
                    <span className="text-foreground font-bold ml-1 text-primary">White to move: Find the checkmate in one.</span>
                  </p>
                </div>
              </div>

              <div className="bg-background/40 p-4 rounded-xl border border-primary/20 box-glow mb-8">
                <div className="grid grid-cols-8 border-2 border-primary/40">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isDark = (row + col) % 2 === 1;
                    const colLabel = String.fromCharCode(97 + col);
                    const rowLabel = 8 - row;
                    const squareCode = `${colLabel}${rowLabel}`;

                    // Piece positions:
                    // Black King at h8 (row 0, col 7)
                    // White Bishop at f5 (row 3, col 5)
                    // White Queen at g6 (row 2, col 6)
                    let piece = null;
                    if (row === 0 && col === 7) piece = "♚";
                    if (row === 3 && col === 5) piece = "♗";
                    if (row === 2 && col === 6) piece = "♕";

                    return (
                      <button
                        key={squareCode}
                        onClick={() => handleChessMove(squareCode)}
                        className={`
                          w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-3xl md:text-4xl transition-all
                          ${isDark ? 'bg-primary/10' : 'bg-transparent'}
                          ${chessError && squareCode === "h7" ? "bg-destructive/20" : "hover:bg-primary/20"}
                        `}
                      >
                        <span className={piece === "♚" ? "text-foreground" : "text-primary text-glow-sm"}>
                          {piece}
                        </span>
                        {/* Interactive hint on target or piece */}
                        {piece === "♕" && <div className="absolute w-2 h-2 bg-primary rounded-full animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between font-display text-xs text-primary/50 px-2">
                  <span>A8</span>
                  <span>H8</span>
                </div>
              </div>
              
              {chessError && (
                <p className="text-destructive font-serif animate-bounce">That move does not lead to checkmate.</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="register-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 justify-center text-primary mb-4 animate-pulse">
                <Trophy className="w-6 h-6" />
                <span className="font-display text-xl tracking-widest">Access Granted</span>
              </div>

              <div className="glass-panel p-6 rounded-xl flex items-start gap-4 border-l-4 border-l-primary">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}

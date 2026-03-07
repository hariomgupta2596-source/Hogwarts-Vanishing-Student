import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { Eye, Search, Swords, Trophy, ChevronRight } from "lucide-react";
import trait1 from "@assets/student_Traits_1_1772644599719.png";
import trait2 from "@assets/student_Traits_2_1772644599720.png";
import trait3 from "@assets/student_Traits_3_1772644599720.png";
import trait4 from "@assets/student_Traits_4_1772644599721.png";
import videoFrame from "@assets/video-frame_1772644599722.webp";
import chessPuzzle1 from "@assets/chess-puzle-1_1772801394769.png";
import chessPuzzle2 from "@assets/chess-puzle-2_1772801411387.png";
import chessPuzzle3 from "@assets/chess-puzle-3_1772802579355.png";

const STAGES = [
  {
    id: "attendance",
    title: "Attendance Logs",
    puzzle: chessPuzzle1,
    solution: "Ra8",
    hint: "Checkmate in two: Start with the Rook to a8",
    evidence: {
      directive: "The vanished student must have been marked Present.",
      data: [
        { name: "Cedric D.", status: "Present", image: trait3 },
        { name: "Unknown", status: "Present", image: trait1 },
        { name: "Draco M.", status: "Absent", image: trait1 },
        { name: "Luna L.", status: "Present", image: trait4 },
      ]
    }
  },
  {
    id: "traces",
    title: "Magical Traces",
    puzzle: chessPuzzle2,
    solution: "Rc2",
    hint: "Checkmate in two: Force the king with Rook to c2",
    evidence: {
      directive: "The vanished student left High magical traces.",
      data: [
        { name: "Cedric D.", status: "None", image: trait3 },
        { name: "Unknown", status: "High", image: trait1 },
        { name: "Draco M.", status: "High", image: trait1 },
        { name: "Luna L.", status: "Low", image: trait4 },
      ]
    }
  },
  {
    id: "identity",
    title: "Identity Status",
    puzzle: chessPuzzle3,
    solution: "Qf7",
    hint: "Checkmate in two: Queen to f7 is the key",
    evidence: {
      directive: "The vanished student's identity will be Missing.",
      data: [
        { name: "Cedric D.", status: "Verified", image: trait3 },
        { name: "Unknown", status: "Missing", image: trait1 },
        { name: "Draco M.", status: "Verified", image: trait1 },
        { name: "Luna L.", status: "Verified", image: trait4 },
      ]
    }
  }
];

export function Game4() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [unlockedStages, setUnlockedStages] = useState<string[]>([]);
  const [chessInput, setChessInput] = useState("");
  const [chessError, setChessError] = useState(false);
  const [guess, setGuess] = useState("");
  const [guessError, setGuessError] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const currentStage = STAGES[currentStageIndex];
  const isUnlocked = unlockedStages.includes(currentStage.id);

  const handleChessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chessInput.trim().toLowerCase() === currentStage.solution.toLowerCase()) {
      setUnlockedStages([...unlockedStages, currentStage.id]);
      setChessInput("");
      setChessError(false);
    } else {
      setChessError(true);
      setTimeout(() => setChessError(false), 1500);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === "unknown") {
      if (user && user.completedGames < 4) {
        updateProgress({ scoreAdded: 200, gameCompleted: 4 }, {
          onSuccess: () => setLocation("/hub")
        });
      } else {
        setLocation("/hub");
      }
    } else {
      setGuessError(true);
      setTimeout(() => setGuessError(false), 2000);
    }
  };

  return (
    <GameLayout title="The Ministry Register">
      <div className="max-w-4xl mx-auto w-full mt-8">
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {STAGES.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setCurrentStageIndex(idx)}
              className={`px-4 py-2 rounded-lg font-display transition-all ${
                currentStageIndex === idx 
                  ? "bg-primary text-primary-foreground box-glow" 
                  : "bg-background/40 border border-primary/20 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {stage.title}
              {unlockedStages.includes(stage.id) && " ✓"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key={`puzzle-${currentStage.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="glass-panel p-6 rounded-xl mb-8 flex items-start gap-4 border-l-4 border-l-primary w-full">
                <Swords className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg text-primary mb-1">Security Protocol: Stage {currentStageIndex + 1}</h3>
                  <p className="font-serif text-muted-foreground">
                    Bypass the Chess Security to unlock the <strong>{currentStage.title}</strong> evidence.
                    <span className="text-foreground font-bold ml-1 text-primary">Checkmate in two moves.</span>
                  </p>
                </div>
              </div>

              <div className="relative p-4 mb-8 max-w-2xl w-full">
                <img src={videoFrame} className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10" alt="" />
                <div className="relative z-0 rounded-lg overflow-hidden border-2 border-primary/40">
                  <img src={currentStage.puzzle} alt="Chess Puzzle" className="w-full h-auto" />
                </div>
              </div>

              <form onSubmit={handleChessSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={chessInput}
                    onChange={(e) => setChessInput(e.target.value)}
                    placeholder="Enter winning move (e.g. Ra8)"
                    className="flex-1 bg-background/50 border-2 border-primary/30 rounded-xl px-4 py-3 font-mono text-primary focus:border-primary focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-display font-bold hover:bg-primary/90 transition-all box-glow"
                  >
                    Unlock
                  </button>
                </div>
                {chessError && (
                  <p className="text-destructive font-serif animate-bounce">Incorrect move sequence.</p>
                )}
                <p className="text-xs text-muted-foreground italic">Hint: {currentStage.hint}</p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key={`evidence-${currentStage.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="glass-panel p-6 rounded-xl flex items-start gap-4 border-l-4 border-l-primary">
                <Search className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg text-primary mb-1">{currentStage.title} Evidence:</h3>
                  <p className="font-serif text-muted-foreground">{currentStage.evidence.directive}</p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-primary/20">
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-primary/20 bg-background/50 font-display text-primary/70 text-sm tracking-wider uppercase">
                  <div>Subject</div>
                  <div>Status</div>
                </div>
                
                <div className="divide-y divide-primary/10">
                  {currentStage.evidence.data.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-4 p-6 transition-all font-serif text-lg">
                      <div className="flex items-center gap-4">
                        <img src={row.image} className="w-10 h-14 object-cover rounded border border-primary/20 shadow-sm" alt="" />
                        <span className={row.name === "Unknown" ? "blur-[3px] hover:blur-none transition-all cursor-help" : ""}>{row.name}</span>
                      </div>
                      <div className="flex items-center text-primary/90">{row.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {unlockedStages.length === STAGES.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex flex-col items-center gap-6 p-8 glass-panel border-primary/40 box-glow"
                >
                  <div className="text-center space-y-2">
                    <h3 className="font-display text-2xl text-primary">Identify the Subject</h3>
                    <p className="font-serif text-muted-foreground">Review all evidence and name the vanished student.</p>
                  </div>
                  <form onSubmit={handleFinalSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Type missing student name..."
                        className="flex-1 bg-background/50 border-2 border-primary/30 rounded-xl px-4 py-3 font-serif text-lg text-primary focus:border-primary focus:outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display font-bold hover:bg-primary/90 transition-all box-glow flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPending ? "Processing..." : <>Identify <ChevronRight className="w-5 h-5" /></>}
                      </button>
                    </div>
                    {guessError && (
                      <p className="text-destructive font-serif animate-bounce">The archives reject this identity.</p>
                    )}
                  </form>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}

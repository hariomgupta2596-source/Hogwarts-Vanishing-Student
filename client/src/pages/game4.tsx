import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { Eye, Search, Swords, Trophy, ChevronRight, RotateCcw } from "lucide-react";
import trait1 from "@assets/student_Traits_1.png";
import trait2 from "@assets/student_Traits_2.png";
import trait3 from "@assets/student_Traits_3.png";
import trait4 from "@assets/student_Traits_4.png";


const STAGES = [
  {
    id: "attendance",
    title: "Attendance Logs",
    initialFen: "k1b5/p7/1P6/8/8/2B5/6K1/R7 w - - 0 1",
    solution: "Ra8",
    hint: "Move the Rook to a7 for checkmate",
    evidence: {
      directive: "The vanished student must have been marked Present.",
      data: [
        { name: "Cedric D.", status: "Present", image: trait3 },
        { name: "Arthur V.", status: "Present", image: trait1 },
        { name: "Draco M.", status: "Absent", image: trait2 },
        { name: "Luna L.", status: "Present", image: trait4 },
      ]
    }
  },
  {
    id: "traces",
    title: "Magical Traces",
    initialFen: "8/8/2Q5/3B4/1K6/8/Nk6/2R5 w - - 0 1",
    solution: "Rc2",
    hint: "Move the Rook to c2 for checkmate",
    evidence: {
      directive: "The vanished student left High magical traces.",
      data: [
        { name: "Cedric D.", status: "None", image: trait3 },
        { name: "Arthur V.", status: "High", image: trait1 },
        { name: "Draco M.", status: "High", image: trait2 },
        { name: "Luna L.", status: "Low", image: trait4 },
      ]
    }
  },
  {
    id: "identity",
    title: "Identity Status",
    initialFen: "r4r2/pQ3ppp/2np4/2bk4/5P2/6P1/PPP5/R1B1KB1q w - - 0 1",
    solution: "Qf7",
    hint: "Move the Queen to f7 for checkmate",
    evidence: {
      directive: "The vanished student's identity will be Missing.",
      data: [
        { name: "Cedric D.", status: "Verified", image: trait3 },
        { name: "Arthur V.", status: "Missing", image: trait1 },
        { name: "Draco M.", status: "Verified", image: trait2 },
        { name: "Luna L.", status: "Verified", image: trait4 },
      ]
    }
  }
];

export function Game4() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [unlockedStages, setUnlockedStages] = useState<string[]>([]);
  const [gameState, setGameState] = useState<{ [key: string]: Chess }>({});
  const [moveCount, setMoveCount] = useState<{ [key: string]: number }>({});
  const [guess, setGuess] = useState("");
  const [guessError, setGuessError] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const currentStage = STAGES[currentStageIndex];
  const isUnlocked = unlockedStages.includes(currentStage.id);

  // Initialize chess game for current stage
  useEffect(() => {
    if (!gameState[currentStage.id]) {
      // Ensure we only create a new instance if initialFen is valid
      try {
        const initialGame = new Chess(currentStage.initialFen);
      setGameState(prev => ({
        ...prev,
        [currentStage.id]: initialGame
      }));
    setMoveCount(prev => ({
          ...prev,
          [currentStage.id]: 0
        }));
      }
      catch (e) {
          console.error("Invalid FEN detected in STAGES:", currentStage.initialFen);
        }
      }
    }, [currentStageIndex, currentStage.id]);

  const currentGame = gameState[currentStage.id];
  const currentMoves = moveCount[currentStage.id] || 0;
  const resetGame = () => {
    const newGame = new Chess(currentStage.initialFen);
    setGameState(prev => ({
      ...prev,
      [currentStage.id]: newGame
    }));
    setMoveCount(prev => ({
      ...prev,
      [currentStage.id]: 0
    }));
  };

  const makeMove = (source: string, target: string): boolean => {
    if (!currentGame) return false;
    try {
    const gameCopy = new Chess(currentGame.fen());
    
      const result = gameCopy.move({ 
        from: source, 
        to: target, 
        promotion: "q" // always promote to queen for simplicity
      });
    
    if (!result) return false;
    
    // Check if this move leads to checkmate (restrict checkmate path)
    if (gameCopy.isCheckmate()) {
        // Checkmate in white's first move - unlock immediately
        setUnlockedStages([...unlockedStages, currentStage.id]);
        const newGameState = { ...gameState };
        newGameState[currentStage.id] = gameCopy;
        setGameState(newGameState);
        setMoveCount(prev => ({
          ...prev,
          [currentStage.id]: (prev[currentStage.id] || 0) + 1
        }));
        return true;
      }
      // Update board

      
    const newGameState = { ...gameState };
    newGameState[currentStage.id] = gameCopy;
    setGameState(newGameState);

    setMoveCount(prev => ({
        ...prev,
        [currentStage.id]: (prev[currentStage.id] || 0) + 1
    }));

    // Auto-move for black
      if (!gameCopy.isGameOver()) {
          setTimeout(() => {
            const gameCopy2 = new Chess(gameCopy.fen());
            const moves = gameCopy2.moves();
            if (moves.length > 0) {
              // AI makes a random move
              gameCopy2.move(moves[Math.floor(Math.random() * moves.length)]);
              const finalState = { ...gameState };
              finalState[currentStage.id] = gameCopy2;
              setGameState(finalState);
              setMoveCount(prev => ({
                ...prev,
                [currentStage.id]: (prev[currentStage.id] || 0) + 1
              }));
            }
          }, 500);
        }

        return true;
      }catch (error) {
        // Catch-all for any unexpected chess.js logic errors
        console.error("Chess move error:", error);
        return false;
      }
    };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === "arthur v.") {
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
                    Bypass the Wizard's Chess defense to unlock the <strong>{currentStage.title}</strong> evidence.
                    <span className="text-foreground font-bold ml-1 text-primary">Checkmate in two moves. White to move.</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                {currentGame && (
                  <Chessboard
                    position={currentGame.fen()}
                    onPieceDrop={(source, target) => makeMove(source, target)}
                    boardWidth={380}
                    customBoardStyle={{
                      borderRadius: "10px",
                      boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)"
                    }}
                    customDarkSquareStyle={{ backgroundColor: "#3b2f14" }}
                    customLightSquareStyle={{ backgroundColor: "#e5c76b" }}
                  />
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground italic">{currentStage.hint}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-4 py-2 bg-background/50 border border-primary/30 rounded-lg hover:border-primary/60 transition-all text-primary font-serif text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Board
                </button>
              </div>
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
                        <span className={row.name === "Arthur V." ? "blur-[3px] hover:blur-none transition-all cursor-help" : ""}>{row.name}</span>
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

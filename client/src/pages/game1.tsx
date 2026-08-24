import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { HintButton } from "@/components/HintButton";
import { ScoreToast } from "@/components/ScoreToast";
import { soundManager } from "@/lib/audio";
import { HelpCircle } from "lucide-react";
import trait1 from "@assets/student_Traits_1.png";
import trait2 from "@assets/student_Traits_2.png";
import trait3 from "@assets/student_Traits_3.png";
import trait4 from "@assets/student_Traits_4.png";

const STUDENTS = [
  { id: 1, traits: trait1, correctHouse: "Slytherin" },
  { id: 2, traits: trait2, correctHouse: "Gryffindor" },
  { id: 3, traits: trait3, correctHouse: "Hufflepuff" },
  { id: 4, traits: trait4, correctHouse: "Ravenclaw" },
];

const HOUSES = [
  { name: "Gryffindor", color: "border-red-500/50 hover:border-red-500 shadow-red-500/20 text-red-400" },
  { name: "Slytherin", color: "border-green-500/50 hover:border-green-500 shadow-green-500/20 text-green-400" },
  { name: "Ravenclaw", color: "border-blue-500/50 hover:border-blue-500 shadow-blue-500/20 text-blue-400" },
  { name: "Hufflepuff", color: "border-yellow-500/50 hover:border-yellow-500 shadow-yellow-500/20 text-yellow-400" },
];

export function Game1() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [error, setError] = useState(false);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);

  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);
  const isMuted = useGameStore(state => state.isMuted);

  const handleSelectStudent = (id: number) => {
    if (!isMuted) soundManager.playClick();
    setSelectedStudent(id);
  };

  const handleHouseClick = (house: string) => {
    if (selectedStudent === null) return;
    if (!isMuted) soundManager.playClick();
    setAssignments(prev => ({ ...prev, [selectedStudent]: house }));
    setSelectedStudent(null);
    setError(false);
  };

  const checkAnswers = () => {
    const isCorrect = STUDENTS.every(s => assignments[s.id] === s.correctHouse);
    if (isCorrect) {
      if (!isMuted) soundManager.playSuccess();
      if (user && user.completedGames < 1) {
        setScoreDelta(100);
        updateProgress({ scoreAdded: 100, gameCompleted: 1 }, {
          onSuccess: () => setTimeout(() => setLocation("/hub"), 1200)
        });
      } else {
        setLocation("/hub");
      }
    } else {
      if (!isMuted) soundManager.playError();
      setError(true);
      setTimeout(() => {
        setAssignments({});
        setError(false);
      }, 1500);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key)) {
        const num = parseInt(e.key);
        if (selectedStudent === null) {
          handleSelectStudent(num);
        } else {
          const house = HOUSES[num - 1].name;
          handleHouseClick(house);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStudent]);

  return (
    <GameLayout title="The Sorting Hat Memory">
      <ScoreToast delta={scoreDelta} message="Trial 1 Passed!" />

      <div className="max-w-4xl mx-auto w-full grid md:grid-cols-2 gap-12 mt-8 relative">
        <div className="absolute top-0 right-0 z-20 flex items-center gap-4">
          <HintButton
            gameId={1}
            freeHint="Inspect the specific color themes and traditional traits hidden in each parchment fragment."
            deepHint="Profile 1 belongs to Slytherin, Profile 2 to Gryffindor, Profile 3 to Hufflepuff, and Profile 4 to Ravenclaw."
          />
          <Link href="/guide" className="text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif text-sm">
            <HelpCircle className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Left Column: Students */}
        <div className="space-y-4">
          <h2 className="font-display text-xl text-primary/80 mb-6">Select a profile fragment (Keys 1-4):</h2>
          <div className="grid grid-cols-2 gap-4">
            {STUDENTS.map((student) => (
              <motion.div
                key={student.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectStudent(student.id); }}
                onClick={() => handleSelectStudent(student.id)}
                className={`flex-1 flex flex-col items-center justify-center 
                  p-4 rounded-xl cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${selectedStudent === student.id ? 'border-2 border-primary bg-primary/10 box-glow' : 'border-2 border-primary/20 bg-card hover:bg-card/80'}
                  ${assignments[student.id] ? 'opacity-50 grayscale' : ''}
                `}
              >
                <img 
                  src={student.traits} 
                  alt={`Student Profile Fragment ${student.id}`} 
                  className="w-full h-auto rounded-lg"
                />

                {assignments[student.id] && (
                  <div className="mt-2 text-xs font-display text-primary/70 text-center">Assigned to: {assignments[student.id]}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Houses */}
        <div className="flex flex-col">
          <h2 className="font-display text-xl text-primary/80 mb-6">Assign to a house:</h2>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {HOUSES.map((house, idx) => (
              <motion.div
                key={house.name}
                whileHover={{ scale: 1.05 }}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHouseClick(house.name); }}
                onClick={() => handleHouseClick(house.name)}
                className={`
                  flex items-center justify-center p-6 rounded-xl border-2 cursor-pointer
                  transition-all duration-300 bg-background/50 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${selectedStudent ? house.color + ' animate-pulse' : 'border-primary/10 opacity-50'}
                `}
              >
                <span className={`font-display text-xl ${house.color.split(' ')[3]}`}>{idx + 1}. {house.name}</span>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {Object.keys(assignments).length === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                {error ? (
                  <p className="text-destructive font-serif text-lg animate-bounce mb-4">"The Hat disagrees... try again."</p>
                ) : null}
                <button
                  onClick={checkAnswers}
                  disabled={isPending || error}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-display font-bold text-xl hover:bg-primary/90 transition-colors disabled:opacity-50 box-glow focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isPending ? "Confirming..." : "Finalize Selection"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameLayout>
  );
}

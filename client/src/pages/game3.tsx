import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";

const MEMORIES = [
  { 
    id: 1, 
    title: "Morning Arrival", 
    desc: "The student was seen entering the Great Hall at 08:00 AM for breakfast.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    isParadox: false 
  },
  { 
    id: 2, 
    title: "Charms Instruction", 
    desc: "Participating in Professor Flitwick's class. The quill was levitated perfectly.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    isParadox: false 
  },
  { 
    id: 3, 
    title: "The Hogsmeade Sighting", 
    desc: "A shopkeeper at Honeydukes claims the student was there at 09:30 AM, yet the castle log says they were in the Library.",
    image: "https://images.unsplash.com/photo-1519074063912-ad25b57b6d17?auto=format&fit=crop&q=80&w=800",
    isParadox: true 
  },
  { 
    id: 4, 
    title: "Library Research", 
    desc: "A stack of books on the vanishing cabinet was found at the student's regular desk.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    isParadox: false 
  },
];

export function Game3() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { mutate: updateProgress, isPending } = useUpdateProgress();
  const [, setLocation] = useLocation();
  const user = useGameStore(state => state.user);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % MEMORIES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + MEMORIES.length) % MEMORIES.length);

  const handleIdentify = () => {
    const memory = MEMORIES[currentIndex];
    setSelectedId(memory.id);
    
    if (memory.isParadox) {
      setSuccess(true);
      if (user && user.completedGames < 3) {
        updateProgress({ scoreAdded: 150, gameCompleted: 3 }, {
          onSuccess: () => {
            setTimeout(() => setLocation("/hub"), 2000);
          }
        });
      } else {
        setTimeout(() => setLocation("/hub"), 2000);
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
      <div className="max-w-4xl mx-auto w-full mt-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <p className="font-serif text-muted-foreground text-lg italic">
            "Memories can be altered, but logic remains firm. Dive into the Pensieve and find the memory that does not belong."
          </p>
        </div>

        <div className="relative w-full aspect-video md:aspect-[21/9] glass-panel rounded-3xl overflow-hidden box-glow border-2 border-primary/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img 
                src={MEMORIES[currentIndex].image} 
                alt={MEMORIES[currentIndex].title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-center">
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-display text-3xl text-primary text-glow mb-4"
                >
                  {MEMORIES[currentIndex].title}
                </motion.h3>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-serif text-lg text-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  {MEMORIES[currentIndex].desc}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/40 border border-primary/20 hover:bg-primary/20 transition-all z-20"
          >
            <ChevronLeft className="w-8 h-8 text-primary" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/40 border border-primary/20 hover:bg-primary/20 transition-all z-20"
          >
            <ChevronRight className="w-8 h-8 text-primary" />
          </button>

          {/* Overlays */}
          {success && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="bg-background/90 p-8 rounded-2xl border-2 border-primary box-glow flex flex-col items-center gap-4"
              >
                <CheckCircle2 className="w-16 h-16 text-primary" />
                <h4 className="font-display text-2xl text-primary">Paradox Identified</h4>
                <p className="font-serif text-muted-foreground">The memory traces are fraudulent. Recording evidence...</p>
              </motion.div>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {MEMORIES.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-primary box-glow" : "w-3 bg-primary/20"}`} 
              />
            ))}
          </div>

          <button
            onClick={handleIdentify}
            disabled={isPending || error || success}
            className={`
              relative group flex items-center gap-3 px-12 py-5 rounded-2xl font-display font-bold text-xl transition-all
              ${error ? 'bg-destructive text-destructive-foreground animate-shake' : 'bg-primary text-primary-foreground hover:scale-105 box-glow-strong'}
              disabled:opacity-50
            `}
          >
            {error ? (
              <>
                <AlertTriangle className="w-6 h-6" />
                <span>Stable Memory</span>
              </>
            ) : (
              <>
                <span>Identify Paradox</span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <AlertTriangle className="w-6 h-6 text-primary-foreground/80" />
                </motion.div>
              </>
            )}
          </button>
        </div>
      </div>
    </GameLayout>
  );
}

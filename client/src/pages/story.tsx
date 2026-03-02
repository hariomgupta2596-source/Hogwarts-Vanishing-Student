import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Shield } from "lucide-react";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import entryBg from "@assets/Entry_Background_1772032172890.png";

const STORY_STEPS = [
  {
    title: "A Glitch in the Magic",
    content: "At midnight, deep inside Hogwarts Castle, the Enchanted Student Registry begins to malfunction. A warning echoes through the halls: ⚠️ 'Student detected without identity.' ⚠️ 'Classes attended. Records missing.'",
    icon: Sparkles
  },
  {
    title: "The Paradox",
    content: "A student has appeared in class and left traces in Hogsmeade, breaking time consistency. Yet officially... they do not exist.",
    icon: BookOpen
  },
  {
    title: "The Summons",
    content: "Fearing misuse of magic or a flaw in the system, Professor McGonagall summons a select group of students — YOU. You are appointed as Junior Investigators for the Department of Mysteries.",
    icon: Shield
  },
  {
    title: "The Mission",
    content: "Use logic, deduction, and system-level thinking to uncover the Invisible Student before the records erase themselves forever.",
    icon: ArrowRight
  }
];

export function Story() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (step < STORY_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setLocation("/hub");
    }
  };

  const currentStory = STORY_STEPS[step];
  const Icon = currentStory.icon;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(${entryBg})` }}
    >
      <FloatingOrbs />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="glass-panel max-w-2xl w-full p-8 md:p-12 rounded-2xl relative z-10 box-glow flex flex-col items-center text-center"
        >
          <div className="bg-background/50 p-4 rounded-full border border-primary/20 mb-8 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Icon className="w-10 h-10 text-primary animate-pulse" />
          </div>

          <h2 className="font-display text-primary/70 text-sm tracking-[0.3em] uppercase mb-4">{currentStory.title}</h2>
          
          <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-12 italic">
            "{currentStory.content}"
          </p>

          <button
            onClick={handleNext}
            className="group relative px-8 py-3 overflow-hidden rounded-xl bg-primary/10 border border-primary/30 hover:border-primary transition-all duration-300"
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center gap-2">
              <span className="font-display text-primary tracking-widest uppercase">
                {step === STORY_STEPS.length - 1 ? "Begin Investigation" : "Continue"}
              </span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="mt-8 flex gap-2">
            {STORY_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === step ? "w-8 bg-primary" : "w-2 bg-primary/20"}`} 
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

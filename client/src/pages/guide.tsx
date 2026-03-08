import { PageWrapper } from "@/components/PageWrapper";
import { Link } from "wouter";
import { ArrowLeft, Book, Target, Brain, Search, Swords } from "lucide-react";
import { motion } from "framer-motion";
import bgImage from "@assets/bgl1.png";

const LEVELS = [
  {
    level: "Level 1",
    title: "Sorting the Student",
    icon: Brain,
    goal: "Match the correct personality profile to the correct Hogwarts house.",
    steps: [
      "Read each profile fragment carefully.",
      "Think about which Hogwarts house best matches those personality traits.",
      "Select the correct house button below.",
      "Repeat this process until all profiles are correctly assigned."
    ]
  },
  {
    level: "Level 2",
    title: "Code Breaker and Fix the Receipt",
    icon: Target,
    goal: "Discover the correct 3-digit secret code by analyzing the clues. Complete the receipt using math and logic.",
    steps: [
      "Look at each number combination and the hint written beside it.",
      "Use logic to figure out which digits belong in the code.",
      "Pay attention to the clues and eliminate impossible numbers step by step.",
      "Enter the correct 3-digit code in the boxes.",
      "Look carefully at the receipt and check each item's price.",
      "Calculate the correct cost for each item (quantity × price).",
      "Add the results together to find the receipt total."
    ]
  },
  {
    level: "Level 3",
    title: "The Pensieve Paradox",
    icon: Search,
    goal: "Find the memory that does not belong.",
    steps: [
      "Read the memories shown in the Pensieve carefully.",
      "Use the left and right arrows to view all memories.",
      "Look for a memory that contains a mistake or logical inconsistency.",
      "Compare the times, locations, and events in each memory.",
      "When you find the incorrect memory, select Identify Paradox.",
      "Think logically about the timeline."
    ]
  },
  {
    level: "Level 4",
    title: "Wizard's Chess Security & Identify the Vanishing Student",
    icon: Swords,
    goal: "Deliver checkmate in two moves to bypass the magical chess defense for each clue. Find the student who matches the investigation directive.",
    steps: [
      "Look carefully at the chessboard and the positions of the pieces.",
      "It is White's turn to move.",
      "Think about how to attack the Black King.",
      "Find the two moves that puts the king in checkmate.",
      "Read the Directive carefully at the top.",
      "The vanished student must meet all three conditions:",
      "  • Marked Present in attendance",
      "  • Left High magical traces",
      "  • Identity status marked as Missing"
    ]
  }
];

export function Guide() {
  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(${bgImage})` }}
    >
    <PageWrapper requireAuth={false}>
      
      <header className="flex flex-col items-center mb-12 relative z-10">
        <Link href="/hub" className="absolute left-0 top-2 text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
        <Book className="w-16 h-16 text-primary mb-4 text-glow" />
        <h1 className="font-display text-4xl text-primary text-glow">How to Play</h1>
        <p className="font-serif text-muted-foreground mt-2">Guide to solving the Mystery of the Vanishing Student</p>
      </header>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="space-y-8">
          {LEVELS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-primary/20"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs text-primary/60 font-display uppercase tracking-widest">{item.level}</span>
                    <h2 className="font-display text-2xl text-primary mb-2">{item.title}</h2>
                    <p className="font-serif text-muted-foreground text-sm">
                      <span className="font-bold text-foreground">Goal:</span> {item.goal}
                    </p>
                  </div>
                </div>

                <div className="ml-16 space-y-2">
                  <h3 className="font-display text-sm text-primary/80 uppercase tracking-wider mb-3">What to Do</h3>
                  <ul className="space-y-2">
                    {item.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 font-serif text-sm text-muted-foreground">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-panel p-8 rounded-2xl border border-primary/40 text-center box-glow"
        >
          <h3 className="font-display text-2xl text-primary mb-3">Ready to Investigate?</h3>
          <p className="font-serif text-muted-foreground mb-6">
            Use your logic, deduction skills, and careful observation to uncover the truth about the vanishing student.
          </p>
          <Link href="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display font-bold hover:bg-primary/90 transition-colors inline-block box-glow">
            Begin Investigation
          </Link>
        </motion.div>
      </div>
    
    </PageWrapper>
    </div>
  );
}

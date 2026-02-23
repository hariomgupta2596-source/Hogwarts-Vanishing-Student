import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useFinalChoice } from "@/hooks/use-game";
import { Shield, Eye, Trash2 } from "lucide-react";

import { useGameStore } from "@/lib/store";

export function Verdict() {
  const { mutate: makeChoice, isPending } = useFinalChoice();
  const logout = useGameStore(state => state.logout);
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<"seal" | "expose" | "erase" | null>(null);

  const handleChoice = (choice: "seal" | "expose" | "erase") => {
    setSelected(choice);
    makeChoice({ choice }, {
      onSuccess: () => {
        setTimeout(() => {
          logout();
          setLocation("/login");
        }, 3000);
      }
    });
  };

  const choices = [
    { 
      id: "seal" as const, 
      title: "Seal the Records", 
      desc: "Protect the timeline. Lock the files deep within the Department of Mysteries.",
      icon: Shield,
      color: "text-blue-400",
      border: "border-blue-400/50 hover:border-blue-400 bg-blue-900/10"
    },
    { 
      id: "expose" as const, 
      title: "Expose the Truth", 
      desc: "Publish your findings to the Daily Prophet. Let the wizarding world know what happened.",
      icon: Eye,
      color: "text-primary",
      border: "border-primary/50 hover:border-primary bg-primary/10 box-glow"
    },
    { 
      id: "erase" as const, 
      title: "Erase the Investigation", 
      desc: "Obliviate your own memory and burn the files. It's too dangerous to know.",
      icon: Trash2,
      color: "text-red-400",
      border: "border-red-400/50 hover:border-red-400 bg-red-900/10"
    }
  ];

  return (
    <GameLayout title="The Final Verdict">
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full mt-4">
        
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 text-center leading-tight">
          The truth has been uncovered. <br/>
          <span className="text-primary text-glow">What is your decree?</span>
        </h2>
        
        <p className="font-serif text-muted-foreground text-center mb-12 text-lg max-w-2xl">
          Your investigation proves the student existed. Their erasure was intentional. As the Chief Investigator, your final action will determine the fate of this knowledge forever.
        </p>

        <div className="grid md:grid-cols-3 gap-6 w-full">
          {choices.map((choice, idx) => {
            const Icon = choice.icon;
            const isSelected = selected === choice.id;
            const isDisabled = isPending || (selected !== null && !isSelected);

            return (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                onClick={() => handleChoice(choice.id)}
                disabled={isDisabled}
                className={`
                  flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all duration-500
                  ${choice.border}
                  ${isSelected ? 'scale-105 opacity-100 ring-4 ring-offset-4 ring-offset-background ring-' + choice.color.split('-')[1] : ''}
                  ${isDisabled && !isSelected ? 'opacity-30 grayscale scale-95' : 'hover:-translate-y-2'}
                `}
              >
                <div className={`p-4 rounded-full bg-background/50 mb-6 ${choice.color}`}>
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className={`font-display text-2xl mb-4 ${choice.color}`}>{choice.title}</h3>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  {choice.desc}
                </p>
              </motion.button>
            )
          })}
        </div>
      </div>
    </GameLayout>
  );
}

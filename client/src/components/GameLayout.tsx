import { Link, useLocation } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { PageWrapper } from "./PageWrapper";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function GameLayout({ children, title }: GameLayoutProps) {
  const user = useGameStore(state => state.user);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <PageWrapper>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-primary/20 pb-6 relative z-10">
        <Link href="/hub" className="text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> 
          Return to Map
        </Link>
        
        <h1 className="font-display text-2xl md:text-3xl text-primary text-glow flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary/50" />
          {title}
          <Sparkles className="w-6 h-6 text-primary/50" />
        </h1>
        
        <div className="glass-panel px-6 py-2 rounded-full font-serif">
          <span className="text-muted-foreground">Score: </span>
          <span className="text-primary font-bold text-lg text-glow-sm">{user?.score || 0}</span>
        </div>
      </header>
      
      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 flex flex-col relative z-10"
      >
        {children}
      </motion.main>
    </PageWrapper>
  );
}

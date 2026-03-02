import { Link, useLocation } from "wouter";
import { ArrowLeft, Sparkles, LogOut, Clock, Shirt } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { PageWrapper } from "./PageWrapper";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import entryBg from "@assets/Entry_Background_1772032172890.png";

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function GameLayout({ children, title }: GameLayoutProps) {
  const user = useGameStore(state => state.user);
  const logout = useGameStore(state => state.logout);
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    if (user.startTime) {
      const start = new Date(user.startTime).getTime();
      const limit = 30 * 60 * 1000; // 30 min
      
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = now - start;
        const remaining = Math.max(0, limit - elapsed);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(timer);
          setLocation("/verdict");
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [user, setLocation]);

  if (!user) return null;

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(${entryBg})` }}
    >
      <PageWrapper>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-primary/20 pb-6 relative z-10">
          <div className="flex items-center gap-6">
            <Link href="/hub" className="text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> 
              Map
            </Link>
            <button 
              onClick={() => { logout(); setLocation("/login"); }}
              className="text-destructive/70 hover:text-destructive transition-colors flex items-center gap-2 font-serif"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
          
          <h1 className="font-display text-2xl md:text-3xl text-primary text-glow flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary/50" />
            {title}
            <Sparkles className="w-6 h-6 text-primary/50" />
          </h1>
          
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Shirt className="w-4 h-4 text-primary" />
                <span className="text-xs font-display text-primary uppercase tracking-widest">{user.equippedItem}</span>
              </div>
              {timeLeft !== null && (
              <div className={`glass-panel px-4 py-2 rounded-full font-mono flex items-center gap-2 ${timeLeft < 300000 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
            <div className="glass-panel px-6 py-2 rounded-full font-serif">
              <span className="text-muted-foreground">Score: </span>
              <span className="text-primary font-bold text-lg text-glow-sm">{user?.score || 0}</span>
            </div>
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
    </div>
  );
}

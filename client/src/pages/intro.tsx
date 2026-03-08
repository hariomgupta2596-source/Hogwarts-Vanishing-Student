import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Trophy, Shield, Zap, Eye, Flame, HelpCircle } from "lucide-react";
import { useLogin } from "@/hooks/use-game";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/lib/store";
import { useEffect } from "react";
import { Link } from "wouter";
import entryBg from "@assets/Entry_Background_1772032172890.png";

const HOUSES = [
  { id: "gryffindor", name: "Gryffindor", icon: Flame, color: "text-red-500", border: "border-red-500/50" },
  { id: "slytherin", name: "Slytherin", icon: Shield, color: "text-green-500", border: "border-green-500/50" },
  { id: "ravenclaw", name: "Ravenclaw", icon: Zap, color: "text-blue-500", border: "border-blue-500/50" },
  { id: "hufflepuff", name: "Hufflepuff", icon: Eye, color: "text-yellow-500", border: "border-yellow-500/50" },
];

export function Intro() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = useGameStore(state => state.user);
  const setHouse = useGameStore(state => state.setHouse);

  useEffect(() => {
    if (user) {
      setLocation("/story");
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !selectedHouse) {
      toast({
        title: "Missing Information",
        description: "Please provide a name, password, and select your house.",
        variant: "destructive",
      });
      return;
    }
    
    setHouse(selectedHouse);
    login({ username, password, house: selectedHouse }, {
      onSuccess: () => {
        setLocation("/hub");
      },
      onError: (error: any) => {
        toast({
          title: "Access Denied",
          description: error.message || "Invalid credentials or investigator already active.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.85), rgba(10, 10, 15, 0.85)), url(${entryBg})` }}
    >
      <FloatingOrbs />

      <div className="absolute top-8 right-8 z-20 flex gap-4">
        <Link href="/guide" className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-serif">
          <HelpCircle className="w-5 h-5" />
          <span>Guide</span>
        </Link>
        <Link href="/leaderboard" className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-serif">
          <Trophy className="w-5 h-5" />
          <span>Leaderboard</span>
        </Link>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel max-w-2xl w-full p-8 md:p-12 rounded-2xl relative z-10 box-glow"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center mt-6 mb-8">
          <h2 className="text-primary/70 font-display text-sm tracking-[0.2em] uppercase mb-2">Department of Mysteries</h2>
          <h1 className="font-display text-4xl text-primary text-glow leading-tight mb-4">
            Investigator Registry
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-serif text-xs text-primary/80 uppercase tracking-widest ml-1">Investigator Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Name..."
                className="w-full bg-background/50 border-2 border-primary/20 rounded-xl px-4 py-3 font-serif text-foreground focus:outline-none focus:border-primary/50 transition-all"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label className="font-serif text-xs text-primary/80 uppercase tracking-widest ml-1">Access Cipher</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                className="w-full bg-background/50 border-2 border-primary/20 rounded-xl px-4 py-3 font-serif text-foreground focus:outline-none focus:border-primary/50 transition-all"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-serif text-xs text-primary/80 uppercase tracking-widest block text-center">Select Your House</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {HOUSES.map((house) => {
                const Icon = house.icon;
                const isSelected = selectedHouse === house.id;
                return (
                  <button
                    key={house.id}
                    type="button"
                    onClick={() => setSelectedHouse(house.id)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected ? `${house.border} bg-primary/10 scale-105` : "border-transparent bg-background/30 hover:bg-background/50"
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${isSelected ? house.color : "text-muted-foreground"}`} />
                    <span className={`text-xs font-display tracking-wider ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {house.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full relative group overflow-hidden rounded-xl p-[2px] disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-background px-8 py-4 rounded-[10px] flex items-center justify-center gap-3 transition-all group-hover:bg-background/80">
              <span className="font-display font-bold text-primary tracking-wider text-lg">
                {isPending ? "Authenticating..." : "Begin Investigation"}
              </span>
              <Sparkles className="w-5 h-5 text-primary group-hover:animate-spin" />
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  );
}

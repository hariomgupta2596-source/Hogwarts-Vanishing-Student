import { useState } from "react";
import { useLeaderboard, useHouseStandings } from "@/hooks/use-game";
import { PageWrapper } from "@/components/PageWrapper";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Medal, HelpCircle, Flame, Shield, Zap, Eye, Users, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { AudioToggle } from "@/components/AudioToggle";
import { soundManager } from "@/lib/audio";
import bgImage from "@assets/beg.jpg";

const HOUSE_CONFIGS: Record<string, { name: string; icon: any; color: string; border: string; bg: string; bar: string }> = {
  gryffindor: { name: "Gryffindor", icon: Flame, color: "text-red-400", border: "border-red-500/50", bg: "bg-red-950/20", bar: "bg-red-500" },
  slytherin: { name: "Slytherin", icon: Shield, color: "text-emerald-400", border: "border-emerald-500/50", bg: "bg-emerald-950/20", bar: "bg-emerald-500" },
  ravenclaw: { name: "Ravenclaw", icon: Zap, color: "text-blue-400", border: "border-blue-500/50", bg: "bg-blue-950/20", bar: "bg-blue-500" },
  hufflepuff: { name: "Hufflepuff", icon: Eye, color: "text-amber-400", border: "border-amber-500/50", bg: "bg-amber-950/20", bar: "bg-amber-500" },
};

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"individual" | "house">("individual");
  const { data: individualData, isLoading: isIndividualLoading } = useLeaderboard();
  const { data: houseData, isLoading: isHouseLoading } = useHouseStandings();
  const currentUser = useGameStore((state) => state.user);
  const isMuted = useGameStore((state) => state.isMuted);

  const userHouse = (currentUser?.house || "").toLowerCase();

  const handleTabChange = (tab: "individual" | "house") => {
    if (!isMuted) soundManager.playClick();
    setActiveTab(tab);
  };

  const maxHouseScore = Math.max(1, ...(houseData?.map((h) => h.totalScore) || [100]));

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(${bgImage})` }}
    >
      <PageWrapper requireAuth={false}>
        <header className="flex flex-col items-center mb-8 relative z-10">
          <div className="absolute left-0 top-2 flex items-center gap-3">
            <Link href="/hub" className="text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif text-sm">
              <ArrowLeft className="w-5 h-5" /> Back
            </Link>
            <Link href="/guide" className="text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif text-sm">
              <HelpCircle className="w-5 h-5" /> Guide
            </Link>
          </div>

          <div className="absolute right-0 top-2">
            <AudioToggle />
          </div>

          <Trophy className="w-16 h-16 text-primary mb-3 text-glow" />
          <h1 className="font-display text-4xl text-primary text-glow">Wizengamot Archives</h1>
          <p className="font-serif text-muted-foreground mt-1 text-sm">Top Investigators and House Standings</p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 p-1.5 glass-panel rounded-2xl border border-primary/20">
            <button
              onClick={() => handleTabChange("individual")}
              className={`px-6 py-2.5 rounded-xl font-display text-sm transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === "individual"
                  ? "bg-primary text-primary-foreground font-bold box-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Individual Rankings</span>
            </button>
            <button
              onClick={() => handleTabChange("house")}
              className={`px-6 py-2.5 rounded-xl font-display text-sm transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === "house"
                  ? "bg-primary text-primary-foreground font-bold box-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>House Cup Standings</span>
            </button>
          </div>
        </header>

        <div className="max-w-3xl mx-auto w-full relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === "individual" ? (
              <motion.div
                key="individual"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {isIndividualLoading ? (
                  <div className="text-center py-20 font-serif text-primary animate-pulse text-xl">
                    Consulting the individual records...
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl overflow-hidden border border-primary/20">
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-primary/20 bg-primary/5 font-display text-primary tracking-wider text-sm">
                      <div className="col-span-1 text-center">Rank</div>
                      <div className="col-span-5">Investigator</div>
                      <div className="col-span-2 text-center">Score</div>
                      <div className="col-span-4 text-right">Decree</div>
                    </div>
                    
                    <div className="divide-y divide-primary/10">
                      {individualData?.map((user, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={user.id}
                          className={`grid grid-cols-12 gap-4 p-6 items-center font-serif transition-colors ${
                            currentUser?.id === user.id ? "bg-primary/15 border-l-4 border-primary" : "hover:bg-white/5"
                          }`}
                        >
                          <div className="col-span-1 flex justify-center">
                            {index === 0 ? <Medal className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" /> : 
                             index === 1 ? <Medal className="w-7 h-7 text-gray-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.8)]" /> : 
                             index === 2 ? <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.8)]" /> : 
                             <span className="text-xl font-display text-muted-foreground">#{index + 1}</span>}
                          </div>
                          <div className="col-span-5 flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-foreground">{user.username}</span>
                              {currentUser?.id === user.id && (
                                <span className="text-[10px] font-display uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">You</span>
                              )}
                            </div>
                            <span className="text-xs text-primary/60 font-display uppercase tracking-tighter">{user.equippedItem || 'Standard Robes'}</span>
                          </div>
                          <div className="col-span-2 text-center text-primary font-bold text-xl">
                            {user.score}
                          </div>
                          <div className="col-span-4 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider
                              ${user.finalChoice === 'expose' ? 'bg-primary/20 text-primary border border-primary/30' : 
                                user.finalChoice === 'seal' ? 'bg-blue-900/40 text-blue-400 border border-blue-400/30' : 
                                user.finalChoice === 'erase' ? 'bg-red-900/40 text-red-400 border border-red-400/30' : 
                                'bg-muted text-muted-foreground'}
                            `}>
                              {user.finalChoice || 'Pending'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      
                      {(!individualData || individualData.length === 0) && (
                        <div className="p-12 text-center text-muted-foreground font-serif italic">
                          The archives are currently empty. Be the first to solve the mystery.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="house"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {isHouseLoading ? (
                  <div className="text-center py-20 font-serif text-primary animate-pulse text-xl">
                    Calculating House Point Tally...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {houseData?.map((standing, index) => {
                      const cfg = HOUSE_CONFIGS[standing.house.toLowerCase()] || HOUSE_CONFIGS.gryffindor;
                      const Icon = cfg.icon;
                      const isUserHouse = userHouse === standing.house.toLowerCase();
                      const pct = Math.round((standing.totalScore / maxHouseScore) * 100);

                      return (
                        <motion.div
                          key={standing.house}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`glass-panel p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${cfg.border} ${cfg.bg} ${
                            isUserHouse ? "box-glow-strong" : ""
                          }`}
                        >
                          <div className="flex flex-wrap justify-between items-center gap-4 relative z-10">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-background/50 border border-primary/20 font-display font-bold text-xl text-primary">
                                #{index + 1}
                              </div>
                              <div className="p-3 rounded-2xl bg-background/40 border border-primary/20">
                                <Icon className={`w-8 h-8 ${cfg.color}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className={`font-display text-2xl font-bold ${cfg.color}`}>{cfg.name}</h3>
                                  {isUserHouse && (
                                    <span className="text-[10px] font-display uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-bold">
                                      Your House
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 font-serif text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary/70" /> {standing.investigatorCount} Investigators</span>
                                  <span>Avg Score: <strong className="text-foreground">{standing.averageScore}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-display text-3xl font-bold text-primary text-glow">{standing.totalScore}</div>
                              <div className="font-serif text-xs text-muted-foreground uppercase tracking-widest">Total House Points</div>
                            </div>
                          </div>

                          {/* Animated House Score Bar */}
                          <div className="mt-4 w-full h-3 rounded-full bg-background/50 overflow-hidden relative border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${cfg.bar}`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageWrapper>
    </div>
  );
}

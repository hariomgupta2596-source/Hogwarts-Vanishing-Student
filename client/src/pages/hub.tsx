import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, Unlock, Trophy, Compass, MapPin, LogOut, Shirt } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { PageWrapper } from "@/components/PageWrapper";
import { useUpdateCustomization } from "@/hooks/use-game";
import entryBg from "@assets/Entry_Background_1772032172890.png";

const NODES = [
  { id: 1, title: "The Sorting Hat", desc: "Assign anomalous traits.", path: "/game/1", reward: "Apprentice Robes" },
  { id: 2, title: "Three Broomsticks", desc: "Reconstruct the torn receipt.", path: "/game/2", reward: "Investigator's Cloak" },
  { id: 3, title: "Pensieve Paradox", desc: "Find the memory contradiction.", path: "/game/3", reward: "Senior Inquisitor's Mantle" },
  { id: 4, title: "Ministry Register", desc: "Locate the invisible student.", path: "/game/4", reward: "Master of Mysteries Raiment" },
];

export function Hub() {
  const user = useGameStore(state => state.user);
  const logout = useGameStore(state => state.logout);
  const [, setLocation] = useLocation();
  const completedGames = user?.completedGames || 0;
  const { mutate: updateCustomization } = useUpdateCustomization();

  if (!user) return null;

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(${entryBg})` }}
    >
      <PageWrapper>
        <header className="flex justify-between items-center mb-12 relative z-10">
          <div>
            <h1 className="font-display text-4xl text-primary text-glow mb-2 flex items-center gap-3">
              <Compass className="w-8 h-8" /> 
              Investigation Map
            </h1>
            <div className="flex items-center gap-4">
              <p className="font-serif text-muted-foreground">Investigator: <span className="text-foreground">{user.username}</span></p>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Shirt className="w-4 h-4 text-primary" />
                <span className="text-xs font-display text-primary uppercase tracking-tighter">{user.equippedItem}</span>
              </div>
              <button 
                onClick={() => { logout(); setLocation("/login"); }}
                className="text-destructive/70 hover:text-destructive transition-colors flex items-center gap-2 font-serif text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="glass-panel px-6 py-3 rounded-xl flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-display text-xl text-primary font-bold">{user.score || 0}</span>
            </div>
            <Link href="/leaderboard" className="glass-panel px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-primary/10 transition-colors cursor-pointer text-primary">
              Standings
            </Link>
          </div>
        </header>

        {/* Wardrobe Section */}
        <div className="mb-12 relative z-10">
          <h2 className="font-display text-2xl text-primary mb-4 flex items-center gap-2">
            <Shirt className="w-6 h-6" /> Your Wardrobe
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => updateCustomization("Standard Robes")}
              className={`px-4 py-2 rounded-xl border transition-all ${user.equippedItem === "Standard Robes" ? "bg-primary text-primary-foreground border-primary" : "bg-background/40 border-primary/20 text-muted-foreground hover:border-primary/50"}`}
            >
              Standard Robes
            </button>
            {NODES.map(node => {
              const isUnlocked = user.completedGames >= node.id;
              if (!isUnlocked) return null;
              return (
                <button
                  key={node.reward}
                  onClick={() => updateCustomization(node.reward)}
                  className={`px-4 py-2 rounded-xl border transition-all ${user.equippedItem === node.reward ? "bg-primary text-primary-foreground border-primary box-glow" : "bg-background/40 border-primary/20 text-muted-foreground hover:border-primary/50"}`}
                >
                  {node.reward}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto py-10 z-10">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-1/2 z-0" />

          <div className="space-y-16 relative z-10">
            {NODES.map((node, index) => {
              const isUnlocked = node.id <= completedGames + 1;
              const isCompleted = node.id <= completedGames;
              const isLeft = index % 2 === 0;

              return (
                <motion.div 
                  key={node.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${isLeft ? 'text-right' : 'text-left'}`}>
                    <div className={`
                      glass-panel p-6 rounded-2xl transition-all duration-300
                      ${isUnlocked ? 'hover:box-glow hover:border-primary/50' : 'opacity-50 grayscale'}
                    `}>
                      <h3 className="font-display text-xl text-foreground mb-1">{node.title}</h3>
                      <p className="font-serif text-xs text-primary/70 uppercase tracking-widest mb-2">Reward: {node.reward}</p>
                      <p className="font-serif text-muted-foreground mb-4">{node.desc}</p>
                      
                      {isUnlocked ? (
                        <Link href={node.path} className="inline-flex items-center gap-2 font-serif text-primary hover:text-primary/80 transition-colors">
                          {isCompleted ? "Review Evidence" : "Enter Location"} <MapPin className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 font-serif text-muted-foreground">
                          Locked <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className={`
                      w-12 h-12 rounded-full border-4 flex items-center justify-center bg-background
                      ${isCompleted ? 'border-primary box-glow' : isUnlocked ? 'border-primary/50 text-primary/50' : 'border-muted text-muted-foreground'}
                    `}>
                      {isCompleted ? <Unlock className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  <div className="w-1/2" />
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-24 flex flex-col items-center relative z-10"
          >
            <div className="w-1 bg-primary/50 h-16 mb-4" />
            <div className={`
              glass-panel p-8 rounded-2xl text-center max-w-md w-full
              ${completedGames >= 4 ? 'box-glow-strong border-primary' : 'opacity-50'}
            `}>
              <h2 className="font-display text-3xl text-primary text-glow mb-4">Wizengamot Verdict</h2>
              <p className="font-serif text-muted-foreground mb-6">
                Present your findings and make your final choice regarding the vanished student.
              </p>
              {completedGames >= 4 ? (
                <Link href="/verdict" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display text-lg font-bold hover:bg-primary/90 transition-colors inline-block box-glow">
                  Convene Trial
                </Link>
              ) : (
                <button disabled className="bg-muted text-muted-foreground px-8 py-3 rounded-xl font-display text-lg font-bold cursor-not-allowed flex items-center justify-center gap-2 w-full">
                  <Lock className="w-5 h-5" /> Gather More Evidence
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </div>
  );
}

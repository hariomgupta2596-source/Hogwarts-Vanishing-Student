import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Trophy, Compass, MapPin, LogOut, Shirt, HelpCircle, X, Sparkles, Shield, Flame, Zap, Eye } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { PageWrapper } from "@/components/PageWrapper";
import { AudioToggle } from "@/components/AudioToggle";
import { useUpdateCustomization } from "@/hooks/use-game";
import { soundManager } from "@/lib/audio";
import entryBg from "@assets/Entry_Background_1772032172890.png";

const NODES = [
  { id: 1, title: "The Sorting Hat", desc: "Assign anomalous traits.", path: "/game/1", reward: "Apprentice Robes" },
  { id: 2, title: "Three Broomsticks", desc: "Reconstruct the torn receipt.", path: "/game/2", reward: "Investigator's Cloak" },
  { id: 3, title: "Pensieve Paradox", desc: "Find the memory contradiction.", path: "/game/3", reward: "Senior Inquisitor's Mantle" },
  { id: 4, title: "Ministry Register", desc: "Locate the invisible student.", path: "/game/4", reward: "Master of Mysteries Raiment" },
];

const HOUSE_ICONS: Record<string, any> = {
  gryffindor: Flame,
  slytherin: Shield,
  ravenclaw: Zap,
  hufflepuff: Eye,
};

export function Hub() {
  const user = useGameStore(state => state.user);
  const logout = useGameStore(state => state.logout);
  const isMuted = useGameStore(state => state.isMuted);
  const [, setLocation] = useLocation();
  const completedGames = user?.completedGames || 0;
  const { mutate: updateCustomization } = useUpdateCustomization();

  const [previewItem, setPreviewItem] = useState<string | null>(null);

  if (!user) return null;

  const HouseIcon = HOUSE_ICONS[(user.house || "gryffindor").toLowerCase()] || Flame;

  const handleEquip = (item: string) => {
    if (!isMuted) soundManager.playClick();
    updateCustomization(item);
    setPreviewItem(null);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(${entryBg})` }}
    >
      <PageWrapper>
        <header className="flex flex-wrap justify-between items-center gap-4 mb-12 relative z-10">
          <div>
            <h1 className="font-display text-4xl text-primary text-glow mb-2 flex items-center gap-3">
              <Compass className="w-8 h-8" /> 
              Investigation Map
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <p className="font-serif text-muted-foreground flex items-center gap-1.5">
                Investigator: <span className="text-foreground font-semibold">{user.username}</span>
                <HouseIcon className="w-4 h-4 text-primary ml-1" />
              </p>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Shirt className="w-4 h-4 text-primary" />
                <span className="text-xs font-display text-primary uppercase tracking-tighter">{user.equippedItem}</span>
              </div>
              <button 
                onClick={() => {
                  if (!isMuted) soundManager.playClick();
                  logout();
                  setLocation("/login");
                }}
                className="text-destructive/70 hover:text-destructive transition-colors flex items-center gap-2 font-serif text-sm focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AudioToggle />
            <div className="glass-panel px-5 py-2.5 rounded-xl flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-display text-lg text-primary font-bold">{user.score || 0}</span>
            </div>
            <Link href="/leaderboard" className="glass-panel px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer text-primary text-sm font-display">
              Standings
            </Link>
            <Link href="/guide" className="glass-panel p-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer text-primary">
              <HelpCircle className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Wardrobe Section */}
        <div className="mb-12 relative z-10">
          <h2 className="font-display text-2xl text-primary mb-4 flex items-center gap-2">
            <Shirt className="w-6 h-6" /> Wardrobe Raiment
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Standard Robes", ...NODES.filter(n => user.completedGames >= n.id).map(n => n.reward)].map((item) => {
              const isEquipped = user.equippedItem === item;
              return (
                <button
                  key={item}
                  onClick={() => setPreviewItem(item)}
                  className={`px-4 py-2 rounded-xl border transition-all font-serif text-sm flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary ${
                    isEquipped 
                      ? "bg-primary text-primary-foreground border-primary box-glow font-bold" 
                      : "bg-background/40 border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Shirt className="w-4 h-4" />
                  <span>{item}</span>
                  {isEquipped && <span className="text-[10px] uppercase font-display bg-primary-foreground text-primary px-1.5 py-0.5 rounded">Equipped</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Living Investigation Map */}
        <div className="relative max-w-3xl mx-auto py-10 z-10">
          {/* Animated SVG Living Line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-2 z-0 pointer-events-none">
            <svg className="w-full h-full" overflow="visible">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(212,175,55,0.15)" strokeWidth="3" />
              <motion.line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(1, (completedGames + 1) / 4) }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="space-y-16 relative z-10">
            {NODES.map((node, index) => {
              const isUnlocked = node.id <= completedGames + 1;
              const isCompleted = node.id <= completedGames;
              const isCurrentActive = node.id === completedGames + 1;
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
                      ${isCurrentActive ? 'border-primary box-glow-strong bg-primary/10' : isUnlocked ? 'hover:box-glow hover:border-primary/50' : 'opacity-50 grayscale'}
                    `}>
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        {isCurrentActive && (
                          <span className="text-[10px] font-display uppercase tracking-widest text-primary bg-primary/20 px-2 py-0.5 rounded-full animate-pulse border border-primary/40">
                            Active Lead
                          </span>
                        )}
                        <h3 className="font-display text-xl text-foreground">{node.title}</h3>
                      </div>
                      <p className="font-serif text-xs text-primary/70 uppercase tracking-widest mb-2">Reward: {node.reward}</p>
                      <p className="font-serif text-muted-foreground text-sm mb-4">{node.desc}</p>
                      
                      {isUnlocked ? (
                        <Link 
                          href={node.path} 
                          onClick={() => { if (!isMuted) soundManager.playClick(); }}
                          className="inline-flex items-center gap-2 font-serif text-primary hover:text-primary/80 transition-colors font-bold text-sm"
                        >
                          {isCompleted ? "Review Evidence" : "Enter Location"} <MapPin className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 font-serif text-muted-foreground text-sm">
                          Locked <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <motion.div 
                      animate={isCurrentActive ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 20px rgba(212,175,55,0.8)", "0 0 0px rgba(212,175,55,0)"] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`
                        w-12 h-12 rounded-full border-4 flex items-center justify-center bg-background z-10
                        ${isCompleted ? 'border-primary box-glow' : isCurrentActive ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}
                      `}
                    >
                      {isCompleted ? <Unlock className="w-5 h-5 text-primary" /> : isCurrentActive ? <Sparkles className="w-5 h-5 text-primary animate-spin" /> : <Lock className="w-5 h-5" />}
                    </motion.div>
                  </div>
                  
                  <div className="w-1/2" />
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-24 flex flex-col items-center relative z-10"
          >
            <div className="w-1 bg-primary/50 h-16 mb-4" />
            <div className={`
              glass-panel p-8 rounded-2xl text-center max-w-md w-full
              ${completedGames >= 4 ? 'box-glow-strong border-primary' : 'opacity-50'}
            `}>
              <h2 className="font-display text-3xl text-primary text-glow mb-4">Wizengamot Verdict</h2>
              <p className="font-serif text-muted-foreground mb-6 text-sm">
                Present your findings and make your final choice regarding the vanished student.
              </p>
              {completedGames >= 4 ? (
                <Link 
                  href="/verdict" 
                  onClick={() => { if (!isMuted) soundManager.playClick(); }}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display text-lg font-bold hover:bg-primary/90 transition-colors inline-block box-glow"
                >
                  Convene Trial
                </Link>
              ) : (
                <button disabled className="bg-muted text-muted-foreground px-8 py-3 rounded-xl font-display text-lg font-bold cursor-not-allowed flex items-center justify-center gap-2 w-full text-sm">
                  <Lock className="w-5 h-5" /> Gather More Evidence
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Wardrobe Live Preview Modal */}
        <AnimatePresence>
          {previewItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel max-w-md w-full p-8 rounded-2xl border-2 border-primary/40 relative box-glow-strong text-center"
              >
                <button
                  onClick={() => setPreviewItem(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-20 h-20 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-4 box-glow">
                  <Shirt className="w-10 h-10 text-primary" />
                </div>

                <h3 className="font-display text-2xl text-primary text-glow mb-2">{previewItem}</h3>
                <p className="font-serif text-xs text-primary/70 uppercase tracking-widest mb-6">Investigator Raiment Preview</p>

                <div className="p-4 rounded-xl bg-background/60 border border-primary/20 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-xs font-serif">
                    <span className="text-muted-foreground">Investigator:</span>
                    <span className="text-foreground font-bold">{user.username}</span>
                  </div>
                  <div className="flex justify-between text-xs font-serif">
                    <span className="text-muted-foreground">House:</span>
                    <span className="text-foreground font-bold uppercase">{user.house}</span>
                  </div>
                  <div className="flex justify-between text-xs font-serif">
                    <span className="text-muted-foreground">Currently Wearing:</span>
                    <span className="text-primary font-bold">{user.equippedItem}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-primary/30 font-serif text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEquip(previewItem)}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-display text-sm font-bold hover:bg-primary/90 transition-colors box-glow"
                  >
                    Equip Raiment
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}

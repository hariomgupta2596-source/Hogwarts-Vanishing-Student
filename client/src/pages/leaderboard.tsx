import { useLeaderboard } from "@/hooks/use-game";
import { PageWrapper } from "@/components/PageWrapper";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";

export function Leaderboard() {
  const { data, isLoading } = useLeaderboard();

  return (
    <PageWrapper requireAuth={false}>
      <header className="flex flex-col items-center mb-12 relative z-10">
        <Link href="/hub" className="absolute left-0 top-2 text-primary/70 hover:text-primary transition-colors flex items-center gap-2 font-serif">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
        <Trophy className="w-16 h-16 text-primary mb-4 text-glow" />
        <h1 className="font-display text-4xl text-primary text-glow">Wizengamot Archives</h1>
        <p className="font-serif text-muted-foreground mt-2">Top Investigators and their final decrees.</p>
      </header>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {isLoading ? (
          <div className="text-center py-20 font-serif text-primary animate-pulse text-xl">
            Consulting the records...
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-primary/20 bg-primary/5 font-display text-primary tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5">Investigator</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-4 text-right">Decree</div>
            </div>
            
            <div className="divide-y divide-primary/10">
              {data?.map((user, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={user.id}
                  className="grid grid-cols-12 gap-4 p-6 items-center font-serif transition-colors hover:bg-white/5"
                >
                  <div className="col-span-1 flex justify-center">
                    {index === 0 ? <Medal className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" /> : 
                     index === 1 ? <Medal className="w-7 h-7 text-gray-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.8)]" /> : 
                     index === 2 ? <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.8)]" /> : 
                     <span className="text-xl font-display text-muted-foreground">#{index + 1}</span>}
                  </div>
                  <div className="col-span-5 flex flex-col">
                    <span className="font-bold text-lg text-foreground">{user.username}</span>
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
              
              {(!data || data.length === 0) && (
                <div className="p-12 text-center text-muted-foreground font-serif italic">
                  The archives are currently empty. Be the first to solve the mystery.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

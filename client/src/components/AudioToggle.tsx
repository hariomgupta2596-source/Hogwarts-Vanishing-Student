import { Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { soundManager } from "@/lib/audio";
import { useEffect } from "react";

export function AudioToggle({ className = "" }: { className?: string }) {
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);

  useEffect(() => {
    if (!isMuted) {
      soundManager.startAmbient();
    } else {
      soundManager.stopAmbient();
    }
  }, [isMuted]);

  const handleToggle = () => {
    if (isMuted) {
      soundManager.playClick();
    }
    toggleMute();
  };

  return (
    <button
      onClick={handleToggle}
      title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
      className={`glass-panel p-2.5 rounded-xl text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors flex items-center gap-2 font-serif text-xs ${className}`}
    >
      {isMuted ? (
        <>
          <VolumeX className="w-4 h-4 text-muted-foreground" />
          <span className="hidden sm:inline">Muted</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-primary animate-pulse" />
          <span className="hidden sm:inline">Ambient On</span>
        </>
      )}
    </button>
  );
}

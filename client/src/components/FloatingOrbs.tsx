import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingOrbs() {
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[80px] opacity-20 mix-blend-screen"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            background: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(280 60% 40%)",
          }}
          animate={{
            x: [Math.random() * windowSize.width, Math.random() * windowSize.width, Math.random() * windowSize.width],
            y: [Math.random() * windowSize.height, Math.random() * windowSize.height, Math.random() * windowSize.height],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

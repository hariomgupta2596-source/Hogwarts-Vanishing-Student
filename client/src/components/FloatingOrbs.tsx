import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingOrbs() {
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {[...Array(8)].map((_, i) => {
        const factor = (i + 1) * 0.3;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[70px] opacity-25 mix-blend-screen"
            style={{
              width: 120 + (i % 4) * 50,
              height: 120 + (i % 4) * 50,
              background: i % 3 === 0 ? "hsl(var(--primary))" : i % 3 === 1 ? "hsl(280 70% 45%)" : "hsl(42 80% 50%)",
            }}
            animate={{
              x: [
                (i * 180) % windowSize.width + mousePos.x * factor,
                ((i * 180 + 300) % windowSize.width) + mousePos.x * factor,
                (i * 180) % windowSize.width + mousePos.x * factor,
              ],
              y: [
                (i * 120) % windowSize.height + mousePos.y * factor,
                ((i * 120 + 200) % windowSize.height) + mousePos.y * factor,
                (i * 120) % windowSize.height + mousePos.y * factor,
              ],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 18 + i * 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

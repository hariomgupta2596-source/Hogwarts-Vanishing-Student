import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { FloatingOrbs } from "./FloatingOrbs";

interface PageWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function PageWrapper({ children, requireAuth = true }: PageWrapperProps) {
  const user = useGameStore(state => state.user);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (requireAuth && !user) {
      setLocation("/");
    }
  }, [user, requireAuth, setLocation]);

  if (requireAuth && !user) return null;

  return (
    <>
      <FloatingOrbs />
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

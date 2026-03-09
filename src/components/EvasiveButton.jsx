import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const FLEE_RADIUS = 80;

const EvasiveButton = ({ dark }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);
  const posRef = useRef(pos);
  posRef.current = pos;

  const evade = useCallback((clientX, clientY) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < FLEE_RADIUS) {
      const angle = Math.atan2(dy, dx) + Math.PI; 
      const flee = 90 + Math.random() * 60;
      const nx = posRef.current.x + Math.cos(angle) * flee;
      const ny = posRef.current.y + Math.sin(angle) * flee;
      setPos({
        x: Math.max(-160, Math.min(160, nx)),
        y: Math.max(-80, Math.min(80, ny)),
      });
    }
  }, []);

  useEffect(() => {
    const onMouse = (e) => evade(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) evade(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [evade]);

  return (
    <motion.div
      ref={btnRef}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      style={{ display: "inline-block" }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={(e) => e.preventDefault()}
        className={`px-8 py-4 rounded-xl text-lg font-bold select-none
          ${
            dark
              ? "bg-white/10 text-white/50 border border-white/20"
              : "bg-black/5 text-gray-400 border border-gray-200"
          }
          backdrop-blur-sm cursor-not-allowed`}
      >
        No, thanks 😅
      </motion.button>
    </motion.div>
  );
};

export default EvasiveButton;

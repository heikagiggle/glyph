import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { LEVEL_CONFIG } from "../utils/constants";
import sound from "../utils/soundManager";

const MAX_WORDS_PER_ROUND = 10;

// ── Confetti ───────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#10b981","#06b6d4","#8b5cf6","#f59e0b","#ec4899","#3b82f6"];

// Generate confetti data once (stable across renders)
const CONFETTI_PIECES = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: `${(i * 2.5) % 100}%`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 7 + (i % 5) * 2,
  duration: 2.2 + (i % 6) * 0.3,
  delay: (i % 8) * 0.15,
  rotate: i * 37,
}));

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
    {CONFETTI_PIECES.map((p) => (
      <motion.div
        key={p.id}
        className="absolute top-0 rounded-sm"
        style={{ left: p.left, width: p.size, height: p.size, background: p.color }}
        initial={{ y: -20, rotate: p.rotate, opacity: 1 }}
        animate={{ y: "110vh", rotate: p.rotate + 720, opacity: [1, 1, 0] }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// ── Orbiting Hearts — pure Framer Motion, no CSS keyframes ────────────────────
// Each heart is placed using sin/cos on a radius around a center point.
// useAnimationFrame drives a shared angle that advances each frame.
const HEART_COUNT = 4;
const ORBIT_RADIUS = 72;

const OrbitingHeart = ({ index, totalCount, angleRef }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const offset = (index / totalCount) * Math.PI * 2; // evenly spaced

  useAnimationFrame((time) => {
    const angle = (time / 1800) + offset; // full rotation every ~1.8s
    setPos({
      x: Math.cos(angle) * ORBIT_RADIUS,
      y: Math.sin(angle) * ORBIT_RADIUS * 0.55, // flatten into ellipse
    });
  });

  return (
    <motion.span
      className="absolute text-2xl pointer-events-none select-none"
      style={{
        left: "50%",
        top: "50%",
        x: pos.x - 12,
        y: pos.y - 12,
      }}
    >
      💔
    </motion.span>
  );
};

// ── Dancing emoji — Framer Motion spring bounce ────────────────────────────────
const DancingEmoji = ({ emoji, size = "text-7xl" }) => (
  <motion.span
    className={`${size} select-none relative z-10 inline-block`}
    animate={{
      y:       [0, -22, 0, -14, 0],
      rotate:  [-6, 0, 6, 0, -6],
      scale:   [1, 1.08, 1, 1.05, 1],
    }}
    transition={{
      duration: 0.85,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.span>
);

// ── OrbitingHearts container ───────────────────────────────────────────────────
const OrbitingHearts = () => {
  const angleRef = useRef(0);

  return (
    <div className="relative flex items-center justify-center"
      style={{ width: 200, height: 180 }}>
      {Array.from({ length: HEART_COUNT }).map((_, i) => (
        <OrbitingHeart key={i} index={i} totalCount={HEART_COUNT} angleRef={angleRef} />
      ))}
      <DancingEmoji emoji="😭" size="text-7xl" />
    </div>
  );
};

// ── Stars ──────────────────────────────────────────────────────────────────────
const Stars = ({ count = 3 }) => (
  <div className="flex gap-3 justify-center">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.span
        key={i}
        className="text-5xl"
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          delay: 0.4 + i * 0.18,
          type: "spring",
          stiffness: 260,
          damping: 14,
        }}
      >
        {i < count ? "⭐" : "☆"}
      </motion.span>
    ))}
  </div>
);

// ── Dancing pet (success) ─────────────────────────────────────────────────────
const DancingPet = () => (
  <div className="flex flex-col items-center gap-2">
    <DancingEmoji emoji="😊" size="text-8xl" />
    <div className="flex gap-2 mt-1">
      {["✨","🎉","✨"].map((e, i) => (
        <motion.span
          key={i}
          className="text-xl"
          animate={{ y: [0, -10, 0], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  </div>
);

// ── StatCard ───────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, isComplete, dark }) => (
  <div className={`flex flex-col items-center justify-center p-4 rounded-2xl w-24
    ${isComplete
      ? "bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
      : dark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-100"}`}>
    <span className={`text-[10px] font-black uppercase tracking-widest mb-1
      ${isComplete ? "text-emerald-400" : dark ? "text-white/30" : "text-slate-400"}`}>
      {label}
    </span>
    <div className="flex items-baseline gap-0.5">
      <span className={`text-xl font-black
        ${isComplete ? "text-emerald-400" : dark ? "text-white" : "text-slate-800"}`}>
        {count}
      </span>
      <span className={`text-[10px] font-bold ${dark ? "text-white/20" : "text-slate-300"}`}>
        /10
      </span>
    </div>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────────
const LevelResultScreen = ({ dark, level, stepWords, onDismiss }) => {
  const cfg = LEVEL_CONFIG[level];

  const roundCounts = [0, 1, 2].map(i => (stepWords[i] ?? []).length);
  const success     = roundCounts.every(c => c >= MAX_WORDS_PER_ROUND);
  const starCount   = success ? 3
    : roundCounts.filter(c => c >= MAX_WORDS_PER_ROUND).length > 0 ? 2 : 1;

  const DECORATIONS = success
    ? [{ emoji:"⭐",left:"10%",top:"8%"  },{ emoji:"🎊",left:"82%",top:"12%" },
       { emoji:"✨",left:"18%",top:"88%"},{ emoji:"🎉",left:"75%",top:"82%" }]
    : [{ emoji:"💔",left:"10%",top:"8%"  },{ emoji:"😢",left:"82%",top:"12%" },
       { emoji:"💔",left:"18%",top:"88%"},{ emoji:"😢",left:"75%",top:"82%" }];

  useEffect(() => {
    if (success) sound.success();
    else         sound.error();
  }, [success]);

  return (
    <motion.div
      key="level-result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onDismiss}
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center
        px-6 text-center cursor-pointer select-none
        ${dark ? "mesh-dark" : "mesh-light"}`}
    >
      {success && <Confetti />}

      {/* Ambient glows */}
      <div className={`fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none
        ${dark ? "bg-indigo-600/10" : "bg-emerald-400/10"}
        blur-3xl -translate-x-1/2 -translate-y-1/2`} />
      <div className={`fixed bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none
        ${dark ? "bg-teal-600/10" : "bg-teal-400/15"}
        blur-3xl translate-x-1/2 translate-y-1/2`} />

      {/* Floating corner decorations */}
      {DECORATIONS.map(({ emoji, left, top }, i) => (
        <motion.span
          key={i}
          className="fixed text-2xl pointer-events-none select-none opacity-30"
          style={{ left, top }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Card */}
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 40 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        className={`relative z-20 w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-5
          ${dark ? "bg-slate-900/80 border border-white/10" : "bg-white/80 border border-gray-100"}
          backdrop-blur-xl shadow-2xl`}
      >
        {success ? (
          <>
            <div className="space-y-3">
              <div className={`text-xs font-bold uppercase tracking-widest mb-1
                ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
                Level Completed
              </div>
              <div className={`text-xl font-black ${dark ? "text-white" : "text-slate-800"}`}>
                {cfg.label} Mode
              </div>
            </div>

            <Stars count={starCount} />
            <DancingPet />

              <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={e => { e.stopPropagation(); onDismiss(); }}
              className="px-10 py-2 rounded-3xl font-bold text-base text-white
                bg-linear-to-r from-emerald-500 to-red-500
                shadow-lg shadow-rose-500/30"
            >
              Play next level
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className={`text-sm ${dark ? "text-white/40" : "text-slate-500"}`}
            >
              Tap anywhere to see your scoreboard
            </motion.p>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className={`text-xs font-bold uppercase tracking-widest mb-1
                ${dark ? "text-rose-400" : "text-rose-500"}`}>
                Level Failed
              </div>
              <div className={`text-3xl font-black ${dark ? "text-white" : "text-slate-800"}`}>
                Oops!
              </div>
              <div className={`text-sm mt-1 text-rose-400 font-semibold`}>
                You ran out of time
              </div>
            </div>

            <OrbitingHearts />

            <div className="grid grid-cols-3 gap-3 w-full">
              {roundCounts.map((count, i) => (
                <StatCard
                  key={i}
                  label={`Round ${i + 1}`}
                  count={count}
                  isComplete={count >= MAX_WORDS_PER_ROUND}
                  dark={dark}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={e => { e.stopPropagation(); onDismiss(); }}
              className="px-10 py-2 rounded-3xl font-bold text-base text-white
                bg-linear-to-r from-rose-500 to-red-500
                shadow-lg shadow-rose-500/30"
            >
              Retry
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className={`text-xs ${dark ? "text-white/30" : "text-slate-400"}`}
            >
              or tap anywhere to see your scoreboard
            </motion.p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LevelResultScreen;
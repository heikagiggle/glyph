import { motion } from "framer-motion";
import { fadeUp } from "../utils/variants";
import EvasiveButton from "../components/EvasiveButton";
import sound from "../utils/soundManager";

// ─── SplashScreen ──────────────────────────────────────────────────────────────

const DECORATIONS = [
  { emoji: "💎", left: "15%", top: "10%" },
  { emoji: "✨", left: "37%", top: "85%" },
  { emoji: "💠", left: "59%", top: "10%" },
  { emoji: "🔮", left: "81%", top: "85%" },
];

const SplashScreen = ({ dark, onStart }) => (
  <motion.div
    key="splash"
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
  >
    {/* ── Animated Logo ── */}
    <motion.div
      className="glyph-logo mb-10"
      initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
    >
      <div
        className="text-8xl font-black tracking-tighter
        bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400
        bg-clip-text text-transparent drop-shadow-2xl"
      >
        G
      </div>
      <div
        className={`text-3xl font-black tracking-[0.3em] uppercase -mt-2
        ${dark ? "text-white/80" : "text-slate-700"}`}
      >
        LYPH
      </div>
    </motion.div>

    {/* ── Headline ── */}
    <motion.h1
      className={`text-2xl md:text-3xl font-bold mb-3
        ${dark ? "text-white" : "text-slate-800"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Welcome to{" "}
      <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Glyph
      </span>
      .
    </motion.h1>

    <motion.p
      className={`text-lg mb-12 ${dark ? "text-white/60" : "text-slate-500"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
    >
      Are you ready to play?
    </motion.p>

    {/* ── CTA Buttons ── */}
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      {/* YES – primary CTA */}
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: "0 0 32px rgba(16,185,129,0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-12 py-5 rounded-xl text-xl font-bold text-white
          bg-gradient-to-r from-emerald-500 to-teal-500
          shadow-xl shadow-emerald-500/30"
      >
        Yes, let's go! 🚀
      </motion.button>

      {/* NO – evasive, unclickable */}
      <EvasiveButton dark={dark} />
    </motion.div>

    {/* ── Floating decorations ── */}
    {DECORATIONS.map(({ emoji, left, top }, i) => (
      <motion.span
        key={i}
        className="fixed text-2xl pointer-events-none select-none opacity-30"
        style={{ left, top }}
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 3 + i * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {emoji}
      </motion.span>
    ))}
  </motion.div>
);

export default SplashScreen;

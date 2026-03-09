import { motion, AnimatePresence } from "framer-motion";
import { modalBackdrop, modalPanel } from "../utils/variants";

// ─── HowToPlayModal ────────────────────────────────────────────────────────────

const STEPS = [
  {
    step: "Step 1",
    icon: "✌️",
    title: "2-Letter Words",
    desc: "Tap letters to form valid 2-letter words before the timer runs out!",
  },
  {
    step: "Step 2",
    icon: "🤟",
    title: "3-Letter Words",
    desc: "Level up! Now form 3-letter words. More letters = more points.",
  },
  {
    step: "Step 3",
    icon: "✋",
    title: "4+ Letter Words",
    desc: "Master round! Craft the longest words you can for maximum score.",
  },
];

const HowToPlayModal = ({ dark, onClose }) => (
  <motion.div
    variants={modalBackdrop}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
    onClick={onClose}
  >
    <motion.div
      variants={modalPanel}
      onClick={(e) => e.stopPropagation()}
      className={`w-full max-w-md rounded-3xl p-8 shadow-2xl
        ${
          dark
            ? "bg-slate-900/95 border border-white/10"
            : "bg-white/95 border border-gray-100"
        }
        backdrop-blur-xl`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">📖</div>
        <h2
          className={`text-xl font-black ${dark ? "text-white" : "text-slate-800"}`}
        >
          How to Play
        </h2>
      </div>

      {/* Step cards */}
      {STEPS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}
          className={`flex gap-4 mb-4 p-3 rounded-xl
            ${
              dark
                ? "bg-white/5 border border-white/10"
                : "bg-gray-50 border border-gray-100"
            }`}
        >
          <div className="text-3xl shrink-0">{s.icon}</div>
          <div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-0.5">
              {s.step}
            </div>
            <div
              className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}
            >
              {s.title}
            </div>
            <div
              className={`text-sm mt-0.5 ${dark ? "text-white/60" : "text-slate-500"}`}
            >
              {s.desc}
            </div>
          </div>
        </motion.div>
      ))}

      <div
        className={`text-xs text-center mt-4 mb-6 ${dark ? "text-white/40" : "text-slate-400"}`}
      >
        💡 Tap letters to select
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
        className="w-full py-2 rounded-xl font-semibold text-white text-base
          bg-linear-to-r from-emerald-500 to-teal-500
          shadow-lg shadow-emerald-500/30"
      >
        Got it! Let's Play 🎮
      </motion.button>
    </motion.div>
  </motion.div>
);

export default HowToPlayModal;

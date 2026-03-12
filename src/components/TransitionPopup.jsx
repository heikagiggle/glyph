import { motion } from "framer-motion";
import { modalBackdrop, modalPanel } from "../utils/variants";
import sound from "../utils/soundManager";

const STEP_ICONS = ["✌️", "🤟", "✋"];

const TransitionPopup = ({ dark, step, wordLen, onGo }) => {
  const handleStart = () => {
    sound.select();
    onGo();
  };
  return (
    <>
      <motion.div
        variants={modalBackdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      >
        <motion.div
          variants={modalPanel}
          className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl
        ${
          dark
            ? "bg-slate-900/95 border border-emerald-500/30"
            : "bg-white/95 border border-emerald-200"
        }
        backdrop-blur-xl`}
        >
          {/* Animated icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.6, repeat: 2 }}
            className="text-5xl mb-4"
          >
            {STEP_ICONS[(step - 1) % 3]}
          </motion.div>

          <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">
            Round {step} of 3
          </div>

          <h2
            className={`text-2xl font-black mb-2 ${dark ? "text-white" : "text-slate-800"}`}
          >
            {wordLen}-Letter Words
          </h2>

          <p
            className={`text-sm mb-8 ${dark ? "text-white/60" : "text-slate-500"}`}
          >
            Form as many {wordLen}-letter words as possible before the timer
            ends!s
          </p>

          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 24px rgba(16,185,129,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full py-2 rounded-xl text-white text-xl
          bg-linear-to-r from-emerald-500 to-teal-500
          shadow-lg shadow-emerald-500/30 font-semibold"
          >
            Start! ⚡
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TransitionPopup;

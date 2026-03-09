import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/variants";
import { LEVEL_CONFIG } from "../utils/constants";
import HowToPlayModal from "../components/HowToPlayModal";
import sound from "../utils/soundManager";

// ─── LevelSelect ───────────────────────────────────────────────────────────────

const LevelSelect = ({ dark, onLevel }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <motion.div
        key="levels"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col items-center justify-center min-h-screen px-6"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="text-4xl font-black tracking-tight
            bg-linear-to-br from-emerald-400 to-teal-400
            bg-clip-text text-transparent mb-1"
          >
            GLYPH
          </div>
          <div
            className={`text-lg ${dark ? "text-white/60" : "text-slate-500"}`}
          >
            Choose your challenge
          </div>
        </motion.div>

        {/* Level Buttons – vertical column */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {Object.entries(LEVEL_CONFIG).map(([key, cfg], i) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15 + i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sound.select();
                onLevel(key);
              }}
              className={`relative overflow-hidden px-8 py-4 rounded-xl text-left
                bg-linear-to-r ${cfg.color}
                shadow-xl ${cfg.shadow} text-white group`}
            >
              <div className="font-black text-xl">{cfg.label}</div>
              <div className="text-sm opacity-75 mt-0.5">
                {cfg.time}s per round · Words: {cfg.steps.join(", ")} letters
              </div>
              {/* Shine sweep on hover */}
              <div
                className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0
                -translate-x-full group-hover:translate-x-full transition-transform duration-700
                pointer-events-none"
              />
            </motion.button>
          ))}
        </div>

        {/* How to Play trigger */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHelp(true)}
          className={`mt-8 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2
            ${
              dark
                ? "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                : "bg-black/5 text-slate-600 border border-gray-200 hover:bg-black/10"
            }
            backdrop-blur-sm transition-colors`}
        >
          📖 How to Play
        </motion.button>
      </motion.div>

      {/* How To Play Modal */}
      <AnimatePresence>
        {showHelp && (
          <HowToPlayModal dark={dark} onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default LevelSelect;

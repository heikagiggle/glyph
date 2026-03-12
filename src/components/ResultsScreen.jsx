import { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/variants";
import { LEVEL_CONFIG } from "../utils/constants";
import sound from "../utils/soundManager";

// ─── ResultsScreen ─────────────────────────────────────────────────────────────

const GRADE_COLORS = {
  S: "from-yellow-400 to-amber-400",
  A: "from-emerald-400 to-teal-400",
  B: "from-blue-400 to-indigo-400",
  C: "from-purple-400 to-fuchsia-400",
};

const getGrade = (total, maxPossible) => {
  if (total >= maxPossible * 0.8) return "S";
  if (total >= maxPossible * 0.6) return "A";
  if (total >= maxPossible * 0.4) return "B";
  return "C";
};

const getHeadline = (total, maxPossible) => {
  if (total === 0) return "Keep Practicing!";
  if (total >= maxPossible * 0.7) return "Keep it up! 🌟";
  return "Nice Work!";
};

const ResultsScreen = ({
  dark,
  level,
  scores,
  stepWords,
  onPlayAgain,
  onMenu,
}) => {
  const cfg = LEVEL_CONFIG[level];
  const total = scores.reduce((a, b) => a + b, 0);
  const maxPossible = cfg.steps.reduce((acc, len) => acc + len * 2 * 5, 0); 
  const grade = getGrade(total, maxPossible);

  useEffect(() => {
    sound.success();
  }, []);

  return (
    <motion.div
      key="results"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-start min-h-screen pt-16 px-4 pb-12"
    >
      {/* ── Grade Badge ── */}
      {/* <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center
          text-5xl font-black text-white
          bg-gradient-to-br ${GRADE_COLORS[grade]} shadow-2xl mb-6`}
        style={{ boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}
      >
        {grade}
      </motion.div> */}

      <motion.h2
        className={`text-2xl font-black mb-4 ${dark ? "text-white" : "text-slate-800"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {getHeadline(total, maxPossible)}
      </motion.h2>

      {/* <motion.p
        className={`text-sm mb-8 ${dark ? "text-white/50" : "text-slate-500"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {cfg.label} Mode Complete
      </motion.p>  */}

      {/* ── Total Score Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={`w-full max-w-md rounded-3xl p-4 mb-4 text-center shadow-xl backdrop-blur-sm
          ${
            dark
              ? "bg-white/5 border border-white/10"
              : "bg-white/90 border border-gray-100"
          }`}
      >
        <div
          className={`text-xs font-bold uppercase tracking-widest mb-2
          ${dark ? "text-white/40" : "text-slate-700"}`}
        >
          Total Score
        </div>
        <div
          className="text-4xl font-black
          bg-linear-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          {total}
        </div>
        <div
          className={`text-sm mt-1 ${dark ? "text-white/40" : "text-slate-600"}`}
        >
          points earned
        </div>
      </motion.div>

      {/* ── Per-Step Breakdown ── */}
      <div className="w-full max-w-md space-y-3 mb-8">
        {cfg.steps.map((len, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`rounded-xl p-4 shadow-md backdrop-blur-sm
              ${
                dark
                  ? "bg-white/5 border border-white/10"
                  : "bg-white/80 border border-gray-100"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-wider
                  ${dark ? "text-white/40" : "text-slate-400"}`}
                >
                  Round {i + 1}
                </div>
                <div
                  className={`font-semibold ${dark ? "text-white" : "text-slate-700"}`}
                >
                  {len}-Letter Words
                </div>
              </div>
              <div
                className="text-xl font-black
                bg-linear-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent"
              >
                {scores[i]}pts
              </div>
            </div>

            {(stepWords[i] || []).length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(stepWords[i] || []).map((w, j) => (
                  <span
                    key={j}
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                    bg-linear-to-r from-emerald-500/80 to-teal-500/80 text-white"
                  >
                    {w.word}
                  </span>
                ))}
              </div>
            ) : (
              <div
                className={`text-xs mt-1 ${dark ? "text-white/30" : "text-slate-400"}`}
              >
                No words scored this round
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: "0 0 24px rgba(16,185,129,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={onPlayAgain}
          className="w-full py-2 rounded-xl font-black text-white text-base
            bg-linear-to-r from-emerald-500 to-teal-500
            shadow-lg shadow-emerald-500/30"
        >
          Play Again 🔄
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onMenu}
          className={`w-full py-2 rounded-xl font-medium text-base transition-colors
            ${
              dark
                ? "bg-white/10 text-white/70 border border-white/15 hover:bg-white/20"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
        >
          ← Change Level
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsScreen;

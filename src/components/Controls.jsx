import { motion } from "framer-motion";

//  Sound Toggle 
const SoundToggle = ({ on, toggle }) => (
  <motion.button
    whileTap={{ scale: 0.85 }}
    onClick={toggle}
    title="Toggle Sound"
    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
      ${on
        ? "bg-emerald-500/20 text-emerald-300"
        : "bg-white/10 text-gray-400"}
      backdrop-blur-sm border border-white/20 transition-colors`}
  >
    {on ? "🔊" : "🔇"}
  </motion.button>
);

// Theme Toggle 
const ThemeToggle = ({ dark, toggle }) => (
  <motion.button
    whileTap={{ scale: 0.85 }}
    onClick={toggle}
    title="Toggle Theme"
    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
      ${dark
        ? "bg-white/10 text-yellow-300 hover:bg-white/20"
        : "bg-black/10 text-indigo-700 hover:bg-black/20"}
      backdrop-blur-sm border border-white/20 transition-colors`}
  >
    {dark ? "☀️" : "🌙"}
  </motion.button>
);

//  Controls Bar
const Controls = ({ dark, toggleDark, soundOn, toggleSound }) => (
  <div className="fixed top-4 right-4 z-50 flex gap-2">
    <SoundToggle on={soundOn} toggle={toggleSound} />
    <ThemeToggle dark={dark} toggle={toggleDark} />
  </div>
);

export default Controls;

import { motion } from "framer-motion";
import { letterVariant } from "../utils/variants";
import { getJewelColor } from "../utils/constants";

const LetterTile = ({ letter, index, isSelected, onClick }) => {
  const jewel = getJewelColor(index);

  const rotation = index % 3 === 0 ? -4 : index % 2 === 0 ? 4 : 0;

  return (
    <motion.button
      variants={letterVariant}
      onClick={onClick}
      whileHover={{ scale: 1.25, rotate: 0, filter: "brightness(1.5)" }}
      whileTap={{ scale: 0.85 }}
      className="relative flex items-center justify-center p-2 cursor-pointer select-none"
    >
      <span
        className={`text-5xl md:text-6xl font-black uppercase transition-all duration-300
          ${
            isSelected
              ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] scale-115"
              : "hover:scale-110"
          }`}
        style={{
          // Use the hex glow color for the actual letter color
          color: isSelected ? "#ffffff" : jewel.glow,
          transform: `rotate(${rotation}deg)`,
          fontFamily: "'Ga Maamli', 'Poppins', sans-serif",
          // Add a subtle text shadow to make the colors pop against the mesh background
          textShadow: isSelected
            ? `0 0 15px #fff, 0 0 30px ${jewel.glow}`
            : `2px 2px 0px rgba(0,0,0,0.15)`,
          WebkitTextStroke: isSelected ? "1px white" : "none",
        }}
      >
        {letter}
      </span>

      {/* A tiny dot of color under the letter for extra "Jewel" vibe */}
      {!isSelected && (
        <div
          className="absolute -bottom-1 w-1.5 h-1.5 rounded-full blur-[2px] opacity-50"
          style={{ backgroundColor: jewel.glow }}
        />
      )}
    </motion.button>
  );
};

export default LetterTile;

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Controls from "./components/Controls";
import SplashScreen from "./components/SplashScreen";
import LevelSelect from "./components/LevelSelect";
import GameBoard from "./components/GameBoard";
import ResultsScreen from "./components/ResultsScreen";

import sound from "./utils/soundManager";

export default function App() {
  // ── Theme & Sound ──
  const [dark, setDark] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const toggleDark = () => setDark((d) => !d);
  const toggleSound = () => {
    setSoundOn((on) => {
      sound.toggle(!on);
      return !on;
    });
  };

  // ── Routing state ──
  const [screen, setScreen] = useState("splash"); // splash | levels | game | results
  const [level, setLevel] = useState(null);

  const [gameResults, setGameResults] = useState({
    scores: [0, 0, 0],
    stepWords: { 1: [], 2: [], 3: [] },
  });

  const [gameKey, setGameKey] = useState(0);

  //  Navigation handlers 
  const handleStart = () => {
    sound.select();
    sound.playMusic();
    setScreen("levels");
  };

  const handleLevel = (lv) => {
    setLevel(lv);
    setScreen("game");
  };

  const handleGameEnd = (scores, stepWords) => {
    setGameResults({ scores, stepWords });
    setScreen("results");
  };

  const handlePlayAgain = () => {
    setGameKey((k) => k + 1); // Increment key to force fresh GameBoard remount
    setScreen("game");
  };

  const handleMenu = () => {
    setLevel(null);
    setScreen("levels");
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${dark ? "mesh-dark bg-slate-950" : "mesh-light bg-slate-50"}`}
    >
      <Controls
        dark={dark}
        toggleDark={toggleDark}
        soundOn={soundOn}
        toggleSound={toggleSound}
      />

      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <SplashScreen key="splash" dark={dark} onStart={handleStart} />
        )}

        {screen === "levels" && (
          <LevelSelect key="levels" dark={dark} onLevel={handleLevel} />
        )}

        {screen === "game" && level && (
          <GameBoard
            key={`game-${level}-${gameKey}`} // Dynamic key forces reset on play again
            dark={dark}
            level={level}
            onGameEnd={handleGameEnd}
          />
        )}

        {screen === "results" && (
          <ResultsScreen
            key="results"
            dark={dark}
            level={level}
            scores={gameResults.scores}
            stepWords={gameResults.stepWords}
            onPlayAgain={handlePlayAgain}
            onMenu={handleMenu}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none
          ${dark ? "bg-indigo-600/10" : "bg-emerald-400/10"}
          blur-3xl -translate-x-1/2 -translate-y-1/2`}
      />
      <div
        className={`fixed bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none
          ${dark ? "bg-teal-600/10" : "bg-teal-400/15"}
          blur-3xl translate-x-1/2 translate-y-1/2`}
      />
    </div>
  );
}

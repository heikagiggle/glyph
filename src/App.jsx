import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Controls from "./components/Controls";
import SplashScreen from "./components/SplashScreen";
import LevelSelect from "./components/LevelSelect";
import GameBoard from "./components/GameBoard";
import ResultsScreen from "./components/ResultsScreen";
import LevelResultScreen from "./components/LevelResultScreen";
import sound from "./utils/soundManager";

export default function App() {
  const [dark, setDark] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [screen, setScreen] = useState("splash"); 
  const [level, setLevel] = useState(null);

  const [gameResults, setGameResults] = useState({
    scores: [0, 0, 0],
    stepWords: [[], [], []],
  });

  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const unlock = () => {
      sound.unlock();
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };

    // 2. The Visibility Logic (Tab Switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Re-sync/Resume the sound engine when the user returns
        sound.unlock();
        // If music was playing before they left,
        // your sound.playMusic() logic in SoundManager
        // will handle the re-start if it was paused by the OS.
      }
    };

    // ─── Event Listeners ───
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);

    // Watch for the user leaving/returning to the tab
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleDark = () => setDark((d) => !d);
  const toggleSound = () => {
    setSoundOn((on) => {
      sound.toggle(!on);
      return !on;
    });
  };

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
    setScreen("levelResult");
  };

  const handlePlayAgain = () => {
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  const handleMenu = () => {
    setLevel(null);
    setScreen("levels");
  };
  // ✅ Added
  const handleResultDismiss = () => {
    setScreen("results");
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
            key={`game-${level}-${gameKey}`}
            dark={dark}
            level={level}
            onGameEnd={handleGameEnd}
          />
        )}

        {screen === "levelResult" && (
          <LevelResultScreen
            key="levelResult"
            dark={dark}
            level={level}
            stepWords={gameResults.stepWords}
            onDismiss={handleResultDismiss}
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

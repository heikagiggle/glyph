import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, stagger } from "../utils/variants";
import { LEVEL_CONFIG, ALPHABET } from "../utils/constants";
import LetterTile from "../components/LetterTile";
import TransitionPopup from "../components/TransitionPopup";
import sound from "../utils/soundManager";
import { isValidWord } from "../utils/wordList";

const MAX_WORDS_PER_ROUND = 10;

const GameBoard = ({ dark, level, onGameEnd }) => {
  const cfg = LEVEL_CONFIG[level];

  // ── State ──
  const [step, setStep] = useState(1);
  const [showTransition, setShowTransition] = useState(true);
  const [timeLeft, setTimeLeft] = useState(cfg.time);
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [scores, setScores] = useState([0, 0, 0]);
  const [stepWords, setStepWords] = useState([[], [], []]);
  const [flashWord, setFlashWord] = useState(null);
  const [shake, setShake] = useState(false);

  const timerRef = useRef(null);
  const stepRef = useRef(1);
  const scoresRef = useRef(scores);
  const stepWordsRef = useRef(stepWords);
  const currentStep = step - 1;
  const wordLen = cfg.steps[currentStep] ?? 2;

  const stopTimer = useCallback(() => clearInterval(timerRef.current), []);

  useEffect(() => {
    scoresRef.current = scores;
  }, [scores]);

  useEffect(() => {
    stepWordsRef.current = stepWords;
  }, [stepWords]);

  const advanceStep = useCallback(() => {
    stopTimer();

    const live = stepRef.current;

    if (live < cfg.steps.length) {
      const next = live + 1;

      setTimeout(() => {
        stepRef.current = next;

        setStep(next);
        setSelected([]);
        setCurrentWord("");
        setTimeLeft(cfg.time);
        setShowTransition(true);
      }, 400);
    } else {
      stopTimer();

      const finalScores = scoresRef.current;
      const finalWords = stepWordsRef.current;

      setTimeout(() => {
        onGameEnd(finalScores, finalWords);
      }, 0);
    }
  }, [cfg.time, stopTimer, onGameEnd, scores, stepWords]);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(cfg.time);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 5) sound.tick();
        if (t <= 1) {
          clearInterval(timerRef.current);
          advanceStep();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [cfg.time, stopTimer, advanceStep]);

  useEffect(() => {
    if (!showTransition && step > 0) startTimer();
    return stopTimer;
  }, [showTransition, step]);

  const autoSubmit = useCallback(
    (word, stepIndex, len) => {
      if (!isValidWord(word)) {
        // ── Invalid word ──
        sound.error();
        if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
        setFlashWord({ text: word, valid: false });
        setShake(true);
        setTimeout(() => {
          setFlashWord(null);
          setShake(false);
          setSelected([]);
          setCurrentWord("");
        }, 700);
        return;
      }

      // ── Valid word ──
      sound.success();
      if (navigator.vibrate) navigator.vibrate([30, 20, 60]);

      const pts = len * 2;
      setFlashWord({ text: word, valid: true });
      setTimeout(() => setFlashWord(null), 600);

      setScores((sc) => {
        const n = [...sc];
        n[stepIndex] += pts;
        return n;
      });
      setStepWords((sw) => {
        const updated = sw.map((a, i) =>
          i === stepIndex ? [...a, { word, pts }] : a,
        );
        if (updated[stepIndex].length >= MAX_WORDS_PER_ROUND) {
          setTimeout(() => advanceStep(), 650);
        }
        return updated;
      });

      setSelected([]);
      setCurrentWord("");
    },
    [advanceStep],
  );

  const handleGo = () => {
    setShowTransition(false);
    setSelected([]);
    setCurrentWord("");
  };

const handleLetterTap = (letter, idx) => {
  if (stepWords[currentStep].length >= MAX_WORDS_PER_ROUND) return;
  if (currentWord.length >= wordLen) return;

  if (navigator.vibrate) navigator.vibrate(50);
  sound.tap();

  const newWord = currentWord + letter;

  setSelected((s) => [...s, idx]);
  setCurrentWord(newWord);

  if (newWord.length === wordLen) {
    setTimeout(() => {
      autoSubmit(newWord, currentStep, wordLen);
    }, 100);
  }
};

  const handleClear = () => {
    sound.error();
    setSelected([]);
    setCurrentWord("");
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const wordsThisRound = stepWords[currentStep].length;
  const roundFull = wordsThisRound >= MAX_WORDS_PER_ROUND;

  return (
    <motion.div
      key="game"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-start min-h-screen pt-16 px-4 pb-8"
    >
      {/* ── Header ── */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div
              className={`text-xs font-bold uppercase tracking-widest
              ${dark ? "text-white/40" : "text-slate-400"}`}
            >
              {cfg.label} Mode
            </div>
            <div
              className={`text-lg font-black ${dark ? "text-white" : "text-slate-800"}`}
            >
              Round {step}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-black transition-colors duration-300
              ${timeLeft <= 5 ? "text-rose-400 timer-danger" : dark ? "text-white" : "text-slate-800"}`}
            >
              {timeLeft}s
            </div>
            <div
              className={`text-xs ${dark ? "text-white/40" : "text-slate-400"}`}
            >
              Score: {totalScore}
            </div>
          </div>
        </div>
      </div>

      {/* ── Word counter dots ── */}
      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: MAX_WORDS_PER_ROUND }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === wordsThisRound - 1 ? [1, 1.4, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            className={`w-2 h-2 rounded-full transition-colors duration-300
              ${
                i < wordsThisRound
                  ? "bg-emerald-400"
                  : dark
                    ? "bg-white/15"
                    : "bg-gray-300"
              }`}
          />
        ))}
      </div>

      {/* ── Current Word Display ── */}
      <motion.div
        layout
        animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md mb-5 p-4 rounded-xl text-center min-h-16
          flex items-center justify-center gap-1 relative overflow-hidden
          ${dark ? "bg-white/5 border border-white/10" : "bg-white/80 border border-gray-200"}
          ${shake ? (dark ? "border-rose-500/60 bg-rose-500/10" : "border-rose-400 bg-rose-50") : ""}
          backdrop-blur-sm shadow-inner transition-colors duration-200`}
      >
        {/* Flash overlay */}
        <AnimatePresence>
          {flashWord && (
            <motion.div
              key="flash"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.2 }}
              className={`absolute inset-0 flex items-center justify-center z-10 rounded-xl
                ${flashWord.valid ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
            >
              <span
                className={`text-2xl font-black
                ${flashWord.valid ? "text-emerald-400" : "text-rose-400"}`}
              >
                {flashWord.valid
                  ? `✓ ${flashWord.text}`
                  : `✗ ${flashWord.text}`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {roundFull ? (
            <motion.span
              key="full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-bold text-emerald-400"
            >
              🎉 Round complete! Moving up…
            </motion.span>
          ) : currentWord.length > 0 ? (
            currentWord.split("").map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ scale: 0, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`text-3xl font-black inline-block
                  ${
                    shake
                      ? "bg-linear-to-br from-rose-400 to-red-400 bg-clip-text text-transparent"
                      : "bg-linear-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent"
                  }`}
              >
                {ch}
              </motion.span>
            ))
          ) : (
            <motion.span
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}
            >
              Tap {wordLen} letters
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Letter Grid ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className={`flex flex-wrap justify-center items-center gap-x-6 gap-y-8 mb-6 w-full max-w-2xl mx-auto
          ${roundFull ? "opacity-30 pointer-events-none" : ""}`}
      >
        {ALPHABET.map((letter, i) => (
          <LetterTile
            key={letter}
            letter={letter}
            index={i}
            isSelected={selected.includes(i)}
            onClick={() => handleLetterTap(letter, i)}
          />
        ))}
      </motion.div>

      {/* Hint text */}
      <p
        className={`text-xs mb-4 ${dark ? "text-white/25" : "text-slate-400"}`}
      >
        Words auto-submit when you tap the {wordLen}
        {wordLen === 2 ? "nd" : wordLen === 3 ? "rd" : "th"} letter
      </p>

      {/* ── Words scored this step ── */}
      <AnimatePresence>
        {stepWords[currentStep].length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`w-full max-w-md p-3 rounded-xl flex flex-wrap gap-2
              ${dark ? "bg-white/5 border border-white/10" : "bg-emerald-50/80 border border-emerald-100"}`}
          >
            {stepWords[currentStep].map((w, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold
                  bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
              >
                {w.word} <span className="opacity-70">+{w.pts}</span>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step Transition Popup ── */}
      <AnimatePresence>
        {showTransition && (
          <TransitionPopup
            dark={dark}
            step={step}
            wordLen={wordLen}
            onGo={handleGo}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameBoard;

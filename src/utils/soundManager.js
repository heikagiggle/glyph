// Robust audio engine that handles browser autoplay policy correctly.
//
// KEY RULES browsers enforce:
//  1. AudioContext must be created/resumed INSIDE a user-gesture handler.
//  2. Audio elements need .play() called inside or directly after a gesture.
//  3. A suspended AudioContext silently swallows all beeps — must resume first.
//
// STRATEGY:
//  - _unlock() is called on every user interaction (tap, click, keydown).
//    It creates + resumes the AudioContext and plays/unpauses bg music.
//  - All beep calls run through _ensureCtx() which resumes if suspended.
//  - Music is managed via a plain <audio> element (most reliable for looping mp3).
//  - We keep one AudioContext alive for the whole session (never recreate).

class SoundManager {
  constructor() {
    this.ctx = null; // AudioContext — created once, kept alive
    this.muted = false;
    this.bgAudio = null; // <audio> element for bg music
    this.unlocked = false; // true once a gesture has fired _unlock()
    this._pendingMusic = false; // playMusic() called before unlock?
  }

  _ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this._ensureCtx();

    if (this._pendingMusic && !this.muted) {
      this._startBgAudio();
    }
  }

  // ── Background music ───────────────────────────────────────────────────────
  _startBgAudio() {
    if (!this.bgAudio) {
      this.bgAudio = new Audio("/bg-music.mp3");
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.18;
    }

    // Resume AudioContext first (belt-and-suspenders)
    const ctx = this._ensureCtx();
    const tryPlay = () => {
      this.bgAudio.play().catch(() => {
        // Autoplay still blocked — will retry on next user gesture via unlock()
        this._pendingMusic = true;
      });
    };

    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(tryPlay)
        .catch(() => {});
    } else {
      tryPlay();
    }
  }

  playMusic() {
    if (this.muted) return;

    if (!this.unlocked) {
      // Gesture hasn't happened yet — flag it so unlock() fires it
      this._pendingMusic = true;
      return;
    }

    if (this.bgAudio && !this.bgAudio.paused) return; // already playing
    this._startBgAudio();
  }

  pauseMusic() {
    this.bgAudio?.pause();
  }

  stopMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }
  }

  // ── Oscillator beeps ───────────────────────────────────────────────────────
  beep(freq = 440, dur = 0.08, type = "sine", vol = 0.25) {
    if (this.muted) return;
    try {
      const ctx = this._ensureCtx();
      if (ctx.state === "suspended") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur);
    } catch (_) {}
  }

  tap() {
    this.beep(880, 0.07, "triangle", 0.2);
  }
  select() {
    this.beep(660, 0.12, "sine", 0.25);
  }
  success() {
    [440, 550, 660].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.12, "sine", 0.3), i * 80),
    );
  }
  error() {
    this.beep(200, 0.18, "sawtooth", 0.2);
  }
  tick() {
    this.beep(300, 0.05, "square", 0.1);
  }

  // ── Mute toggle ────────────────────────────────────────────────────────────
  // v = true  → sound ON
  // v = false → sound OFF
  toggle(v) {
    this.muted = !v;
    if (this.muted) {
      this.pauseMusic();
    } else {
      if (this.bgAudio) {
        this.playMusic();
      }
    }
  }
}

const sound = new SoundManager();
export default sound;

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgGain = null;
    this.bgAudio = null; // To store the <audio> element
    this.source = null;  // To store the media source
  }

  _ctx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.bgGain = this.ctx.createGain();
      this.bgGain.gain.value = 0.15; // Lower volume for background music
      this.bgGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  // ─── BACKGROUND MUSIC ───
  playMusic() {
    if (this.muted) return;
    const ctx = this._ctx();

    // If already playing, don't start again
    if (this.bgAudio) {
      if (this.bgAudio.paused) this.bgAudio.play();
      return;
    }

    // 1. Create the Audio Element
    // Ensure the song is in /public/sounds/bg-music.mp3
    this.bgAudio = new Audio("/bg-music.mp3");
    this.bgAudio.loop = true;
    this.bgAudio.crossOrigin = "anonymous";

    // 2. Connect the Audio Element to the Web Audio Context
    this.source = ctx.createMediaElementSource(this.bgAudio);
    this.source.connect(this.bgGain);

    // 3. Play
    if (ctx.state === "suspended") {
      ctx.resume().then(() => this.bgAudio.play());
    } else {
      this.bgAudio.play();
    }
  }

  stopMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }
  }

  // ─── EXISTING OSCILLATOR BEEPS ───
  beep(freq = 440, dur = 0.08, type = "sine", vol = 0.25) {
    if (this.muted) return;
    try {
      const ctx = this._ctx();
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

  tap()     { this.beep(880, 0.07, "triangle", 0.2); }
  select()  { this.beep(660, 0.12, "sine",     0.25); }
  success() { [440, 550, 660].forEach((f, i) => setTimeout(() => this.beep(f, 0.12, "sine", 0.3), i * 80)); }
  error()   { this.beep(200, 0.18, "sawtooth", 0.2); }
  tick()    { this.beep(300, 0.05, "square",   0.1); }

  toggle(v) { 
    this.muted = !v; 
    if (this.muted) {
      this.bgAudio?.pause();
    } else {
      this.bgAudio?.play();
    }
  }
}

const sound = new SoundManager();
export default sound;

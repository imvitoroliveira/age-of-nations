// Web Audio API sound effects for kids — no external dependencies
const ctx = () => {
  if (!(window as any).__kidAudioCtx) {
    (window as any).__kidAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__kidAudioCtx as AudioContext;
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) {
  const c = ctx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

function playNotes(notes: [number, number][], type: OscillatorType = 'sine', gain = 0.25) {
  const c = ctx();
  let t = c.currentTime;
  notes.forEach(([freq, dur]) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur);
    t += dur * 0.75;
  });
}

/** Happy ascending chime — correct answer */
export function playCorrect() {
  playNotes([
    [523, 0.12], // C5
    [659, 0.12], // E5
    [784, 0.18], // G5
    [1047, 0.3], // C6
  ], 'sine', 0.22);
}

/** Soft descending buzz — wrong answer */
export function playWrong() {
  playNotes([
    [330, 0.15], // E4
    [262, 0.25], // C4
  ], 'triangle', 0.18);
}

/** Cash register / coin sound — purchase */
export function playBuy() {
  playNotes([
    [880, 0.08],  // A5
    [1109, 0.08], // C#6
    [1319, 0.15], // E6
  ], 'square', 0.12);
  setTimeout(() => playTone(1568, 0.2, 'sine', 0.15), 150);
}

/** Fanfare — achievement unlocked */
export function playAchievement() {
  playNotes([
    [523, 0.15],  // C5
    [659, 0.15],  // E5
    [784, 0.15],  // G5
    [1047, 0.15], // C6
    [784, 0.1],   // G5
    [1047, 0.35], // C6
  ], 'sine', 0.2);
}

/** Soft pop — button tap / place item */
export function playTap() {
  playTone(660, 0.08, 'sine', 0.15);
}

// ---------- Shared audio context (created lazily on first user interaction) ----------
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ---------- Typing blip sound ----------
function playTypeBlip() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 520 + Math.random() * 80;
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (e) { /* audio not available yet, ignore */ }
}

// ---------- Background music (synthesized ambient pad that drifts between chords) ----------
let musicNodes = null;

// A slow chord progression, so the pad actually moves instead of droning on one chord.
const chordProgression = [
  [196.00, 246.94, 293.66, 392.00], // G3  B3  D4  G4
  [174.61, 220.00, 261.63, 349.23], // F3  A3  C4  F4
  [220.00, 261.63, 329.63, 440.00], // A3  C4  E4  A4
  [196.00, 233.08, 293.66, 349.23], // G3  Bb3 D4  F4
];
const CHORD_HOLD_SECONDS = 9;   // how long each chord sits before drifting
const CHORD_GLIDE_SECONDS = 4;  // how long the glide between chords takes

function startMusic() {
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 1.5);

  let chordIndex = 0;
  const startChord = chordProgression[0];

  const oscs = startChord.map((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.5 / startChord.length;

    // Slow vibrato per note so sustained tones don't feel static
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08 + i * 0.025;
    lfoGain.gain.value = 2.2;
    lfo.connect(lfoGain).connect(osc.frequency);

    osc.connect(gain).connect(master);
    osc.start(); lfo.start();
    return { osc, lfo, gain };
  });

  // Every few seconds, glide each oscillator's pitch to the next chord in the progression.
  const intervalId = setInterval(() => {
    chordIndex = (chordIndex + 1) % chordProgression.length;
    const nextChord = chordProgression[chordIndex];
    oscs.forEach((node, i) => {
      node.osc.frequency.cancelScheduledValues(ctx.currentTime);
      node.osc.frequency.setValueAtTime(node.osc.frequency.value, ctx.currentTime);
      node.osc.frequency.linearRampToValueAtTime(nextChord[i], ctx.currentTime + CHORD_GLIDE_SECONDS);
    });
    // A gentle breath in volume on each chord change, so it feels like it's "moving"
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.04, ctx.currentTime + CHORD_GLIDE_SECONDS / 2);
    master.gain.linearRampToValueAtTime(0.055, ctx.currentTime + CHORD_GLIDE_SECONDS);
  }, (CHORD_HOLD_SECONDS + CHORD_GLIDE_SECONDS) * 1000);

  musicNodes = { master, oscs, intervalId };
}

function stopMusic() {
  if (!musicNodes) return;
  const { master, oscs, intervalId } = musicNodes;
  const ctx = getAudioCtx();
  clearInterval(intervalId);
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
  setTimeout(() => oscs.forEach(o => { o.osc.stop(); o.lfo.stop(); }), 900);
  musicNodes = null;
}

const musicBtn = document.getElementById('music-toggle');
if (musicBtn) {
  const isOn = localStorage.getItem('musicOn') === 'true';
  musicBtn.textContent = isOn ? '🔊' : '🔇';
  if (isOn) musicBtn.classList.add('playing');

  musicBtn.addEventListener('click', () => {
    const nowOn = !musicBtn.classList.contains('playing');
    musicBtn.classList.toggle('playing', nowOn);
    musicBtn.textContent = nowOn ? '🔊' : '🔇';
    localStorage.setItem('musicOn', nowOn);
    if (nowOn) startMusic(); else stopMusic();
  });

  // Best-effort resume across page navigation (needs a click first due to browser autoplay rules)
  if (isOn) {
    const resumeOnce = () => { startMusic(); document.removeEventListener('click', resumeOnce); };
    document.addEventListener('click', resumeOnce, { once: true });
  }
}

// ---------- Active nav link ----------
const currentFile = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentFile) link.classList.add('active');
});

// ---------- Typing effect in hero (home page only) ----------
const typedEl = document.getElementById('typed');
if (typedEl) {
  const phrases = ["then I teach it.", "and explain every line.", "no frameworks needed."];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIndex);
      playTypeBlip();
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1400);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 40 : 70);
  }
  type();
}

// ---------- Tabs (learn page only) ----------
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ---------- Live playground (playground page only) ----------
const htmlInput = document.getElementById('html-input');
const cssInput = document.getElementById('css-input');
const preview = document.getElementById('preview');
if (htmlInput && cssInput && preview) {
  function updatePreview() {
    const doc = `<!DOCTYPE html><html><head><style>${cssInput.value}</style></head><body>${htmlInput.value}</body></html>`;
    preview.srcdoc = doc;
  }
  htmlInput.addEventListener('input', updatePreview);
  cssInput.addEventListener('input', updatePreview);
  updatePreview();
}

// ---------- Reveal sections on scroll ----------
const revealTargets = document.querySelectorAll('.section, .hero-content, .page-banner');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

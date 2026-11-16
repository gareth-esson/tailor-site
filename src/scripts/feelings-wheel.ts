/**
 * Feelings wheel: picks a feeling at random, game-show style.
 * Page: src/pages/tools/feelings-wheel/index.astro
 *
 * A spin lights feelings one after another, slowing down, and stops on
 * one chosen at random from those in play. The choice is made before the
 * lights start, so every feeling in play is equally likely however the
 * animation runs. With "No repeats" on, a chosen feeling sits out until
 * the room starts again.
 *
 * Built for a shared screen: Space, Enter, the arrow keys and Page Down
 * all spin, which is what presentation clickers send.
 */

type Ring = 'family' | 'inner' | 'outer';
type Level = Ring | 'all';

interface Feeling {
  id: string;
  word: string;
  ring: Ring;
  family: string;
  familyName: string;
}

const SOUND_KEY = 'feelings-wheel:sound';
const SPIN_KEYS = new Set([' ', 'Enter', 'ArrowRight', 'ArrowDown', 'PageDown']);
const LEVEL_KEYS: Record<string, Level> = { 1: 'family', 2: 'inner', 3: 'outer', 4: 'all' };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function readSound(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

function saveSound(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  } catch {
    // Private windows can refuse storage; the setting just won't stick.
  }
}

/** Short synthesised sounds, so the page needs no audio files. */
function makeSounds() {
  let ctx: AudioContext | null = null;
  const audio = () => {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = Ctor ? new Ctor() : null;
    }
    return ctx;
  };

  function tone(freq: number, start: number, length: number, volume: number, type: OscillatorType) {
    const ac = audio();
    if (!ac) return;
    const t = ac.currentTime + start;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + length);
  }

  return {
    tick: () => tone(1400, 0, 0.04, 0.05, 'triangle'),
    land: () => {
      tone(660, 0, 0.3, 0.12, 'sine');
      tone(990, 0.12, 0.45, 0.12, 'sine');
    },
  };
}

export function initFeelingsWheel() {
  const root = document.getElementById('fw');
  const dataEl = document.getElementById('fw-data');
  if (!root || !dataEl) return;

  const data = JSON.parse(dataEl.textContent ?? '{}') as {
    words: Feeling[];
    faces: Record<string, string>;
  };

  const wheel = document.getElementById('fw-wheel') as unknown as SVGSVGElement;
  const hub = wheel.querySelector('.fw-hub');
  const segments = new Map<string, SVGGElement>();
  wheel.querySelectorAll<SVGGElement>('.fw-seg').forEach((g) => segments.set(g.dataset.id ?? '', g));

  const result = document.getElementById('fw-result') as HTMLElement;
  const resultWord = document.getElementById('fw-result-word') as HTMLElement;
  const resultFace = document.getElementById('fw-result-face') as unknown as SVGSVGElement;
  const resultFamily = document.getElementById('fw-result-family-name') as HTMLElement;
  const announce = document.getElementById('fw-announce') as HTMLElement;
  const spinBtn = document.getElementById('fw-spin') as HTMLButtonElement;
  const noRepeat = document.getElementById('fw-no-repeat') as HTMLInputElement;
  const left = document.getElementById('fw-left') as HTMLElement;
  const resetBtn = document.getElementById('fw-reset') as HTMLButtonElement;
  const soundBtn = document.getElementById('fw-sound') as HTMLButtonElement;
  const fullBtn = document.getElementById('fw-fullscreen') as HTMLButtonElement;
  const levelBtns = [...root.querySelectorAll<HTMLButtonElement>('.fw-level')];

  const sounds = makeSounds();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let level: Level = 'family';
  let spinning = false;
  let lit: string | null = null;
  let picked: string | null = null;
  let soundOn = readSound();
  const used = new Set<string>();

  const inPlay = () => data.words.filter((w) => level === 'all' || w.ring === level);
  const available = () => (noRepeat.checked ? inPlay().filter((w) => !used.has(w.id)) : inPlay());

  function showLeft() {
    if (!noRepeat.checked) {
      left.textContent = '';
      return;
    }
    const total = inPlay().length;
    left.textContent = `${available().length} of ${total} left`;
  }

  function light(id: string | null) {
    if (lit) segments.get(lit)?.classList.remove('is-lit');
    lit = id;
    if (id) segments.get(id)?.classList.add('is-lit');
  }

  function clearPicked() {
    if (picked) segments.get(picked)?.classList.remove('is-picked');
    picked = null;
    light(null);
  }

  function showFeeling(f: Feeling, state: 'rolling' | 'picked') {
    result.dataset.state = state;
    result.style.setProperty('--fw', `var(--fw-${f.family})`);
    result.style.setProperty('--fw-len', String(f.word.length));
    result.toggleAttribute('data-dark-ink', segments.get(f.id)?.hasAttribute('data-dark-ink') ?? false);
    resultFace.innerHTML = data.faces[f.family] ?? '';
    resultFamily.textContent = f.ring === 'family' ? 'Feeling family' : f.familyName;
    resultWord.textContent = f.word;
  }

  function showReady(message = 'Spin to pick a feeling') {
    result.dataset.state = 'ready';
    result.style.removeProperty('--fw');
    result.removeAttribute('data-dark-ink');
    resultFace.innerHTML = '';
    resultFamily.textContent = '';
    resultWord.textContent = message;
  }

  function startAgain() {
    if (spinning) return;
    used.clear();
    segments.forEach((g) => g.classList.remove('is-used'));
    clearPicked();
    showReady();
    showLeft();
  }

  function setLevel(next: Level) {
    if (spinning || next === level) return;
    level = next;
    root!.dataset.level = next;
    levelBtns.forEach((b) => {
      const on = b.dataset.level === next;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    clearPicked();
    showReady();
    showLeft();
  }

  async function spin() {
    if (spinning) return;
    let candidates = available();
    if (candidates.length === 0) {
      // Everything in play has been drawn: put this level's feelings back.
      inPlay().forEach((w) => {
        used.delete(w.id);
        segments.get(w.id)?.classList.remove('is-used');
      });
      candidates = available();
    }

    spinning = true;
    clearPicked();
    const target = pick(candidates);

    // The lights hop over what could be drawn. With one feeling left they
    // hop over the whole level instead, so the last draw still feels like
    // a spin; the result was fixed above either way.
    const hopOver = candidates.length > 1 ? candidates : inPlay();
    if (!reducedMotion.matches && hopOver.length > 1) {
      const hops = 20 + Math.floor(Math.random() * 6);
      let previous: Feeling | null = null;
      for (let i = 0; i < hops; i += 1) {
        // Never the same feeling twice running, and never the target just
        // before it lands, so the last hop always visibly moves.
        const options = hopOver.filter((w) => w !== previous && (i < hops - 1 ? true : w !== target));
        const f = pick(options.length ? options : hopOver);
        previous = f;
        light(f.id);
        showFeeling(f, 'rolling');
        if (soundOn) sounds.tick();
        await wait(45 + 380 * (i / (hops - 1)) ** 2.6);
      }
    }

    land(target);
    spinning = false;
  }

  function land(f: Feeling) {
    light(f.id);
    const seg = segments.get(f.id);
    if (seg) {
      // Draw it last, so its outline and pop sit above its neighbours.
      wheel.insertBefore(seg, hub);
      seg.classList.add('is-picked');
    }
    picked = f.id;
    if (noRepeat.checked) {
      used.add(f.id);
      seg?.classList.add('is-used');
    }
    showFeeling(f, 'picked');
    if (soundOn) sounds.land();
    announce.textContent = f.ring === 'family' ? `${f.word}.` : `${f.word}, from the ${f.familyName} family.`;
    showLeft();
  }

  function setSound(on: boolean) {
    soundOn = on;
    saveSound(on);
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.textContent = on ? 'Sound on' : 'Sound off';
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  // ── Wiring ────────────────────────────────────────────────────────
  spinBtn.addEventListener('click', spin);
  resetBtn.addEventListener('click', startAgain);
  noRepeat.addEventListener('change', startAgain);
  levelBtns.forEach((b) => b.addEventListener('click', () => setLevel(b.dataset.level as Level)));
  soundBtn.addEventListener('click', () => setSound(!soundOn));
  setSound(soundOn);

  if (document.fullscreenEnabled) {
    fullBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => {
      fullBtn.textContent = document.fullscreenElement ? 'Leave full screen' : 'Full screen';
    });
  } else {
    fullBtn.hidden = true;
  }

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const onControl = (e.target as HTMLElement).closest('button, input, select, textarea, a');
    if (SPIN_KEYS.has(e.key)) {
      // Space and Enter belong to a focused control; clicker keys never do.
      if (onControl && (e.key === ' ' || e.key === 'Enter')) return;
      e.preventDefault();
      if (!e.repeat) spin();
    } else if (LEVEL_KEYS[e.key]) {
      setLevel(LEVEL_KEYS[e.key]);
    } else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenEnabled) toggleFullscreen();
    } else if (e.key === 'm' || e.key === 'M') {
      setSound(!soundOn);
    }
  });

  showLeft();
}

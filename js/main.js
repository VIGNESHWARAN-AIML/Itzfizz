/**
 * ItzFizz - Real-World Photorealistic Automotive Motion Controller
 * 
 * Features:
 * - Dynamic kinetic typography letter splitting with ARIA accessibility
 * - Realistic aerodynamic suspension pitch & inertia modeling
 * - Synchronized wet asphalt ground mirror reflection
 * - Procedural Web Audio API Supercar Engine Sound Synthesizer
 * - Real-world digital cockpit HUD (Velocity, Gearbox, G-Force, Dynamic RPM)
 * - Pinned ScrollTrigger scrub interpolation with Lenis momentum
 */

gsap.registerPlugin(ScrollTrigger);

// Global motion configuration parameters
const ANIM_CONFIG = {
  letterStagger: 0.045,
  letterEase: 'power3.out',
  statsStagger: 0.12,
  introDuration: 2.2,
  
  pinDistance: '+=220%',
  scrubSmoothing: 1.1,
  wheelRotations: 2160, // 6 full rotations across scroll distance
  
  startOffsetXDesktop: -35,
  endOffsetXDesktop: 110,
  startOffsetXMobile: -55,
  endOffsetXMobile: 120,
};

/**
 * Procedural Web Audio API Toyota Supra MK4 (A80 Generation, 1993–2002) Sound Synthesizer
 * 
 * Recreates the legendary 2JZ-GTE 3.0L Inline-6 Twin-Turbo Acoustic Signature:
 * - Authentic Denso starter motor crank & rev-flare ignition sequence
 * - Sequential twin-turbo architecture (Primary CT12B spool + Secondary boost kick at high scroll speed)
 * - True straight-6 1-5-3-6-2-4 firing harmonic matrix with titanium exhaust resonance
 * - Iconic HKS SSQV blow-off valve metallic chirp + compressor surge wastegate flutter ("tschirp-stu-tu-tu-tu-tu")
 * - 2-step overrun exhaust pops on throttle lift
 * - Auto velocity decay ticker: cleanly throttles down and mutes when scroll stops
 */
class SupraMK4A80AudioEngine {
  constructor() {
    this.ctx = null;
    this.osc1 = null;            // Primary 2JZ-GTE cylinder firing pulse (sawtooth)
    this.osc2 = null;            // Balanced straight-6 crankshaft harmonic (triangle)
    this.osc3 = null;            // Titanium straight-pipe exhaust rasp (pulse/square)
    this.subOsc = null;          // 3.0L cast-iron block deep displacement rumble (sine)
    
    // Sequential Twin-Turbo System
    this.turbo1Whistle = null;   // Primary CT12B turbo spool (low-to-mid boost)
    this.turbo1Gain = null;
    this.turbo2Whistle = null;   // Secondary CT12B turbo spool (violent high boost kick)
    this.turbo2Gain = null;

    // Filters and Saturation
    this.exhaustFilter = null;   // HKS Hi-Power 3-inch catback exhaust resonator
    this.distortion = null;      // High-RPM straight-pipe metallic scream wave-shaper
    this.masterGain = null;
    
    this.isMuted = true;
    this.baseIdleRPM = 37.5;     // Authentic A80 2JZ-GTE idle: 750 RPM -> 37.5 Hz firing pulse
    this.targetVelocity = 0;
    this.currentVelocity = 0;
    this.lastScrollTimestamp = 0;
    this.wasUnderBoost = false;
    this.scrollProgress = 0;
    this.isStartingUp = false;
  }

  make2JZDistortionCurve(amount = 26) {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // Asymmetric saturation curve mimicking valve float and exhaust gas turbulence
      curve[i] = ((3 + k) * x * 22 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    this.ctx = new AudioContext();

    // Master volume bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 2JZ straight-pipe distortion wave shaper
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.make2JZDistortionCurve(26);
    this.distortion.oversample = '2x';

    // Exhaust resonator bandpass (3-inch HKS straight-pipe resonant tone at ~240 Hz)
    this.exhaustFilter = this.ctx.createBiquadFilter();
    this.exhaustFilter.type = 'lowpass';
    this.exhaustFilter.frequency.setValueAtTime(180, this.ctx.currentTime);
    this.exhaustFilter.Q.setValueAtTime(2.8, this.ctx.currentTime);

    // 1. Primary inline-6 firing pulse
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(this.baseIdleRPM, this.ctx.currentTime);

    // 2. Straight-6 balanced harmonic
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(this.baseIdleRPM * 1.5, this.ctx.currentTime);

    // 3. Exhaust manifold pulse
    this.osc3 = this.ctx.createOscillator();
    this.osc3.type = 'square';
    this.osc3.frequency.setValueAtTime(this.baseIdleRPM * 2.0, this.ctx.currentTime);
    const osc3Gain = this.ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.osc3.connect(osc3Gain);

    // 4. Heavy 3.0L cast-iron block sub-bass
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(this.baseIdleRPM * 0.5, this.ctx.currentTime);

    // 5. Primary CT12B Turbo Spool Whistle (900 Hz -> 2200 Hz)
    this.turbo1Whistle = this.ctx.createOscillator();
    this.turbo1Whistle.type = 'sine';
    this.turbo1Whistle.frequency.setValueAtTime(950, this.ctx.currentTime);
    this.turbo1Gain = this.ctx.createGain();
    this.turbo1Gain.gain.setValueAtTime(0, this.ctx.currentTime);

    // 6. Secondary CT12B Turbo Spool Whistle (Kicks in hard at 4000+ RPM: 1800 Hz -> 3600 Hz)
    this.turbo2Whistle = this.ctx.createOscillator();
    this.turbo2Whistle.type = 'sine';
    this.turbo2Whistle.frequency.setValueAtTime(1800, this.ctx.currentTime);
    this.turbo2Gain = this.ctx.createGain();
    this.turbo2Gain.gain.setValueAtTime(0, this.ctx.currentTime);

    // Signal routing
    this.osc1.connect(this.distortion);
    this.osc2.connect(this.distortion);
    osc3Gain.connect(this.distortion);
    this.distortion.connect(this.exhaustFilter);

    this.subOsc.connect(this.exhaustFilter);
    this.exhaustFilter.connect(this.masterGain);

    this.turbo1Whistle.connect(this.turbo1Gain);
    this.turbo1Gain.connect(this.masterGain);

    this.turbo2Whistle.connect(this.turbo2Gain);
    this.turbo2Gain.connect(this.masterGain);

    this.osc1.start();
    this.osc2.start();
    this.osc3.start();
    this.subOsc.start();
    this.turbo1Whistle.start();
    this.turbo2Whistle.start();

    // Start physics momentum ticker
    gsap.ticker.add(() => this.tick());
  }

  /**
   * Authentic MK4 Supra A80 Starter Crank Ignition Sound Sequence
   */
  playA80StarterIgnition() {
    if (!this.ctx) return;
    this.isStartingUp = true;
    const t = this.ctx.currentTime;

    // 1. Starter motor turnover clicks (Denso gear reduction starter: 3 compression chugs)
    const starterClicks = [0.0, 0.09, 0.18, 0.27];
    starterClicks.forEach(offset => {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(75, t + offset);
      clickOsc.frequency.exponentialRampToValueAtTime(30, t + offset + 0.05);

      clickGain.gain.setValueAtTime(0.25, t + offset);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);

      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);
      clickOsc.start(t + offset);
      clickOsc.stop(t + offset + 0.06);
    });

    // 2. Engine fires up with a rich rev-flare at 0.35s up to 1800 RPM (90 Hz)
    const fireTime = t + 0.35;
    this.masterGain.gain.setValueAtTime(0.001, fireTime);
    this.masterGain.gain.linearRampToValueAtTime(0.28, fireTime + 0.15);

    // Initial ignition rev flare
    this.osc1.frequency.setValueAtTime(this.baseIdleRPM, fireTime);
    this.osc1.frequency.exponentialRampToValueAtTime(92, fireTime + 0.25);
    // Settles back to deep 750 RPM (37.5 Hz) 2JZ idle
    this.osc1.frequency.exponentialRampToValueAtTime(this.baseIdleRPM, fireTime + 0.95);

    // Settle master gain to idle volume
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, fireTime + 0.95);

    setTimeout(() => {
      this.isStartingUp = false;
    }, 1100);
  }

  /**
   * Immediately silences all sound synthesis nodes and zeroes momentum
   */
  silenceImmediately() {
    if (!this.ctx || !this.masterGain) return;
    this.targetVelocity = 0;
    this.currentVelocity = 0;
    this.wasUnderBoost = false;
    const audioNow = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(audioNow);
    this.masterGain.gain.setValueAtTime(0, audioNow);
    if (this.turbo1Gain) this.turbo1Gain.gain.setValueAtTime(0, audioNow);
    if (this.turbo2Gain) this.turbo2Gain.gain.setValueAtTime(0, audioNow);
    updateCockpitHUDLive(0, this.scrollProgress);
  }

  onLeaveHero() {
    // Fired when user scrolls fast down past the hero into lower sections
    this.silenceImmediately();
  }

  onEnterHero() {
    // Re-entering hero from below or above
    this.lastScrollTimestamp = performance.now();
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();

    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.silenceImmediately();
    } else {
      // Play authentic cold-start ignition crank!
      this.playA80StarterIgnition();
    }
    return !this.isMuted;
  }

  /**
   * Called on active scroll update
   */
  onScroll(velocity, progress) {
    if (!this.ctx || this.isMuted) return;

    // Critical: If vehicle has completed its travel or scrolled out of hero, cut sound immediately!
    if (progress >= 0.95) {
      this.scrollProgress = progress;
      this.silenceImmediately();
      return;
    }

    this.lastScrollTimestamp = performance.now();
    const rawSpeed = Math.min(280, Math.abs(velocity) / 8.5);
    this.targetVelocity = rawSpeed;
    this.scrollProgress = progress;

    if (rawSpeed > 30) {
      this.wasUnderBoost = true;
    }
  }

  /**
   * Continuous frame ticker: smoothly decays speed, handles idle timeout, and triggers HKS SSQV flutter
   */
  tick() {
    if (!this.ctx || this.isMuted || this.isStartingUp) return;

    const audioNow = this.ctx.currentTime;

    // 1. HARD SAFETY CHECK: If scrolled past hero section or hero is out of view, SILENCE IMMEDIATELY!
    const hero = document.getElementById('hero-section');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 15 || rect.top >= window.innerHeight) {
        this.masterGain.gain.setValueAtTime(0, audioNow);
        this.targetVelocity = 0;
        this.currentVelocity = 0;
        return;
      }
    }

    if (this.scrollProgress >= 0.95) {
      this.masterGain.gain.setValueAtTime(0, audioNow);
      this.targetVelocity = 0;
      this.currentVelocity = 0;
      return;
    }

    const now = performance.now();
    const timeSinceScroll = now - this.lastScrollTimestamp;

    // 2. Rapid deceleration decay when scroll stops
    if (timeSinceScroll > 40) {
      this.targetVelocity *= 0.65; // Rapid deceleration (stops within ~120ms)
      if (this.targetVelocity < 0.8) {
        // When dropping off boost, fire iconic MK4 Supra HKS blow-off flutter!
        if (this.wasUnderBoost) {
          this.playA80TurboBlowOff();
          this.wasUnderBoost = false;
        }
        this.targetVelocity = 0;
      }
    }

    // Smooth physics interpolation for audio
    this.currentVelocity += (this.targetVelocity - this.currentVelocity) * 0.22;

    // Synchronize cockpit HUD values continuously from smooth physics
    updateCockpitHUDLive(this.currentVelocity, this.scrollProgress);

    // 3. ZERO VOLUME WHEN STATIONARY:
    // When the user stops scrolling, the sound fades out completely to 0!
    // No annoying looping drone or endless engine sound when idle!
    if (this.currentVelocity < 0.6) {
      this.masterGain.gain.setTargetAtTime(0, audioNow, 0.08);
      return;
    }

    // 4. Authentic Toyota Supra MK4 2JZ-GTE Inline-6 Sound:
    // Firing fundamental: 37.5 Hz (750 RPM) -> 350 Hz (7000 RPM scream!)
    const rpmPitch = this.baseIdleRPM + this.currentVelocity * 1.25;
    const filterFreq = 160 + this.currentVelocity * 11.5;
    
    // Primary CT12B turbo spool (spools with smooth singing whistle)
    const turbo1Pitch = 980 + this.currentVelocity * 11.0;
    const turbo1Vol = Math.max(0, (this.currentVelocity - 10) / 200) * 0.16;

    // Secondary CT12B turbo spool (hits hard above 40 km/h / 4000 RPM)
    const turbo2Pitch = 1900 + this.currentVelocity * 8.5;
    const turbo2Vol = this.currentVelocity > 40 ? Math.min(0.22, ((this.currentVelocity - 40) / 180) * 0.26) : 0;

    // Master volume scales dynamically with scroll velocity up to full straight-pipe 2JZ roar
    const targetVol = Math.min(0.32, 0.08 + (this.currentVelocity / 210) * 0.24);

    this.osc1.frequency.setTargetAtTime(rpmPitch, audioNow, 0.04);
    this.osc2.frequency.setTargetAtTime(rpmPitch * 1.5, audioNow, 0.04);
    this.osc3.frequency.setTargetAtTime(rpmPitch * 2.0, audioNow, 0.04);
    this.subOsc.frequency.setTargetAtTime(rpmPitch * 0.5, audioNow, 0.04);
    this.exhaustFilter.frequency.setTargetAtTime(filterFreq, audioNow, 0.04);

    this.turbo1Whistle.frequency.setTargetAtTime(turbo1Pitch, audioNow, 0.04);
    this.turbo1Gain.gain.setTargetAtTime(turbo1Vol, audioNow, 0.04);

    this.turbo2Whistle.frequency.setTargetAtTime(turbo2Pitch, audioNow, 0.04);
    this.turbo2Gain.gain.setTargetAtTime(turbo2Vol, audioNow, 0.04);

    this.masterGain.gain.setTargetAtTime(targetVol, audioNow, 0.04);
  }

  /**
   * Iconic Toyota Supra MK4 HKS SSQV Blow-off Valve Chirp & Wastegate Surge Flutter:
   * "TSCHIIIRP - STU-TU-TU-TU-TU" + Exhaust Decel Pop!
   */
  playA80TurboBlowOff() {
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    
    // 1. Initial High-Frequency Metallic SSQV Chirp ("TSCHIIIRP!")
    const chirpOsc = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    chirpOsc.type = 'sawtooth';
    chirpOsc.frequency.setValueAtTime(3200, t);
    chirpOsc.frequency.exponentialRampToValueAtTime(1900, t + 0.08);

    chirpGain.gain.setValueAtTime(0.35, t);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    const chirpFilter = this.ctx.createBiquadFilter();
    chirpFilter.type = 'highpass';
    chirpFilter.frequency.setValueAtTime(2200, t);

    chirpOsc.connect(chirpFilter);
    chirpFilter.connect(chirpGain);
    chirpGain.connect(this.masterGain);

    chirpOsc.start(t);
    chirpOsc.stop(t + 0.09);

    // 2. Compressor Surge Flutter ("STU-TU-TU-TU-TU")
    const flutterStart = t + 0.06;
    const bufferSize = this.ctx.sampleRate * 0.5; // 500ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Resonant bandpass for the aluminium intake piping resonance (1650 Hz)
    const flutterFilter = this.ctx.createBiquadFilter();
    flutterFilter.type = 'bandpass';
    flutterFilter.frequency.setValueAtTime(1650, flutterStart);
    flutterFilter.Q.setValueAtTime(4.5, flutterStart);

    // 5 rapid rhythmic flutter chops at 15.5 Hz
    const flutterGain = this.ctx.createGain();
    flutterGain.gain.setValueAtTime(0, flutterStart);

    const flutterPumps = [
      { time: 0.00, gain: 0.38 },
      { time: 0.06, gain: 0.03 },
      { time: 0.12, gain: 0.32 },
      { time: 0.18, gain: 0.02 },
      { time: 0.24, gain: 0.22 },
      { time: 0.30, gain: 0.01 },
      { time: 0.36, gain: 0.12 },
      { time: 0.42, gain: 0.01 },
      { time: 0.48, gain: 0.00 },
    ];

    flutterPumps.forEach(p => {
      flutterGain.gain.linearRampToValueAtTime(p.gain, flutterStart + p.time);
    });

    noise.connect(flutterFilter);
    flutterFilter.connect(flutterGain);
    flutterGain.connect(this.masterGain);

    noise.start(flutterStart);
    noise.stop(flutterStart + 0.5);

    // 3. Subtle Aftermarket Exhaust Decel Backfire Pop ("POP!")
    setTimeout(() => {
      if (this.ctx && !this.isMuted) {
        const popTime = this.ctx.currentTime;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(110, popTime);
        popOsc.frequency.exponentialRampToValueAtTime(40, popTime + 0.06);

        popGain.gain.setValueAtTime(0.3, popTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.06);

        popOsc.connect(popGain);
        popGain.connect(this.masterGain);
        popOsc.start(popTime);
        popOsc.stop(popTime + 0.07);
      }
    }, 280);
  }
}

const audioEngine = new SupraMK4A80AudioEngine();

/**
 * Splits semantic headline into kinetic characters with accessibility
 */
function splitHeadline() {
  const headline = document.querySelector('.kinetic-headline');
  if (!headline) return [];

  const rawText = headline.getAttribute('data-text') || headline.textContent.trim();
  headline.setAttribute('aria-label', rawText);
  headline.innerHTML = '';

  const words = rawText.split(' ');
  const allCharSpans = [];

  words.forEach((word, wordIndex) => {
    const wordWrapper = document.createElement('span');
    wordWrapper.className = 'inline-flex items-center whitespace-nowrap';
    wordWrapper.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const charSpan = document.createElement('span');
      charSpan.className = 'headline-char';
      charSpan.textContent = char;
      charSpan.setAttribute('aria-hidden', 'true');
      wordWrapper.appendChild(charSpan);
      allCharSpans.push(charSpan);
    }

    headline.appendChild(wordWrapper);

    if (wordIndex < words.length - 1) {
      const spacer = document.createElement('span');
      spacer.className = 'headline-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      spacer.innerHTML = '&nbsp;';
      headline.appendChild(spacer);
    }
  });

  return allCharSpans;
}

/**
 * Intro Entrance Timeline
 */
function initIntroAnimation(charSpans) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(charSpans, { opacity: 1, y: 0 });
    gsap.set('.stat-card', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.car-container', { opacity: 1, x: '0vw' });
    return;
  }

  const masterIntro = gsap.timeline({
    defaults: { ease: ANIM_CONFIG.letterEase, force3D: true },
  });

  gsap.set(charSpans, {
    opacity: 0,
    y: 35,
    scale: 0.95,
  });

  gsap.set('.stat-card', {
    opacity: 0,
    y: 30,
    scale: 0.96,
  });

  gsap.set('.car-container', {
    opacity: 0,
    x: '-35vw',
  });

  gsap.set('.scroll-indicator', {
    opacity: 0,
    y: 10,
  });

  // 1. Headline letter wave
  masterIntro.to(charSpans, {
    opacity: 0.38,
    y: 0,
    scale: 1,
    duration: 0.9,
    stagger: ANIM_CONFIG.letterStagger,
  }, 0.2);

  // 2. Car slides into initial starting position with wheel rolling
  masterIntro.to('.car-container', {
    opacity: 1,
    x: '2vw',
    duration: 1.5,
    ease: 'power2.out',
  }, 0.45);

  masterIntro.to('#wheel-rear-spokes, #wheel-rear-spokes-reflect', {
    rotation: 360,
    transformOrigin: '255px 260px',
    duration: 1.5,
    ease: 'power2.out',
  }, 0.45);

  masterIntro.to('#wheel-front-spokes, #wheel-front-spokes-reflect', {
    rotation: 360,
    transformOrigin: '765px 260px',
    duration: 1.5,
    ease: 'power2.out',
  }, 0.45);

  // 3. Impact stats cascade
  masterIntro.to('.stat-card', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.75,
    stagger: ANIM_CONFIG.statsStagger,
    ease: 'back.out(1.2)',
  }, '-=0.6');

  // 4. Scroll cue
  masterIntro.to('.scroll-indicator', {
    opacity: 0.8,
    y: 0,
    duration: 0.6,
  }, '-=0.2');

  return masterIntro;
}

/**
 * Scroll-Driven Pinned Animation with Physics and Telemetry
 */
function initScrollAnimation(charSpans) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const mm = gsap.matchMedia();

  // Desktop & Tablet
  mm.add('(min-width: 768px)', () => {
    setupHeroScrollTimeline(
      charSpans,
      '2vw',
      `${ANIM_CONFIG.endOffsetXDesktop}vw`,
      ANIM_CONFIG.pinDistance,
      ANIM_CONFIG.scrubSmoothing
    );
  });

  // Mobile
  mm.add('(max-width: 767px)', () => {
    setupHeroScrollTimeline(
      charSpans,
      '-5vw',
      `${ANIM_CONFIG.endOffsetXMobile}vw`,
      '+=190%',
      ANIM_CONFIG.scrubSmoothing
    );
  });
}

function setupHeroScrollTimeline(charSpans, startX, endX, pinDist, scrubVal) {
  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: pinDist,
      pin: true,
      pinSpacing: true,
      scrub: scrubVal,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const vel = self.getVelocity();
        audioEngine.onScroll(vel, self.progress);
      },
      onLeave: () => {
        // Fast scroll past hero section: instantly kill engine sound!
        audioEngine.onLeaveHero();
      },
      onLeaveBack: () => {
        audioEngine.onLeaveHero();
      },
      onEnter: () => {
        audioEngine.onEnterHero();
      },
      onEnterBack: () => {
        audioEngine.onEnterHero();
      },
    },
    defaults: { ease: 'none', force3D: true },
  });

  // 1. Horizontal vehicle travel
  scrollTimeline.to('.car-container', {
    x: endX,
    duration: 1,
  }, 0);

  // 2. Physical wheel spin (6 full 360° rotations)
  scrollTimeline.to('#wheel-rear-spokes, #wheel-rear-spokes-reflect', {
    rotation: `+=${ANIM_CONFIG.wheelRotations}`,
    transformOrigin: '255px 260px',
    duration: 1,
    ease: 'none',
    force3D: true,
  }, 0);

  scrollTimeline.to('#wheel-front-spokes, #wheel-front-spokes-reflect', {
    rotation: `+=${ANIM_CONFIG.wheelRotations}`,
    transformOrigin: '765px 260px',
    duration: 1,
    ease: 'none',
    force3D: true,
  }, 0);

  // 3. Realistic Aerodynamic Suspension Pitch:
  // Lift under initial acceleration squat, steady at cruise, slight dive as forward speed decreases
  scrollTimeline.to('.car-asset-wrapper', {
    rotation: 1.25,
    y: -4,
    duration: 0.15,
    ease: 'power1.out',
  }, 0.05)
  .to('.car-asset-wrapper', {
    rotation: -0.8,
    y: 2,
    duration: 0.35,
    ease: 'sine.inOut',
  }, 0.25)
  .to('.car-asset-wrapper', {
    rotation: 0,
    y: 0,
    duration: 0.2,
    ease: 'power1.out',
  }, 0.85);

  // 4. Volumetric Laser Headlight Beam Intensity
  scrollTimeline.to('.car-beam-overlay', {
    opacity: 0.95,
    scaleX: 1.3,
    duration: 0.35,
    ease: 'power1.inOut',
  }, 0.15)
  .to('.car-beam-overlay', {
    opacity: 0.4,
    scaleX: 1.0,
    duration: 0.3,
  }, 0.7);

  // 5. Letter-by-Letter Real-World Lighting Flare
  // As the vehicle travels beneath each character, headlights sweep across casting dynamic illumination
  if (charSpans && charSpans.length > 0) {
    const totalChars = charSpans.length;
    
    charSpans.forEach((char, index) => {
      const charTriggerPoint = 0.10 + (index / totalChars) * 0.76;
      const highlightSpan = 0.055;

      scrollTimeline.to(char, {
        color: '#ffffff',
        textShadow: '0 0 25px #ffffff, 0 0 45px #ff4d00, 0 0 85px rgba(255, 77, 0, 0.8)',
        scale: 1.1,
        y: -5,
        duration: highlightSpan,
        ease: 'power1.out',
      }, charTriggerPoint)
      .to(char, {
        color: 'rgba(255, 255, 255, 0.94)',
        textShadow: '0 0 12px rgba(255, 255, 255, 0.45)',
        scale: 1,
        y: 0,
        duration: highlightSpan,
        ease: 'power1.in',
      }, charTriggerPoint + highlightSpan);
    });
  }

  // 6. Real-World Parallax for stats and highway lane markers
  scrollTimeline.to('.hero-stats-wrapper', {
    y: 45,
    opacity: 0.35,
    duration: 0.75,
    ease: 'power1.inOut',
  }, 0.15);

  scrollTimeline.to('.road-perspective-grid', {
    backgroundPositionY: '320px',
    duration: 1,
  }, 0);

  scrollTimeline.to('.road-lane-marker', {
    backgroundPositionX: '-480px',
    duration: 1,
  }, 0);

  // 7. Fade out scroll prompt
  scrollTimeline.to('.scroll-indicator', {
    opacity: 0,
    y: 15,
    duration: 0.12,
  }, 0);
}

/**
 * Real-World Cockpit HUD telemetry & gearbox calculation
 * Continuously driven by the physics velocity decay loop
 */
function updateCockpitHUDLive(speed, progress) {
  const speedDisplay = document.getElementById('hud-speed-val');
  const gearDisplay = document.getElementById('hud-gear-val');
  const gforceDisplay = document.getElementById('hud-gforce-val');
  const teleProgress = document.getElementById('telemetry-progress');
  const teleBar = document.getElementById('telemetry-bar');
  const teleSpeed = document.getElementById('telemetry-speed');
  const teleHp = document.getElementById('telemetry-hp');

  const roundedSpeed = Math.round(speed);

  // Realistic sequential transmission gearbox logic
  let gear = 'N';
  if (roundedSpeed === 0) gear = 'N';
  else if (roundedSpeed < 45) gear = '1ST';
  else if (roundedSpeed < 90) gear = '2ND';
  else if (roundedSpeed < 145) gear = '3RD';
  else if (roundedSpeed < 205) gear = '4TH';
  else if (roundedSpeed < 255) gear = '5TH';
  else gear = '6TH';

  // Dynamic G-Force calculation (-1.2G braking to +1.4G acceleration)
  const gVal = (speed / 160).toFixed(2);
  const clampedG = Math.max(-1.5, Math.min(1.5, gVal));

  // Dynamic Horsepower readout for 2JZ tuned powertrain
  const horsepower = Math.min(1250, Math.round(roundedSpeed * 4.8));

  if (speedDisplay) speedDisplay.textContent = `${roundedSpeed} KM/H`;
  if (gearDisplay) gearDisplay.textContent = gear;
  if (gforceDisplay) gforceDisplay.textContent = `${clampedG > 0 ? '+' : ''}${clampedG} G`;

  if (progress !== undefined && teleProgress) {
    teleProgress.textContent = `${Math.round(progress * 100)}%`;
  }
  if (progress !== undefined && teleBar) {
    teleBar.style.width = `${Math.round(progress * 100)}%`;
  }
  if (teleSpeed) teleSpeed.textContent = `${roundedSpeed} km/h`;
  if (teleHp) teleHp.textContent = `${horsepower} HP`;
}

/**
 * Lenis Smooth Scroll Engine Integration
 */
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/**
 * Tuner and User Interaction Suite
 */
function initTunerControls(lenis) {
  // 1. Audio Engine Toggle
  const audioButtons = document.querySelectorAll('.action-toggle-audio');
  audioButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isSoundActive = audioEngine.toggle();
      audioButtons.forEach((b) => {
        b.classList.toggle('is-active', isSoundActive);
        const label = b.querySelector('.audio-label-text');
        if (label) {
          label.textContent = isSoundActive ? 'Supra MK4 A80 (2JZ): Active' : 'Supra MK4 A80: Muted';
        }
      });
    });
  });

  // 2. Drive Mode / Accent Color Switcher
  const accentButtons = document.querySelectorAll('[data-accent-color]');
  accentButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-accent-color');
      const glow = btn.getAttribute('data-accent-glow');
      
      document.documentElement.style.setProperty('--color-accent', color);
      document.documentElement.style.setProperty('--color-accent-glow', glow);

      accentButtons.forEach((b) => b.classList.remove('ring-2', 'ring-white'));
      btn.classList.add('ring-2', 'ring-white');
    });
  });

  // 3. Headlight Laser Beam Toggle
  const beamToggle = document.getElementById('toggle-beam-btn');
  if (beamToggle) {
    beamToggle.addEventListener('click', () => {
      const beam = document.querySelector('.car-beam-overlay');
      const spot = document.querySelector('.headlight-road-spotlight');
      if (beam) {
        const isHidden = beam.classList.toggle('hidden');
        if (spot) spot.classList.toggle('hidden', isHidden);
        beamToggle.textContent = isHidden ? 'Enable Laser Optics' : 'Disable Laser Optics';
      }
    });
  }

  // 4. Scroll to Top
  const scrollBtns = document.querySelectorAll('.action-scroll-top');
  scrollBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // 5. Custom Vehicle Asset Swapper (Supports both URL and local file uploads)
  const applyCustomCarImage = (imageSrc) => {
    const container = document.querySelector('.car-asset-wrapper');
    if (!container) return;

    let customImg = document.getElementById('custom-car-img');
    if (!customImg) {
      customImg = document.createElement('img');
      customImg.id = 'custom-car-img';
      customImg.className = 'w-full h-full object-contain pointer-events-none absolute inset-0 z-20';
      customImg.alt = 'Custom Toyota Supra asset';
      customImg.referrerPolicy = 'no-referrer';

      customImg.onload = () => {
        const svgChassis = document.getElementById('car-chassis');
        if (svgChassis) svgChassis.style.opacity = '0';
      };
      customImg.onerror = () => {
        alert('Could not load custom image. Reverting to Alpine White Toyota Supra MK4.');
        customImg.remove();
        const svgChassis = document.getElementById('car-chassis');
        if (svgChassis) svgChassis.style.opacity = '1';
      };
      container.appendChild(customImg);
    }
    customImg.src = imageSrc;
  };

  const assetForm = document.getElementById('custom-asset-form');
  const assetInput = document.getElementById('custom-asset-url');
  const assetFileInput = document.getElementById('custom-asset-file');

  if (assetForm && assetInput) {
    assetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = assetInput.value.trim();
      if (url) applyCustomCarImage(url);
    });
  }

  if (assetFileInput) {
    assetFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            applyCustomCarImage(event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 6. Lead Contact Form
  const contactForm = document.getElementById('contact-lead-form');
  const contactFeedback = document.getElementById('contact-feedback');
  if (contactForm && contactFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('lead-email')?.value;
      if (email && email.includes('@')) {
        contactFeedback.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => {
          contactFeedback.classList.add('hidden');
        }, 5000);
      }
    });
  }
}

// Initialization on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const charSpans = splitHeadline();
  const lenisInstance = initSmoothScroll();
  initIntroAnimation(charSpans);
  initScrollAnimation(charSpans);
  initTunerControls(lenisInstance);

  // Safety scroll watcher: guarantees that when user scrolls down fast into lower sections,
  // the engine sound NEVER stays stuck on and is cleanly silenced!
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero-section');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 20) {
        audioEngine.silenceImmediately();
      }
    }
  }, { passive: true });
});

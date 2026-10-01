/**
 * ItzFizz - Scroll-Driven Hero Section Animation
 * 
 * Architecture:
 * - splitHeadline(): Transforms semantic heading into individual GPU-accelerated character spans
 * - initIntroAnimation(): Staggered entrance timeline on first page load
 * - initScrollAnimation(): Core ScrollTrigger pinning & scrubbed translation/reaction
 * - initSmoothScroll(): Optional Lenis smooth-scrolling integration with GSAP ticker
 * - initTunerControls(): Developer & user interactive controls for themes, assets & telemetry
 */

// Register GSAP plugins safely
gsap.registerPlugin(ScrollTrigger);

// Global configuration constants (Tunable animation parameters)
const ANIM_CONFIG = {
  // Intro Timeline
  letterStagger: 0.05,       // Seconds between each letter reveal
  letterEase: 'power3.out',   // Easing curve for intro headline
  statsStagger: 0.12,        // Seconds between stat cards
  introDuration: 2.2,        // Target overall intro length in seconds
  
  // ScrollTrigger Core
  pinDistance: '+=200%',     // Hero pin scroll height (200% of viewport)
  scrubSmoothing: 1,         // Seconds for scrub interpolation (1 = smooth momentum)
  wheelRotations: 1440,      // Degrees of rim rotation (4 full cycles across stage)
  
  // Vehicle Stage Offsets (vw units)
  startOffsetXDesktop: -35,  // Off-screen left start position (vw)
  endOffsetXDesktop: 110,    // Off-screen right exit position (vw)
  startOffsetXMobile: -55,
  endOffsetXMobile: 120,
};

/**
 * Splits the headline into individual character spans while maintaining accessibility
 */
function splitHeadline() {
  const headline = document.querySelector('.kinetic-headline');
  if (!headline) return [];

  const rawText = headline.getAttribute('data-text') || headline.textContent.trim();
  
  // Clear contents but preserve accessibility with ARIA attributes
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

    // Add spacing between words if not the last word
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
 * Initializes the intro entrance timeline (fires on DOM ready)
 */
function initIntroAnimation(charSpans) {
  // If user prefers reduced motion, show final state immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(charSpans, { opacity: 1, y: 0 });
    gsap.set('.stat-card', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.car-container', { opacity: 1, x: '0vw' });
    return;
  }

  const masterIntro = gsap.timeline({
    defaults: { ease: ANIM_CONFIG.letterEase, force3D: true },
  });

  // 1. Initial hidden states for intro
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

  // 2. Staggered headline reveal
  masterIntro.to(charSpans, {
    opacity: 0.45,
    y: 0,
    scale: 1,
    duration: 0.9,
    stagger: ANIM_CONFIG.letterStagger,
  }, 0.2);

  // 3. Car slides into initial staging position
  masterIntro.to('.car-container', {
    opacity: 1,
    x: '2vw', // Staging resting position at intro end
    duration: 1.4,
    ease: 'power2.out',
  }, 0.5);

  // 4. Subtle wheel roll during entrance glide
  masterIntro.to('.rotating-spokes', {
    rotation: 240,
    duration: 1.4,
    ease: 'power2.out',
  }, 0.5);

  // 5. Impact stats staggered entrance (starts right as headline completes)
  masterIntro.to('.stat-card', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    stagger: ANIM_CONFIG.statsStagger,
    ease: 'back.out(1.2)',
  }, '-=0.6');

  // 6. Scroll cue fades in
  masterIntro.to('.scroll-indicator', {
    opacity: 0.75,
    y: 0,
    duration: 0.6,
  }, '-=0.2');

  return masterIntro;
}

/**
 * Initializes the pinned scroll-driven timeline using ScrollTrigger
 */
function initScrollAnimation(charSpans) {
  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Use gsap.matchMedia for responsive desktop vs mobile travel distances
  const mm = gsap.matchMedia();

  // Desktop & Tablet Breakpoint (>= 768px)
  mm.add('(min-width: 768px)', () => {
    setupHeroScrollTimeline(
      charSpans,
      '2vw',                        // From initial staging position
      `${ANIM_CONFIG.endOffsetXDesktop}vw`, // To off-screen right
      ANIM_CONFIG.pinDistance,
      ANIM_CONFIG.scrubSmoothing
    );
  });

  // Mobile Breakpoint (< 768px)
  mm.add('(max-width: 767px)', () => {
    setupHeroScrollTimeline(
      charSpans,
      '-5vw',
      `${ANIM_CONFIG.endOffsetXMobile}vw`,
      '+=180%',
      ANIM_CONFIG.scrubSmoothing
    );
  });
}

/**
 * Configures the scrubbed ScrollTrigger timeline
 */
function setupHeroScrollTimeline(charSpans, startX, endX, pinDist, scrubVal) {
  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: pinDist,
      pin: true,
      pinSpacing: true,
      scrub: scrubVal,
      invalidateOnRefresh: true, // Recalculates dynamically on window resize
      onUpdate: (self) => {
        // Broadcast telemetry for the interactive tuner panel
        updateScrollTelemetry(self.progress, self.getVelocity());
      },
    },
    defaults: { ease: 'none', force3D: true },
  });

  // A. Horizontal Car Translation across the viewport
  scrollTimeline.to('.car-container', {
    x: endX,
    duration: 1,
  }, 0);

  // B. Physical wheel rotation proportional to forward translation
  scrollTimeline.to('.rotating-spokes', {
    rotation: `+=${ANIM_CONFIG.wheelRotations}`,
    duration: 1,
  }, 0);

  // C. Subtle suspension pitch (aerodynamic lift and squat)
  scrollTimeline.to('.car-asset-wrapper', {
    rotation: 1.1,
    duration: 0.15,
    ease: 'power1.out',
  }, 0.05)
  .to('.car-asset-wrapper', {
    rotation: -0.6,
    duration: 0.35,
    ease: 'sine.inOut',
  }, 0.25)
  .to('.car-asset-wrapper', {
    rotation: 0,
    duration: 0.2,
    ease: 'power1.out',
  }, 0.8);

  // D. Dynamic headlight beam intensity increase as speed peaks
  scrollTimeline.to('.car-beam-overlay', {
    opacity: 0.9,
    scaleX: 1.25,
    duration: 0.4,
    ease: 'power1.inOut',
  }, 0.2)
  .to('.car-beam-overlay', {
    opacity: 0.35,
    scaleX: 1,
    duration: 0.3,
  }, 0.7);

  // E. Synchronized Letter Illumination
  // As the car travels from left to right, letters illuminate in sequence as the vehicle passes beneath
  if (charSpans && charSpans.length > 0) {
    const totalChars = charSpans.length;
    
    charSpans.forEach((char, index) => {
      // Map letter index across 12% to 88% of the scroll timeline
      const charTriggerPoint = 0.12 + (index / totalChars) * 0.74;
      const highlightSpan = 0.06;

      // Glow burst when car is passing
      scrollTimeline.to(char, {
        color: '#ffffff',
        textShadow: '0 0 20px #ff4d00, 0 0 42px rgba(255, 77, 0, 0.7), 0 0 70px rgba(255, 77, 0, 0.3)',
        scale: 1.08,
        y: -3,
        duration: highlightSpan,
        ease: 'power1.out',
      }, charTriggerPoint)
      // Settles into illuminated resting state
      .to(char, {
        color: 'rgba(255, 255, 255, 0.92)',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.35)',
        scale: 1,
        y: 0,
        duration: highlightSpan,
        ease: 'power1.in',
      }, charTriggerPoint + highlightSpan);
    });
  }

  // F. Parallax shift for Stats & Ground grid for enhanced spatial depth
  scrollTimeline.to('.hero-stats-wrapper', {
    y: 40,
    opacity: 0.4,
    duration: 0.75,
    ease: 'power1.inOut',
  }, 0.15);

  scrollTimeline.to('.road-perspective-grid', {
    backgroundPositionY: '240px',
    duration: 1,
  }, 0);

  // G. Fade out scroll prompt as soon as scrolling initiates
  scrollTimeline.to('.scroll-indicator', {
    opacity: 0,
    y: 15,
    duration: 0.15,
  }, 0);
}

/**
 * Initializes Lenis smooth scrolling and binds it directly to the GSAP Ticker
 */
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') {
    // Lenis not loaded, fallback seamlessly to native browser scroll
    return null;
  }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  // Sync Lenis scroll updates with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Pipe Lenis animation frames into GSAP's optimized ticker loop
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Prevent GSAP lag smoothing from stuttering momentum scrolling
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Updates telemetry panel display values during live scrub
 */
function updateScrollTelemetry(progress, velocity) {
  const progressElem = document.getElementById('telemetry-progress');
  const speedElem = document.getElementById('telemetry-speed');
  const trackBar = document.getElementById('telemetry-bar');

  if (progressElem) {
    progressElem.textContent = `${Math.round(progress * 100)}%`;
  }
  if (speedElem) {
    const virtualSpeed = Math.min(240, Math.round(Math.abs(velocity) / 12));
    speedElem.textContent = `${virtualSpeed} km/h`;
  }
  if (trackBar) {
    trackBar.style.width = `${Math.round(progress * 100)}%`;
  }
}

/**
 * Interactive Controls (Accent color changer, beam toggle, custom asset loader, reset scroll)
 */
function initTunerControls(lenis) {
  // 1. Accent Color Switcher
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

  // 2. Headlight Beam Toggle
  const beamToggle = document.getElementById('toggle-beam-btn');
  if (beamToggle) {
    beamToggle.addEventListener('click', () => {
      const beam = document.querySelector('.car-beam-overlay');
      if (beam) {
        const isHidden = beam.classList.toggle('hidden');
        beamToggle.textContent = isHidden ? 'Enable Laser Beam' : 'Disable Laser Beam';
      }
    });
  }

  // 3. Scroll to Top Action
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

  // 4. Custom Car Image URL Loader (Fallback & custom asset swap)
  const assetForm = document.getElementById('custom-asset-form');
  const assetInput = document.getElementById('custom-asset-url');
  if (assetForm && assetInput) {
    assetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = assetInput.value.trim();
      if (!url) return;

      const container = document.querySelector('.car-asset-wrapper');
      if (container) {
        // Create or update img element
        let customImg = document.getElementById('custom-car-img');
        if (!customImg) {
          customImg = document.createElement('img');
          customImg.id = 'custom-car-img';
          customImg.className = 'w-full h-full object-contain pointer-events-none';
          customImg.alt = 'Custom vehicle asset';
          customImg.referrerPolicy = 'no-referrer';
          
          // Hide SVG chassis if image successfully loads
          customImg.onload = () => {
            const svgChassis = document.getElementById('car-chassis');
            if (svgChassis) svgChassis.style.display = 'none';
          };
          customImg.onerror = () => {
            alert('Failed to load custom image URL. Reverting to precision vector supercar.');
            customImg.remove();
            const svgChassis = document.getElementById('car-chassis');
            if (svgChassis) svgChassis.style.display = '';
          };
          container.appendChild(customImg);
        }
        customImg.src = url;
      }
    });
  }

  // 5. Contact / Booking demo form validation
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

// Bootstrapping sequence on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  // 1. Split kinetic headline
  const charSpans = splitHeadline();

  // 2. Initialize smooth scrolling
  const lenisInstance = initSmoothScroll();

  // 3. Trigger initial entrance choreography
  initIntroAnimation(charSpans);

  // 4. Bind scroll-driven pin & scrub timeline
  initScrollAnimation(charSpans);

  // 5. Setup user interactions & telemetry
  initTunerControls(lenisInstance);
});

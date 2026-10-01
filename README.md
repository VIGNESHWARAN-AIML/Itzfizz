# ItzFizz — Scroll-Driven Hero Section Animation

A production-quality, high-performance scroll-driven hero section inspired by [paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation). Built entirely with **HTML5, CSS3, vanilla JavaScript**, **GSAP 3 + ScrollTrigger**, and **Tailwind CSS**. It is fully static and ready to deploy directly to GitHub Pages without any mandatory build step.

---

## 🏎️ Live Demo & Overview

- **Brand**: ItzFizz
- **Kinetic Headline**: `W E L C O M E   I T Z F I Z Z` with dynamically reactive letters
- **Hero Height**: `100svh` with a `100vh` fallback
- **Impact Stats**:
  - `98%` — Customer satisfaction rating
  - `3x` — Faster performance velocity
  - `40%` — Cost reduction efficiency
  - `24/7` — Support availability uptime
- **Vehicle Stage**: Ultra-crisp vector supercar with rolling multi-spoke turbine rims, aerodynamic suspension tilt, glowing LED taillight bar, and projecting laser headlight beam. Supports swapping any custom transparent PNG/WebP cutout URL on the fly.
- **Scroll Pinning**: Hero section pins for `200vh` scroll duration, smoothly translating the vehicle across the viewport as letters illuminate sequentially upon proximity.

---

## 🛠️ Tech Stack

- **HTML5 & CSS3**: Custom properties (`--color-accent`, `--color-bg`, etc.), perspective road grid, and zero layout-trashing styles.
- **Vanilla JavaScript (ES6+)**: Modular functions (`splitHeadline`, `initIntroAnimation`, `initScrollAnimation`, `initSmoothScroll`, `initTunerControls`).
- **GSAP 3 & ScrollTrigger (via cdnjs)**: Pinned scroll timelines, scrub interpolation, and responsive breakpoints using `gsap.matchMedia()`.
- **Lenis Smooth Scroll (via unpkg CDN)**: Butter-smooth momentum scrolling piped directly into the GSAP ticker loop.
- **Tailwind CSS (via CDN)**: Utility classes for responsive grid layouts and typography.
- **No Node / Build Tool Required for Deployment**: Runs standalone as static HTML/CSS/JS.

---

## 📁 Project Structure

```text
├── index.html          # Semantic markup, CDNs, inline vector supercar, & 3 filler sections
├── css/
│   └── style.css       # Custom properties, fluid clamp type, perspective grid, reduced-motion rules
├── js/
│   └── main.js         # GSAP timelines, character splitting, ScrollTrigger scrub, & telemetry
├── assets/
│   └── car.svg         # Standalone vector sports car graphic with rotatable wheel groups
└── README.md           # Documentation, tuning parameters, and GitHub Pages deployment guide
```

---

## 🚀 How to Run Locally

Because this is a 100% static project, you have several simple options to run it locally:

### Option A: VS Code Live Server (Zero dependencies)
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The page opens automatically at `http://127.0.0.1:5500/index.html`.

### Option B: Python 3 built-in server
Open your terminal in the project directory and run:
```bash
python3 -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

### Option C: Node.js (npx serve or Vite)
```bash
npx serve .
# or if using the included Vite dev server:
npm install
npm run dev
```

---

## 🎬 How the Animation Works

### 1. Initial Page Load Animation (`initIntroAnimation`)
- `splitHeadline()` reads `WELCOME ITZFIZZ` and splits every character into an accessible GPU-composited `span.headline-char` (wrapped with `aria-label="WELCOME ITZFIZZ"` for screen readers).
- A master GSAP timeline reveals letters with an upward translation (`y: 35` to `0`) and opacity fade using a tight `0.05s` stagger and `power3.out` easing.
- The car slides smoothly in from off-screen left into its resting starting position at `2vw`.
- The 4 impact stats animate in sequentially (`0.12s` stagger) with a subtle scale bounce (`back.out(1.2)`).

### 2. Pinned Scroll-Driven Scrub (`initScrollAnimation`)
- **Pinning**: When the user scrolls, `ScrollTrigger` pins `#hero-section` for `+=200%` of viewport height (`pin: true, scrub: 1`).
- **Translation**: As the user scrolls through this distance, the car travels horizontally across the viewport from `2vw` to `110vw` (desktop) or `120vw` (mobile).
- **Physical Wheel Roll**: Rims rotate `+1440deg` (4 full revolutions) proportional to the distance traveled, creating an authentic rolling wheel effect.
- **Dynamic Suspension & Aero**: The car body subtly pitches up `+1.1deg` under initial acceleration and settles `-0.6deg` as momentum stabilizes.
- **Reactive Letter Illumination**: As the car reaches each letter's relative position across the viewport, that character flashes with a white-hot core, scale pulse, and electric orange drop shadow (`text-shadow: 0 0 20px #ff4d00`), before settling into an active illuminated state.
- **Parallax Depth**: The stats row shifts down `40px` and eases to `40%` opacity, giving three-dimensional depth between foreground vehicle, midground stats, and background road grid.
- **Bidirectional Reversibility**: Scrolling backwards cleanly reverses all timelines smoothly due to GSAP scrub interpolation.

---

## 🎛️ Tunable Animation Parameters

All motion properties can be tuned directly inside `/js/main.js` in the `ANIM_CONFIG` object:

| Parameter | Location | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pinDistance` | `ANIM_CONFIG.pinDistance` | `'+=200%'` | Total scroll length during which hero stays pinned. Increase to `+=300%` for slower, cinematic scroll, or `+=150%` for quicker transit. |
| `scrubSmoothing` | `ANIM_CONFIG.scrubSmoothing` | `1` | Scrub interpolation delay in seconds. `1` provides a weighted luxury feel; `0.3` is snappy; `true` binds 1:1 without inertia. |
| `letterStagger` | `ANIM_CONFIG.letterStagger` | `0.05` | Delay (seconds) between sequential letters during page entrance. |
| `letterEase` | `ANIM_CONFIG.letterEase` | `'power3.out'` | GSAP easing function for entrance reveal (`'expo.out'`, `'power2.out'`). |
| `statsStagger` | `ANIM_CONFIG.statsStagger` | `0.12` | Delay between the 4 impact stat cards appearing. |
| `wheelRotations`| `ANIM_CONFIG.wheelRotations`| `1440` | Total degrees of wheel rotation across the hero. (e.g. `2160` for faster spinning). |
| `startOffsetXDesktop`| `ANIM_CONFIG` | `-35` | Off-screen left entrance position (vw). |
| `endOffsetXDesktop` | `ANIM_CONFIG` | `110` | Off-screen right exit position (vw). |

---

## 🚢 GitHub Pages Deployment Instructions

Because this repository contains pure static files (`index.html`, `/css/`, `/js/`, `/assets/`), deploying to GitHub Pages takes less than 60 seconds:

### Step 1: Initialize Git and Commit
```bash
git init
git add .
git commit -m "feat: initial scroll-driven hero animation for ItzFizz"
```

### Step 2: Create a GitHub Repository & Push
1. Go to [GitHub](https://github.com/new) and create a new public repository (e.g. `itzfizz-scroll-animation`).
2. Run the following commands in your local terminal:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/itzfizz-scroll-animation.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your GitHub repository, click on **Settings** (top navigation tab).
2. On the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and leave folder as `/ (root)`.
4. Click **Save**.

### Step 4: Access Your Live Site
Within 1–2 minutes, GitHub Pages will deploy your site. Your live URL will be:
```text
https://<YOUR-USERNAME>.github.io/itzfizz-scroll-animation/
```

---

## ♿ Accessibility & Performance Verification

- **Compositor-Only Motion**: Animations strictly target `transform` (3D accelerated) and `opacity`. No layout recalculations on `top`, `left`, `width`, or `height`.
- **Zero Scroll Layout Thrashing**: No `getBoundingClientRect()` or `offsetWidth` invocations inside scroll loops; ScrollTrigger uses pre-computed thresholds and `invalidateOnRefresh: true`.
- **`prefers-reduced-motion`**: Handled via CSS `@media (prefers-reduced-motion: reduce)` and JS media query checks. Scrubbed translation is bypassed and all content is immediately displayed in full contrast.
- **ARIA Semantics**: Kinetic split letters use `aria-hidden="true"`, while the parent container bears `aria-label="WELCOME ITZFIZZ"`.

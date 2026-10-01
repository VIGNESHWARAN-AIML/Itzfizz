# ItzFizz — Real-World Photorealistic Scroll-Driven Hero Animation

A production-grade, cinematic real-world scroll-driven automotive experience inspired by [paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation) and the legendary **Toyota Supra MK4 (A80 generation, built from 1993 to 2002)**. Built with **HTML5, CSS3, vanilla JavaScript**, **GSAP 3 + ScrollTrigger**, and **Tailwind CSS**. It is fully static and ready to deploy directly to GitHub Pages without any build step.

---

## 🏎️ Key Features

1. **Toyota Supra MK4 (A80, 1993–2002) 2JZ-GTE Twin-Turbo Sound Synthesizer**:
   - Synthesizes the authentic 3.0L Inline-6 engine firing harmonics ($1\text{-}5\text{-}3\text{-}6\text{-}2\text{-}4$ sequence with $37.5\text{ Hz}$ base idle at 750 RPM up to $350\text{ Hz}$ redline howl at 7000 RPM).
   - **Denso starter motor crank sequence**: Authentic 3-chug compression turnover and rev flare ignition.
   - **CT12B Sequential Twin-Turbo Spool**: Primary turbo spools from low speed ($980\text{ Hz} \to 2200\text{ Hz}$ whistle); secondary turbo hits hard at high speed ($1900\text{ Hz} \to 3800\text{ Hz}$ scream).
   - **Iconic HKS SSQV Blow-off Valve & Wastegate Surge Flutter (`TSCHIIIRP - STU-TU-TU-TU-TU`)**: High-frequency metallic chirp followed by rhythmic compressor surge chops and overrun backfire pop on deceleration.
   - **Fast Scroll Auto Cutoff & Zero Idle Leak**: When you scroll fast down past the hero section, the engine sound **instantly shuts off** via ScrollTrigger `onLeave`, `onLeaveBack`, and a dedicated window scroll safety monitor. When you stop scrolling, the engine sound cleanly drops to 0 dB instead of droning forever.

2. **Restored Original Sports Alloy Wheel Architecture**:
   - Pristine, high-fidelity sports wheel design with outer tire rubber, sidewall rings, ventilated carbon ceramic rotor, and cross-drilled cooling holes.
   - **Stationary Gold Brembo-style brake calipers** that remain locked at the 10 o'clock position while the wheels spin.
   - **Dynamic Rotating Alloy Spokes**: Smooth $2160^\circ$ (6 full rotations) spin centered around rear axle ($X=255, Y=260$) and front axle ($X=765, Y=260$) with zero wobble, synchronized with the inverted wet asphalt road reflection.
3. **Photorealistic Wet Asphalt Mirror Reflection**:
   - Inverted underbody reflection (`transform: scaleY(-0.75) skewX(-2deg)`) that tracks the car in 100% lockstep with vertical water surface blur and gradient drop-off.
4. **Dual Laser Headlight Optics & Asphalt Road Spotlight**:
   - 6500K laser headlight beam projecting through dark atmosphere with anamorphic horizontal lens flare and an asphalt road spotlight that travels ahead of the front bumper.
5. **Real-World Digital Cockpit HUD**:
   - Live digital speedometer (0–280 km/h), real-time sequential gearbox simulation (`N`, `1ST` to `6TH`), dynamic lateral/longitudinal G-force meter, and horsepower telemetry.

---

## 🛠️ Tech Stack

- **HTML5 & CSS3**: Custom properties (`--color-accent`, `--color-bg`, etc.), perspective road grid, wet asphalt texture, and zero layout-trashing styles.
- **Vanilla JavaScript (ES6+)**: Modular functions (`splitHeadline`, `initIntroAnimation`, `initScrollAnimation`, `initSmoothScroll`, `Supra2JZAudioEngine`, `updateCockpitHUDLive`).
- **GSAP 3 & ScrollTrigger (via cdnjs)**: Pinned scroll timelines, scrub interpolation, and responsive breakpoints using `gsap.matchMedia()`.
- **Lenis Smooth Scroll (via unpkg CDN)**: Butter-smooth momentum scrolling piped directly into the GSAP ticker loop.
- **Tailwind CSS (via CDN)**: Utility classes for responsive grid layouts and typography.
- **No Node / Build Tool Required for Deployment**: Runs standalone as static HTML/CSS/JS.

---

## 📁 Project Structure

```text
├── index.html          # Semantic markup, CDNs, HUD overlay, & 3 filler sections
├── css/
│   └── style.css       # Custom properties, wet reflection, asphalt textures, and responsive layout
├── js/
│   └── main.js         # GSAP timelines, Supra 2JZ audio engine, and HUD telemetry
├── assets/
│   └── car.svg         # Photorealistic vector hypercar with rotating wheels and brake assemblies
└── README.md           # Documentation, tuning parameters, and GitHub Pages deployment guide
```

---

## 🚀 How to Run Locally

### Option A: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and click **"Open with Live Server"**.
4. Opens automatically at `http://127.0.0.1:5500/index.html`.

### Option B: Python 3 built-in server
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

## 🚢 GitHub Pages Deployment Instructions

1. **Commit your static files**:
   ```bash
   git init
   git add index.html css/ js/ assets/ README.md
   git commit -m "feat: complete real-world scroll-driven hero animation with Supra 2JZ sound"
   ```
2. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```
3. **Activate Pages**:
   - Go to **Settings** $\rightarrow$ **Pages** on your repository.
   - Under **Build and deployment > Branch**, choose **`main`** and **`/ (root)`**.
   - Click **Save**.
4. **Live URL**:
   Your site will be available at:
   ```
   https://<YOUR-USERNAME>.github.io/<REPO-NAME>/
   ```

# 🩸 PulsePact: Community Blood Donor Finder

<div align="center">
  <img src="./src/assets/images/pulsepact-preview.png" alt="PulsePact Preview UI" width="900" />
</div>

> **Connecting Donors. Saving Lives.** <br/>
> A premium, modern web application designed to instantly match patients in critical need with nearby, available blood donors. 

---

## ✨ Features

- **🛡️ Secure Donor Registration**: A comprehensive multi-step workflow. Users input their basic data, locate a verified Blood Bank nearby, and must upload their Fitness Certificate and No-Disease Declaration before they are registered.
- **🚀 Dynamic Donor Feed**: Fetches real-world (simulated) data immediately upon mount.
- **🔍 Advanced Filtering**: Search for donors effortlessly based on *City*, filter by *Exact Blood Group*, and sort by *Availability Status*.
- **📨 Instant Request Dispatch**: Simply click to securely share your patient details (Name, Phone, Email) with both the mapped hospital and the donor directly.
- **🗺️ Global Blood Donation Map**: Visualizes WHO 2024-2025 global donation rates via a beautiful interactive D3 choropleth globe projection.

## 🛠️ Tech Stack & Architecture

- **Core**: React.js 18 + Vite (ESM)
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`) combined with browser local storage matching.
- **Map & Stats Visualization**: 
  - `react-simple-maps` (Choropleth Projection)
  - `d3-scale` (Continuous Color Scale Gradient Mapping)
  - `react-tooltip` 
- **Design System**: 100% Custom CSS Variables & Glassmorphism. Features heavy animations, responsive grids, and cinematic dark mode aesthetics. Uses `createPortal` for overlay modals.

---

## 🚀 Quick Start / Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/tanishbhandari11t/Blood_Donation.git
cd Blood_Donation
```

**2. Install dependencies**
```bash
npm install 
# OR use yarn / pnpm install
```
*(Make sure to run a clean install as `prop-types` is specifically injected into Vite's optimized dependencies for map rendering).*

**3. Run the development server**
```bash
npm run dev
```

**4. Build for Production**
```bash
npm run build
```

---

## 🎨 UI/UX Insights

**Color Palette:**
- Backgrounds: Obsidian & Midnight Navies (`#0F0F1A`)
- Accents: Vibrant Crimson Red (`#e63946`) & Success Emerald (`#2ed573`)
- Elements: Glass Panels w/ 20px blur and `1px rgba(255,255,255,0.08)` borders.

**Why Not Tailwind?** 
PulsePact was written with completely pure, semantic CSS and BEM architecture. This gives maximum design control and ensures absolute aesthetic precision without relying on rigid utility classes.

---

<div align="center">
  <sub>Built with ❤️ for a healthier community.</sub>
</div>

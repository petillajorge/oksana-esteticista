# Oksana Pershyna — Cosmetology & Aesthetic Sanctuary

A high-end, responsive web application for **Oksana**, certified aesthetic cosmetologist. This repository showcases personalized skin care, advanced facial techniques, body wellness rituals, and direct client booking.

---

## 🌟 Overview & Versions

This project features two versions of the web application:

### 1. **Version 1 (`index.html`)** — Classic Minimalist Version
- **Theme:** Clean, neutral aesthetic with warm ochre tones.
- **Highlights:** Dynamic infinite marquee for reviews, basic translation switcher, treatment cards, and direct Instagram CTA link.

### 2. **Version 2 (`index-v2.html`)** — Haute Cosmetology & Luxury Sanctuary (*New Version*)
- **Theme:** Elevated high-end aesthetic inspired by luxury wellness sanctuaries.
- **Color Palette:** Warm cream (`#FDFBF7`), soft sand (`#F7F2EA`), champagne gold (`#D4AF37`), deep bronze (`#9C7A5B`), and charcoal (`#1A1817`).
- **Typography:** Refined editorial typography combining *Cormorant Garamond*, *Playfair Display*, and *Plus Jakarta Sans*.
- **Key Features & Interactive Enhancements:**
  - **Glassmorphic Navigation Bar:** Sticky glass header with top announcement bar and direct reservation CTA.
  - **Interactive Treatment Filter:** Filter treatments seamlessly by category (*All Treatments*, *Facials & Massage*, *Advanced Therapy*, *Body & Podal*).
  - **Treatment Detail Modal:** Modal popups providing detailed ritual descriptions when clicking "Discover Ritual".
  - **Personalized Skin Consultation Quiz:** Interactive 2-step skin goal proposal form.
  - **Smooth Infinite Testimonial Carousel:** Multi-language client reviews with star ratings.
  - **Multi-Language Support:** Fully integrated client-side localization for Spanish (ES), English (EN), Russian (RU), and Ukrainian (UA).

---

## 🚀 GitHub Pages Deployment

The application is configured for automated deployment via GitHub Actions.

### Deployment Workflow (`.github/workflows/deploy.yml`)
Whenever changes are pushed to the `main` branch, GitHub Actions will automatically:
1. Checkout the repository code.
2. Install dependencies (`npm ci`).
3. Build and minify Tailwind CSS (`src/output.css`).
4. Publish the static site to **GitHub Pages**.

### Accessing the Webpages
Once deployed to GitHub Pages, the site will be accessible at:
- **Version 2 (New Luxury Version):** `https://<username>.github.io/<repository-name>/index-v2.html`
- **Version 1 (Original Version):** `https://<username>.github.io/<repository-name>/index.html`

*(Note: To make Version 2 the default landing page on root `/`, rename `index-v2.html` to `index.html` if desired).*

---

## 🛠️ Local Development & Build Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/oksana.git
cd oksana

# Install dependencies
npm install
```

### Build Commands
```bash
# Build & minify Tailwind CSS output
npm run build

# Watch for CSS changes during development
npm run dev
```

---

## 📂 Directory Structure

```
.
├── assets/                  # High-resolution media assets (photos, thumbnails, posts)
├── .github/workflows/       # GitHub Actions workflow for Pages deployment
│   └── deploy.yml
├── src/
│   ├── locales.js           # Multi-language translations (ES, EN, RU, UA)
│   ├── script.js            # JavaScript for v1
│   ├── v2.js                # Interactive JavaScript logic for v2
│   ├── styles.css           # Source Tailwind CSS stylesheet
│   └── output.css           # Compiled CSS artifact
├── index.html               # Version 1 Webpage
├── index-v2.html            # Version 2 Webpage (Haute Cosmetology Sanctuary)
├── package.json             # NPM dependencies and scripts
├── tailwind.config.js       # Tailwind CSS v4 configuration
└── README.md                # Project documentation
```

---

## ✒️ License & Author

Developed with care for **Oksana — Cosmetóloga Esteticista**.
All rights reserved © 2026.

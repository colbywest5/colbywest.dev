# Colby West - Developer Portfolio

> **Network Engineering meets Web Development.**
>
> A high-performance portfolio site built with [Next.js 14+](https://nextjs.org), designed to bridge the gap between reliable infrastructure and modern, fluid user experiences.

![Hero Preview](public/assets/images/logo-white.png)

## ⚡ Key Features

*   **Interactive Hero Section**: A custom-engineered halftone gradient background with subtle animations and "glitch" text effects that respect user motion preferences.
*   **Tic-Tac-Toe Engine**: A fully playable game embedded directly in the hero.
    *   **Minimax AI**: An unbeatable AI opponent implementation.
    *   **Global Stats**: Persistent win/loss/draw tracking across all visitors via a custom API limit-locked backend.
    *   **Responsive Layout**: Grid-based UI that prevents layout shifts during state changes.
*   **Fluid Project Gallery**: `framer-motion` backed shared layout animations for seamless card expansion and image viewing.
*   **Performance First**: Eager loading for critical assets, font optimization with `next/font`, and backdrop-filter optimizations.
*   **Secure Contact**: Integrated Turnstile protection and server-side validation.

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org) (App Router, Server Components)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Animation**: Framer Motion
*   **Icons**: Lucide React
*   **Deployment**: Vercel ready

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

*   `src/app/page.tsx`: The core logic, handling the single-page scroll layout, game state, and modal interactions.
*   `src/app/api/`: Serverless functions for contact form handling and game stats persistence.
*   `public/assets/`: Static assets including optimized project screenshots and resume.

## 🎨 Design Philosophy

"Clear communication and thoughtful execution come standard."

The design mirrors my professional approach: reliable, structured, but capable of handling complex dynamism without breaking. The color palette is a strict selection of Slate (`#26374D`, `#536D82`) and bright accents (`#fbbf24`, `#22d3ee`) ensures high contrast and accessibility while maintaining a polished "Dark Mode" aesthetic in key sections.

---

© 2024 Colby West. All rights reserved.

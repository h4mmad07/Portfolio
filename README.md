<div align="center">

# 🚀 Muhammad Hammad — Interactive 3D Portfolio & ATS Resume Engine

<p align="center">
  <strong>An ultra-modern, high-performance developer portfolio featuring 3D Three.js visualizers, real-time dynamic data administration, and an ATS-compliant PDF resume generator.</strong>
</p>

[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.168-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[🌐 Live Preview](#) • [📄 Features](#-key-features) • [⚡ Tech Stack](#-tech-stack) • [🚀 Quick Start](#-quick-start) • [📫 Contact](#-contact)

---

</div>

## 📖 Overview

This repository powers **Muhammad Hammad's** official personal portfolio website. Built from the ground up using **React 18**, **TypeScript**, **Tailwind CSS**, and **Three.js**, it bridges high-performance system engineering with immersive 3D web interactive design.

It features an integrated **ATS-Compliant Resume PDF Generator** (`html2pdf.js`) and a **Stealth Admin Portal** protected by passcode authentication and OTP verification.

---

## ✨ Key Features

### 🎮 1. Interactive 3D Canvas Hero
- Dynamic 3D interactive viewport powered by `@react-three/fiber` and `@react-three/drei`.
- Real-time mouse tracking, lighting shaders, and geometry physics.

### 📄 2. ATS-Compliant Resume Preview & PDF Generator
- Clean, single-column resume format accepted by global corporate ATS screeners and recruiters.
- **One-Click PDF Export**: Generates `Muhammad_Hammad_Resume.pdf` with native DOM element page-break avoidance—preventing half-cut characters or text slicing.
- **Print Mode**: Browser print integration with `@media print` rules to isolate and print only the resume document.

### 🔐 3. Stealth Admin Management Portal
- Triggered securely via stealth key combinations (`Ctrl+Shift+A` or double-clicking the brand logo).
- Protected by passcode authentication and secure email OTP recovery.
- Allows real-time editing of Personal Info, Services, Technical Projects, Work Experience, Education, and Skills directly from the browser with `localStorage` persistence.

### 💼 4. Core Technical Projects Showcase
- Detailed project cards with category filtering (*Game Dev, Desktop App, AI & ML, Database System, Software Architecture*).
- Interactive project modals showcasing architectural highlights, code repositories, and technology badges.

---

## 🛠️ Tech Stack

### **Frontend & Framework**
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer, Custom Glassmorphism System
- **3D Graphics & Physics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: Framer Motion
- **Icons**: Lucide React Icons

### **PDF & Document Engine**
- `html2pdf.js`, `jsPDF`, `html2canvas`

---

## 📁 Project Structure

```
muhammad-hammad-portfolio/
├── public/                  # Public static assets & images
├── src/
│   ├── components/          # UI Components & Modules
│   │   ├── 3d/              # R3F Canvas & 3D Objects (Hero3DCanvas.tsx)
│   │   ├── admin/           # Stealth Admin Dashboard & Auth Modals
│   │   ├── ui/              # Custom Cursor, Particles, Headers
│   │   ├── About.tsx        # Biography & Education Timeline
│   │   ├── Contact.tsx      # Interactive Contact Form & Details
│   │   ├── Experience.tsx   # Work Experience Section
│   │   ├── Footer.tsx       # Brand Footer & Quick Links
│   │   ├── Hero.tsx         # Hero Section with CTA Buttons
│   │   ├── Navbar.tsx       # Floating Glass Header & Mobile Menu
│   │   ├── ProjectModal.tsx # Project Deep-Dive Modal
│   │   ├── Projects.tsx     # Filterable Portfolio Grid
│   │   ├── ResumeModal.tsx  # ATS Resume View & PDF Generator
│   │   ├── TechStack.tsx    # Skills Matrix & Level Indicators
│   │   └── WhatIDo.tsx      # Services & Engineering Pillars
│   ├── context/             # Portfolio Data & Admin State Management
│   ├── data/                # Initial Portfolio Master Schema & TypeScript Interfaces
│   ├── utils/               # Security, Passcode Verification & Recovery Logic
│   ├── App.tsx              # Application Root Assembly
│   ├── index.css            # Base Styles & Print Media Rules
│   └── main.tsx             # React DOM Mounting Entrypoint
├── package.json             # Dependencies & Build Scripts
├── tailwind.config.js       # Theme Tokens & Color Palettes
├── tsconfig.json            # TypeScript Configuration
└── vite.config.ts           # Vite Bundler Setup
```

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

### 2. Clone Repository
```bash
git clone https://github.com/h4mmad07/Portfolio.git
cd Portfolio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000/`.

### 5. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist/` folder.

---

## 🔒 Stealth Admin Access

To open the built-in Admin Portal:
1. Press `Ctrl + Shift + A` anywhere on the page, **OR**
2. Double-click the **MH** brand logo in the top navbar or footer.

---

## 📫 Contact & Connect

- **Email**: [mh9456605@gmail.com](mailto:mh9456605@gmail.com)
- **WhatsApp**: [+92 308 4098287](https://wa.me/923084098287)
- **GitHub**: [github.com/h4mmad07](https://github.com/h4mmad07)
- **Location**: Multan, Punjab, Pakistan

---

<div align="center">

Designed & Engineered with ❤️ by **Muhammad Hammad**  
*© 2026 All Rights Reserved.*

</div>

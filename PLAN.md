# Sonic UI (Magic Listener) — Master Implementation Plan

> **Application Name:** Sonic UI (Magic Listener)  
> **Tech Stack:** React (Vite) + Tailwind CSS + Framer Motion + Lucide React + React Router DOM + Axios  
> **Theme Support:** True Dual-Theme Architecture (Light & Dark) with smooth Apple/Google-tier micro-interactions  
> **Auth Architecture:** JWT stored in `httpOnly` cookies, role-based access (`user` and `artist`)  
> **Current Status:** Backend complete & verified. Frontend initialized.

---

## Access & Workspace Verification
- **Backend Directory (`/home/abdulrdeveloper/sonik-app/Backend`):** Inspected and fully mapped.
  - Express 5.2.1 + Mongoose 9.9.5 + JWT + Cookie-Parser + Multer + ImageKit SDK.
  - Routes active: `/api/auth` (`register`, `login`, `logout`) and `/api/music` (`/`, `/albums`, `/albums/:albumId`, `/upload`, `/album`).
- **Frontend Directory (`/home/abdulrdeveloper/sonik-app/Frontend`):** Verified ready for clean Vite React initialization.

---

## STEP 1: Project Blueprint & Route Map

### 1.1 Complete Route Architecture

| Route | Page Component | Access Level | Description & Backend Integration |
|---|---|---|---|
| `/` | `LandingPage.jsx` | Public | Ultra-modern Apple/Google-tier hero, dynamic waveform visuals, features grid, stats counter, CTA. |
| `/auth` | `AuthPage.jsx` | Guest Only (Redirects if authenticated) | **Sliding Panel UI**: Login form & visual panel fly/swap smoothly using `framer-motion` when toggling between Sign In and Sign Up. |
| `/dashboard` | `DashboardPage.jsx` | Protected (`user` / `artist`) | Overview stats, recently played audio, quick actions, recommended tracks. |
| `/dashboard/explore` | `ExplorePage.jsx` | Protected (`user` / `artist`) | Paginated music grid (`GET /api/music`), search/filter, playback trigger. |
| `/dashboard/albums` | `AlbumsPage.jsx` | Protected (`user` / `artist`) | Album catalog cards (`GET /api/music/albums`). |
| `/dashboard/albums/:albumId` | `AlbumDetailPage.jsx` | Protected (`user` / `artist`) | Detailed album view (`GET /api/music/albums/:id`), track listing with play state. |
| `/dashboard/upload` | `UploadPage.jsx` | Artist Only Guard | File drag-and-drop (`POST /api/music/upload`), progress bar, title input. |
| `/dashboard/create-album` | `CreateAlbumPage.jsx` | Artist Only Guard | Multi-track album creation form (`POST /api/music/album`). |
| `/dashboard/profile` | `ProfilePage.jsx` | Protected (`user` / `artist`) | User profile info, account type badge, session logout (`POST /api/auth/logout`). |
| `*` | `NotFoundPage.jsx` | Public | Minimalist 404 page with animated return action. |

**Total:** 10 Distinct Pages / Routes with strict route guards (`ProtectedRoute`, `ArtistRoute`, `GuestRoute`).

---

### 1.2 Comprehensive `src/` Directory Structure

```text
Frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                   # Entry point (Providers: Theme -> Auth -> Player -> Toast -> Router)
    ├── App.jsx                    # Route definitions and layout nesting
    ├── index.css                  # Global design tokens, font definitions, smooth theme transitions
    │
    ├── api/
    │   ├── axios.js               # Axios instance (baseURL: '/api', withCredentials: true, 401 interceptor)
    │   ├── auth.api.js            # login, register, logout, getMe requests
    │   └── music.api.js           # getAllMusic, getAlbums, getAlbumById, uploadTrack, createAlbum
    │
    ├── context/
    │   ├── ThemeContext.jsx       # Light/Dark mode state, system-preference detection & localStorage sync
    │   ├── AuthContext.jsx        # User state, login, logout, registration, persistent session recovery
    │   ├── PlayerContext.jsx      # Audio element controller, active track, playback queue, progress, volume
    │   └── ToastContext.jsx       # Global notification toasts (success, error, info)
    │
    ├── hooks/
    │   ├── useTheme.js            # Easy consumer hook for ThemeContext
    │   ├── useAuth.js             # Easy consumer hook for AuthContext
    │   ├── usePlayer.js           # Easy consumer hook for PlayerContext
    │   └── useToast.js            # Easy consumer hook for ToastContext
    │
    ├── routes/
    │   ├── ProtectedRoute.jsx     # Redirects to /auth if not logged in
    │   ├── ArtistRoute.jsx        # Restricts access to user.type === 'artist'
    │   └── GuestRoute.jsx         # Redirects authenticated users away from /auth to /dashboard
    │
    ├── layouts/
    │   ├── RootLayout.jsx         # Public layout with Navbar, Footer, and ThemeToggle
    │   └── DashboardLayout.jsx    # Protected layout with Sidebar, DashboardHeader, and Persistent AudioPlayer
    │
    ├── pages/
    │   ├── LandingPage.jsx
    │   ├── AuthPage.jsx           # Master Sliding Panel Auth (Login <-> Register position swap)
    │   ├── DashboardPage.jsx
    │   ├── ExplorePage.jsx
    │   ├── AlbumsPage.jsx
    │   ├── AlbumDetailPage.jsx
    │   ├── UploadPage.jsx
    │   ├── CreateAlbumPage.jsx
    │   ├── ProfilePage.jsx
    │   └── NotFoundPage.jsx
    │
    └── components/
        ├── ui/                    # Atomic design primitives
        │   ├── Button.jsx         # Variants: primary, secondary, outline, ghost, glass
        │   ├── Input.jsx          # Styled form input with micro-transitions and error states
        │   ├── Card.jsx           # Glassmorphic card container with light/dark adaptive borders
        │   ├── Badge.jsx          # Pill tags for 'artist' and 'user'
        │   ├── Modal.jsx          # Framer Motion accessible dialog modal
        │   └── ThemeToggle.jsx    # Animated Sun/Moon toggle button
        │
        ├── layout/
        │   ├── Navbar.jsx         # Glassmorphic floating nav
        │   ├── Footer.jsx         # Sleek modern footer
        │   ├── Sidebar.jsx        # Collapsible dashboard sidebar
        │   ├── DashboardHeader.jsx# User greeting, search bar, theme toggle, profile avatar
        │   └── AudioPlayer.jsx    # Sticky bottom audio dock with scrubbing & volume
        │
        ├── auth/                  # Modular auth components for the sliding panel
        │   ├── LoginForm.jsx      # Animated login form with validation
        │   ├── RegisterForm.jsx   # Animated register form with role toggle ('user' | 'artist')
        │   └── AuthVisualPanel.jsx# Ambient visualizer / cover art with floating elements
        │
        ├── landing/               # High-performance landing sections
        │   ├── Hero.jsx           # Soundwave hero animation with CTA
        │   ├── FeatureGrid.jsx    # Glassmorphic hover-tilt feature cards
        │   ├── LivePreview.jsx    # Interactive mock audio player
        │   └── CTASection.jsx     # High-conversion gradient banner
        │
        └── music/
            ├── TrackCard.jsx      # Track card with hover play overlay
            ├── TrackList.jsx      # Numbered album tracklist with duration & play button
            ├── AlbumCard.jsx      # Vinyl-effect album card
            └── AudioVisualizer.jsx# Dynamic canvas/CSS reactive wave animation
```

---

### 1.3 Dynamic Backend Integration & Data Flow

```text
       [ Browser / React App ]
                 │
  ┌──────────────┴──────────────┐
  │   Axios Instance (`api/`)   │  <- withCredentials: true (cookies sent automatically)
  └──────────────┬──────────────┘
                 │
                 ▼
  ┌─────────────────────────────┐
  │ Express Backend (/api)      │
  ├─────────────────────────────┤
  │ POST /api/auth/login        │ -> Sets httpOnly 'token' cookie (JWT)
  │ POST /api/auth/register     │ -> Creates 'user' or 'artist' document
  │ POST /api/auth/logout       │ -> Clears auth cookie
  │ GET  /api/music             │ -> Returns tracks with artist population
  │ POST /api/music/upload      │ -> Multer memoryStorage -> ImageKit -> MongoDB
  │ POST /api/music/album       │ -> Group tracks into cohesive album
  └─────────────────────────────┘
```

1. **Session & Cookie Handling:** The frontend relies on HTTP-only cookies managed via Express `cookie-parser`. `axios.create({ withCredentials: true, baseURL: '/api' })` ensures cookies are transmitted without touching JavaScript memory or localStorage, completely eliminating XSS token theft.
2. **Auth Context Synchronizer:** `AuthContext` verifies session state on boot. It provides `user`, `isAuthenticated`, `isArtist`, `login()`, `register()`, and `logout()`.
3. **Role-Based Guards:** `ArtistRoute` checks `user.type === 'artist'`. If a standard user attempts to navigate to `/dashboard/upload`, they are gracefully redirected with an explanatory toast.
4. **Continuous Audio State:** `PlayerContext` acts as a single source of truth for the HTML5 `<audio>` element, allowing seamless playback persistence while the user navigates between pages.

---

## STEP 2: Setup & Terminal Commands

Run these exact commands in your terminal to set up the React project with Vite, Tailwind CSS, and all necessary dependencies:

```bash
# 1. Navigate to the Frontend directory
cd Frontend

# 2. Scaffold Vite React application in current folder
npm create vite@latest . -- --template react

# 3. Install production dependencies
npm install react-router-dom framer-motion lucide-react axios clsx tailwind-merge

# 4. Install Tailwind CSS and PostCSS dev dependencies
npm install -D tailwindcss postcss autoprefixer

# 5. Generate tailwind.config.js and postcss.config.js
npx tailwindcss init -p
```

---

## STEP 3: Configuration & Theme Context

### 3.1 `tailwind.config.js`
Replace the contents of `Frontend/tailwind.config.js` with this production-grade configuration supporting class-based dark mode and custom aesthetic palettes:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sonic Brand Accents
        sonic: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Primary Brand Violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Modern Light Surface Tokens
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: 'rgba(255, 255, 255, 0.85)',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b',
        },
        // Ultra-Deep Dark Surface Tokens
        dark: {
          bg: '#090a0f',
          surface: '#11131a',
          card: 'rgba(17, 19, 26, 0.75)',
          border: '#1e2230',
          text: '#f8fafc',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 45px -10px rgba(139, 92, 246, 0.5)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
```

---

### 3.2 `Frontend/src/index.css`
Replace `Frontend/src/index.css` with the following:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }

  :root.dark {
    color-scheme: dark;
  }

  html {
    scroll-behavior: smooth;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  body {
    @apply bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text min-h-screen antialiased selection:bg-sonic-500 selection:text-white transition-colors duration-300;
  }
}

@layer utilities {
  /* Apple/Google inspired Glassmorphism */
  .glass-panel {
    @apply bg-light-card dark:bg-dark-card backdrop-blur-xl border border-light-border dark:border-dark-border;
  }

  .glass-panel-interactive {
    @apply glass-panel transition-all duration-300 hover:border-sonic-400/50 hover:shadow-glow;
  }

  /* Custom Sleek Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-zinc-700 rounded-full hover:bg-slate-400 dark:hover:bg-zinc-600 transition-colors;
  }
}
```

---

### 3.3 `Frontend/src/context/ThemeContext.jsx`
Save this context provider to `Frontend/src/context/ThemeContext.jsx`:

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or fallback to OS preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('sonic-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sonic-theme', theme);
  }, [theme]);

  // Toggle function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
```

---

## STEP 4: Theme Toggle Component

### `Frontend/src/components/ui/ThemeToggle.jsx`
Save this component to `Frontend/src/components/ui/ThemeToggle.jsx`:

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl glass-panel transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sonic-500/50 ${className}`}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? -90 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="absolute text-amber-500"
      >
        <Sun className="h-5 w-5 fill-amber-500/20" strokeWidth={2} />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : 90,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="absolute text-sonic-400"
      >
        <Moon className="h-5 w-5 fill-sonic-400/20" strokeWidth={2} />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
```

---

## Next Step Preview: Sliding Panel Auth UI
In the upcoming prompt, we will implement the **Auth Page (Sliding Panel UI)**:
1. **Interactive Form Swapping:** Left/Right bidirectional sliding mechanism using `framer-motion` layout animations.
2. **Dynamic Position Switching:** The Login Form and the Cover Visualizer gracefully exchange places when toggling between "Sign In" and "Sign Up".
3. **Form Integration:** Full connectivity with `/api/auth/login` and `/api/auth/register`, including `user` / `artist` account role selection.

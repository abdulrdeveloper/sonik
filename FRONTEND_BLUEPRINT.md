# Sonik App — Frontend Blueprint & Architecture

> **Theme:** STRICTLY Dark Theme ONLY — no light theme code, states, or logic.
> **Stack:** React (Vite) + Tailwind CSS + react-router-dom + framer-motion + axios
> **Auth:** httpOnly cookie JWT (no token storage in localStorage; axios `withCredentials: true`)

---

## Phase 1: Project Architecture & Blueprint

---

### 1. Backend API Summary (Integration Reference)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user/artist |
| POST | `/api/auth/login` | Public | Login, sets httpOnly cookie |
| POST | `/api/auth/logout` | Public | Clears cookie |
| GET | `/api/music?page=&limit=` | User/Artist | Paginated music list |
| GET | `/api/music/albums` | User/Artist | All albums |
| GET | `/api/music/albums/:albumId` | User/Artist | Single album with populated tracks |
| POST | `/api/music/upload` | Artist only | Upload music file |
| POST | `/api/music/album` | Artist only | Create album |

**User Model:** `{ _id, username, email, type: "user" | "artist", createdAt, updatedAt }`
**Music Model:** `{ _id, uri, title, artist: { _id, username } }`
**Album Model:** `{ _id, title, musics[], releaseDate, artist: { _id, username } }`

---

### 2. Pages & Routes

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | LandingPage | Public | Hero, features, CTA, footer |
| `/auth` | AuthPage | Public (guest) | Sliding panel login/register |
| `/dashboard` | DashboardPage | Authenticated | Main dashboard layout |
| `/dashboard/explore` | ExplorePage | Authenticated | Browse all music with audio player |
| `/dashboard/albums` | AlbumsPage | Authenticated | Browse all albums |
| `/dashboard/albums/:albumId` | AlbumDetailPage | Authenticated | Album detail with track list |
| `/dashboard/upload` | UploadPage | Artist only | Upload music form |
| `/dashboard/create-album` | CreateAlbumPage | Artist only | Create album form |
| `/dashboard/profile` | ProfilePage | Authenticated | User profile & settings |
| `*` | NotFoundPage | Public | 404 page |

**Total: 10 routes / 10 pages**

---

### 3. Detailed Page Breakdown

#### 3.1 Landing Page (`/`)
- **Navbar:** Logo, nav links (Features, About), Login / Get Started buttons
- **Hero Section:** Animated headline, subheadline, CTA buttons, abstract audio visualizer animation
- **Features Section:** 3-4 feature cards with icons and stagger-fade animations
- **Stats Section:** Animated counters (tracks, artists, albums)
- **CTA Section:** Final call-to-action with gradient background
- **Footer:** Links, social icons, copyright

#### 3.2 Auth Page (`/auth`) — Sliding Panel UI
- **Layout:** Split-screen — form panel (left) + visual panel (right)
- **Login Form:** Username/email + password, submit button, "Create account" toggle
- **Register Form:** Username + email + password + account type (user/artist), "Already have account" toggle
- **Animation:** On toggle, forms fly/slide to the right and the visual slides to the left (positions swap) using framer-motion `AnimatePresence` + `motion.div` with spring physics
- **Visual Panel:** Premium abstract gradient with animated sound wave or album art collage
- **Validation:** Client-side with inline error messages
- **Loading States:** Spinner on submit button during API call

#### 3.3 Dashboard Page (`/dashboard`)
- **Sidebar:** Navigation links (Explore, Albums, Upload [artist], Create Album [artist], Profile), user avatar, logout
- **Header:** Greeting, search bar, notifications bell
- **Main Content Area:**
  - Welcome banner
  - Recently played / Latest uploads (grid of music cards)
  - Quick stats cards (total tracks, total albums, etc.)
  - Trending section

#### 3.4 Explore Page (`/dashboard/explore`)
- **Header:** Title, filter/sort controls
- **Music Grid:** Paginated cards with album art placeholder, title, artist name
- **Audio Player Bar:** Fixed bottom player with play/pause, progress bar, volume, track info
- **Pagination:** Load more / numbered pagination

#### 3.5 Albums Page (`/dashboard/albums`)
- **Header:** Title, "Create Album" button (artist only)
- **Albums Grid:** Album cards with cover art, title, artist, track count, release date

#### 3.6 Album Detail Page (`/dashboard/albums/:albumId`)
- **Album Header:** Cover art, title, artist, release date, track count
- **Track List:** Numbered list with play buttons, track titles, duration placeholder
- **Integrated with:** `GET /api/music/albums/:albumId`

#### 3.7 Upload Page (`/dashboard/upload`) — Artist Only
- **Upload Form:** Title input, file input (audio), drag-and-drop zone
- **Progress Bar:** Upload progress animation
- **Success/Error States:** Toast notifications
- **Integrated with:** `POST /api/music/upload` (multipart/form-data)

#### 3.8 Create Album Page (`/dashboard/create-album`) — Artist Only
- **Form:** Title, release date, multi-select tracks from user's uploads
- **Integrated with:** `POST /api/music/album`

#### 3.9 Profile Page (`/dashboard/profile`)
- **User Info Card:** Avatar, username, email, account type badge
- **Stats:** Upload count, album count
- **Account Actions:** Logout button

#### 3.10 NotFound Page (`*`)
- **Content:** 404 illustration, "Go Home" button

---

### 4. Folder Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env
├── .env.example
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                    # Tailwind directives + dark theme base
    │
    ├── api/
    │   ├── axios.js                 # Axios instance with withCredentials
    │   ├── auth.api.js              # register, login, logout
    │   └── music.api.js             # getAllMusic, getAllAlbums, getAlbumById, uploadMusic, createAlbum
    │
    ├── hooks/
    │   ├── useAuth.js               # Auth context consumer hook
    │   ├── useMusic.js              # Music data fetching hook
    │   ├── useAudioPlayer.js        # Audio playback state & controls
    │   └── useToast.js              # Toast notification hook
    │
    ├── context/
    │   ├── AuthContext.jsx          # Auth state provider
    │   └── PlayerContext.jsx        # Global audio player provider
    │
    ├── routes/
    │   ├── ProtectedRoute.jsx       # Auth guard
    │   ├── ArtistRoute.jsx          # Artist-only guard
    │   └── GuestRoute.jsx           # Redirect if already logged in
    │
    ├── layouts/
    │   ├── RootLayout.jsx           # Public layout (navbar + footer)
    │   └── DashboardLayout.jsx      # Dashboard layout (sidebar + header + player)
    │
    ├── pages/
    │   ├── LandingPage.jsx
    │   ├── AuthPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── ExplorePage.jsx
    │   ├── AlbumsPage.jsx
    │   ├── AlbumDetailPage.jsx
    │   ├── UploadPage.jsx
    │   ├── CreateAlbumPage.jsx
    │   ├── ProfilePage.jsx
    │   └── NotFoundPage.jsx
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Button.jsx           # Reusable button variants
    │   │   ├── Input.jsx            # Reusable input with label/error
    │   │   ├── Card.jsx             # Base card component
    │   │   ├── Badge.jsx            # Status badge
    │   │   ├── Spinner.jsx          # Loading spinner
    │   │   ├── Toast.jsx            # Toast notification
    │   │   ├── Modal.jsx            # Reusable modal
    │   │   └── Skeleton.jsx         # Loading skeleton
    │   │
    │   ├── layout/
    │   │   ├── Navbar.jsx           # Public navbar
    │   │   ├── Footer.jsx           # Public footer
    │   │   ├── Sidebar.jsx          # Dashboard sidebar
    │   │   ├── DashboardHeader.jsx  # Dashboard top header
    │   │   └── AudioPlayer.jsx      # Fixed bottom audio player
    │   │
    │   ├── landing/
    │   │   ├── Hero.jsx
    │   │   ├── Features.jsx
    │   │   ├── Stats.jsx
    │   │   └── CTASection.jsx
    │   │
    │   ├── auth/
    │   │   ├── LoginForm.jsx
    │   │   ├── RegisterForm.jsx
    │   │   └── AuthVisual.jsx       # Animated visual panel
    │   │
    │   ├── music/
    │   │   ├── MusicCard.jsx        # Single music card
    │   │   ├── MusicGrid.jsx        # Grid of music cards
    │   │   ├── TrackList.jsx        # Numbered track list
    │   │   └── UploadZone.jsx       # Drag-and-drop upload
    │   │
    │   └── album/
    │       ├── AlbumCard.jsx
    │       ├── AlbumGrid.jsx
    │       └── AlbumHeader.jsx
    │
    └── utils/
        ├── constants.js             # API URLs, routes, user types
        ├── helpers.js               # Formatters, pluralizers
        └── animations.js            # framer-motion variants
```

---

### 5. Component Architecture for Backend Integration

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AuthContext (Provider)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           PlayerContext (Provider)               │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │          React Router (Routes)             │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  / ────────────── RootLayout              │  │  │  │
│  │  │  │                  ├── LandingPage          │  │  │  │
│  │  │  │                  └── AuthPage             │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  /dashboard ───── DashboardLayout         │  │  │  │
│  │  │  │                  ├── DashboardPage        │  │  │  │
│  │  │  │                  ├── ExplorePage          │  │  │  │
│  │  │  │                  ├── AlbumsPage           │  │  │  │
│  │  │  │                  ├── AlbumDetailPage      │  │  │  │
│  │  │  │                  ├── UploadPage (Artist)  │  │  │  │
│  │  │  │                  ├── CreateAlbum (Artist) │  │  │  │
│  │  │  │                  └── ProfilePage          │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  * ────────────── NotFoundPage            │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. **API Layer** (`src/api/`) — Axios instance with `withCredentials: true`, all endpoints centralized
2. **Context** — `AuthContext` manages user state; `PlayerContext` manages audio playback
3. **Hooks** — `useAuth()`, `useMusic()`, `useAudioPlayer()` consume contexts and API
4. **Pages** — Compose components, use hooks for data
5. **Components** — Presentational, receive data via props

---

### 6. Key UI/UX Requirements

#### 6.1 Auth Page — Sliding Panel Animation
- **Initial State:** Login form on LEFT, visual panel on RIGHT
- **On "Register" click:** Login form slides RIGHT (exits), Register form flies in from LEFT; Visual panel slides LEFT (exits), new visual flies in from RIGHT
- **Animation:** framer-motion `AnimatePresence` with `mode="wait"`, spring stiffness ~200, damping ~25
- **Visual:** Animated gradient mesh with floating album art or audio waveform SVG
- **Responsive:** Stacks vertically on mobile (form on top, visual hidden or below)

#### 6.2 Landing Page — Scroll Animations
- **Hero:** Text stagger-fade-up on mount, floating animation on visual
- **Features:** Intersection Observer trigger → cards fade-up with stagger delay
- **Stats:** Count-up animation when scrolled into view
- **Smooth Scroll:** CSS `scroll-behavior: smooth`, section snap optional

#### 6.3 Dashboard — Dark Mode Excellence
- **Color Palette:** `slate-950` background, `slate-900` cards, `slate-800` borders, `indigo-500` accent, `white` text
- **Glassmorphism:** Backdrop blur on navbar, sidebar, player
- **Micro-interactions:** Hover scale on cards, button press animations, sidebar item slide
- **Audio Player:** Fixed bottom bar with animated equalizer icon when playing

#### 6.4 Global UX
- **Loading:** Skeleton screens (not spinners) for data-heavy pages
- **Toasts:** Top-right slide-in for success/error feedback
- **Transitions:** Page fade/slide transitions with framer-motion
- **Accessibility:** Focus rings, aria-labels, keyboard navigation

---

### 7. Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.5.0",
    "axios": "^1.7.0",
    "lucide-react": "^0.440.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "vite": "^5.4.0"
  }
}
```

---

### 8. Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

### 9. Implementation Phases

| Phase | Name | What Gets Built |
|-------|------|-----------------|
| **Phase 1** | Architecture & Blueprint | This document — planning only, no code |
| **Phase 2** | Project Scaffolding | Vite init, Tailwind config, folder structure, axios setup, contexts, routes skeleton |
| **Phase 3** | UI Components Library | All reusable UI components (Button, Input, Card, Toast, Modal, Skeleton, etc.) |
| **Phase 4** | Auth System | AuthContext, API integration, Protected/Artist/Guest route guards |
| **Phase 5** | Auth Page (Sliding Panel) | Login/Register forms with framer-motion sliding animation |
| **Phase 6** | Landing Page | Hero, Features, Stats, CTA, Footer with scroll animations |
| **Phase 7** | Dashboard Layout | Sidebar, Header, Audio Player, DashboardLayout shell |
| **Phase 8** | Dashboard Pages | Dashboard home, Explore, Albums, Album Detail with data integration |
| **Phase 9** | Artist Features | Upload page, Create Album page with file upload |
| **Phase 10** | Profile & Polish | Profile page, NotFound, toast system, loading states, final animations |
| **Phase 11** | Testing & Optimization | Responsive testing, performance audit, final QA |

---

### 10. Design Tokens (Dark Theme)

```js
// tailwind.config.js theme.extend
colors: {
  dark: {
    950: '#0a0a0f',   // deepest background
    900: '#111118',   // card background
    800: '#1a1a24',   // elevated surface
    700: '#252532',   // borders
    600: '#3a3a4a',   // muted borders
  },
  accent: {
    400: '#818cf8',   // indigo-400
    500: '#6366f1',   // indigo-500 (primary)
    600: '#4f46e5',   // indigo-600
  }
}
```

---

*End of Phase 1 Blueprint — Ready for your approval before proceeding to Phase 2.*
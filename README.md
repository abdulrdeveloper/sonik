# Sonik

Sonik is a full-stack music platform for listeners and independent artists. Listeners can discover music, browse albums, save tracks, and play audio. Artists can publish tracks, create albums, and manage their catalogue.

## Features

### Listeners

- Cookie-based registration and login.
- Browse published tracks and albums.
- Search the music catalogue.
- Save tracks to a browser-based personal library.
- Play, pause, seek, repeat, and skip tracks.

### Artists

- Register as a listener or artist.
- Upload audio releases.
- Create albums from owned tracks.
- View published tracks and artist albums.
- Manage uploads without leaving the current dashboard section.

## Technology

- **Frontend:** React, Vite, React Router, Tailwind CSS, Lucide React, HTML Audio API.
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT cookies, bcryptjs, Multer, ImageKit, dotenv.

## Repository structure

```text
sonik-app/
├── Backend/
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── app.js
├── Frontend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── config/
│       ├── components/
│       │   ├── dashboard/
│       │   ├── music/
│       │   └── ui/
│       ├── data/
│       ├── pages/
│       │   ├── auth/
│       │   └── landing/
│       ├── index.css
│       └── main.jsx
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── SECURITY.md
└── README.md
```

## Requirements

- Node.js 18 or newer.
- pnpm.
- MongoDB database.
- ImageKit account and private key for audio storage.

## Local setup

Clone the repository and install dependencies independently:

```bash
git clone <repository-url>
cd sonik-app

cd Backend
pnpm install

cd ../Frontend
pnpm install
```

### Configure the backend

Create `Backend/.env` from the example:

```bash
cd Backend
cp .env.example .env
```

Set the required values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### Configure the frontend

Create `Frontend/.env` from the example:

```bash
cd ../Frontend
cp .env.example .env
```

For local development, use:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The frontend falls back to `http://localhost:3000` when this value is missing. Frontend variables are public at build time; never place secrets in them.

### Start locally

Run the backend in one terminal:

```bash
cd Backend
pnpm dev
```

Run the frontend in a second terminal:

```bash
cd Frontend
pnpm dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Frontend routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Listener dashboard |
| `/artist` | Artist dashboard |

Routing is handled by React Router. The API base URL is centralized in `Frontend/src/config/api.js`.

## API overview

Protected endpoints require the HTTP-only JWT cookie.

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a listener or artist |
| `POST` | `/api/auth/login` | Create a login session |
| `POST` | `/api/auth/logout` | Clear the login cookie |
| `GET` | `/api/auth/me` | Get the current user |
| `GET` | `/api/auth/check-username` | Check username availability |

### Music and albums

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/music?page=1&limit=20` | Browse published music |
| `GET` | `/api/music/mine` | List the current artist's tracks |
| `POST` | `/api/music/upload` | Upload an artist track |
| `POST` | `/api/music/album` | Create an album |
| `GET` | `/api/music/albums` | List published albums |
| `GET` | `/api/music/albums/:albumId` | Get an album and its tracks |

Track uploads use multipart form data with `title` and `music` fields. Album creation uses JSON with `title`, `releaseDate`, and a non-empty `musics` array of owned track IDs.

## Render deployment

Deploy the backend as a Render Web Service:

- Root directory: `Backend`
- Build command: `pnpm install`
- Start command: `pnpm start`

Backend environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NODE_ENV=production
CLIENT_ORIGIN=https://your-frontend-service.onrender.com
```

Deploy the frontend as a Render Static Site:

- Root directory: `Frontend`
- Build command: `pnpm build`
- Publish directory: `dist`

Frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

After changing a `VITE_` variable, redeploy the frontend because Vite injects it during the build. Configure the static host to serve `index.html` for unknown routes so React Router routes work after refresh.

## Scripts

### Frontend

```bash
pnpm dev
pnpm build
pnpm lint
```

### Backend

```bash
pnpm dev
pnpm start
```

## Security notes

- Passwords are hashed before storage.
- Authentication uses an HTTP-only JWT cookie.
- Credentialed CORS is restricted through `CLIENT_ORIGIN`.
- Artist-only operations use authorization middleware.
- Never commit `.env` files, database credentials, JWT secrets, ImageKit keys, or uploaded media.
- Saved libraries currently use browser `localStorage` and are not synchronized between devices.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md), [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), and [SECURITY.md](./SECURITY.md) before contributing.

## License

Sonik is available under the MIT License. See [LICENSE](./LICENSE).

Maintained by [Abdul Rahman](https://abdulrdeveloper.me).

# Sonik

Sonik is a full-stack music streaming SaaS experience for listeners and independent artists. It combines a polished React dashboard with a protected Express API for authentication, music publishing, album creation, catalogue discovery, personal libraries, and audio playback.

## Highlights

### Listener experience

- Register and sign in with cookie-based authentication.
- Browse the authenticated music catalogue.
- Discover albums from every artist.
- Open an album and play its songs individually or as a collection.
- Save and remove songs from a personal browser library.
- Use play, pause, previous, next, repeat, progress, and close controls.

### Artist experience

- Publish audio tracks to the catalogue.
- View personal releases and the complete catalogue.
- Create albums from owned songs.
- Publish album metadata and release dates.
- Play and save tracks from the artist dashboard.

## Technology stack

### Frontend

- React 18
- Vite 6
- Tailwind CSS 4
- Lucide React icons
- Browser HTML audio API

### Backend

- Node.js with ES modules
- Express 5
- MongoDB with Mongoose
- JWT authentication stored in HTTP-only cookies
- bcryptjs password hashing
- Multer multipart audio uploads
- ImageKit hosted music files
- dotenv environment configuration

## Project structure

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
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

## Requirements

- Node.js 18 or newer
- pnpm
- MongoDB database
- ImageKit account with a private key

## Local setup

Install dependencies independently for each application:

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

Set each value:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Never commit `.env` or private credentials.

### Start the application

Run the backend:

```bash
cd Backend
pnpm dev
```

The API runs at `http://localhost:3000`.

Run the frontend in a second terminal:

```bash
cd Frontend
pnpm dev
```

The Vite server runs at `http://localhost:5173`.

The frontend currently uses `http://localhost:3000` as its API base URL. The backend CORS configuration allows the local Vite origins `localhost:5173` and `127.0.0.1:5173`.

## API overview

Protected endpoints require the authenticated HTTP-only JWT cookie.

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a listener or artist |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Clear the session cookie |
| `GET` | `/api/auth/me` | Get the current user |
| `GET` | `/api/auth/check-username` | Check username availability |

### Music and albums

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/music?page=1&limit=20` | Browse published music |
| `GET` | `/api/music/mine` | List the current artist's tracks |
| `POST` | `/api/music/upload` | Upload a track as an artist |
| `POST` | `/api/music/album` | Create an album from owned tracks |
| `GET` | `/api/music/albums` | List all published albums |
| `GET` | `/api/music/albums/:albumId` | Get an album and its songs |

Track uploads use multipart form data:

- `title`: track title
- `music`: audio file

Album creation expects JSON containing `title`, `releaseDate`, and a non-empty `musics` array of track IDs owned by the current artist.

## Available scripts

### Frontend

```bash
pnpm dev       # Start Vite development server
pnpm build     # Create a production build
pnpm lint      # Run the configured Vite lint-mode build
```

### Backend

```bash
pnpm dev       # Start the API with Node watch mode
pnpm start     # Start the API normally
```

## Data and security notes

- Passwords are hashed before storage.
- Authentication uses an HTTP-only JWT cookie and credentialed CORS.
- Artist-only operations are protected by artist middleware.
- Album creation validates that every selected track belongs to the authenticated artist.
- Audio files are stored through ImageKit; the database stores hosted URIs and metadata.
- Saved libraries currently use browser `localStorage` and are not shared between devices.

## Contributing

Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before participating.

1. Create a focused branch.
2. Keep changes scoped and consistent with the existing architecture.
3. Run the relevant build or checks locally.
4. Open a pull request describing the behavior changed and how it was tested.

## License

Sonik is licensed under the MIT License. See [LICENSE](./LICENSE).

import { useEffect, useState } from "react";
import { CheckCircle2, Disc3, Play, Plus, Upload } from "lucide-react";
import Button from "../components/ui/Button";
import Player from "../components/music/Player";
import DashboardFrame from "../components/dashboard/DashboardFrame";
import TrackRow from "../components/dashboard/TrackRow";
import { covers } from "../data/appData";
import { API_BASE } from "../config/api";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "No release date";
}

export default function ArtistDashboard({ onExit, onUnauthorized, onLogout }) {
  const [active, setActive] = useState("My library");
  const [profile, setProfile] = useState(null);
  const [music, setMusic] = useState([]);
  const [allMusic, setAllMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(null);
  const [playRequest, setPlayRequest] = useState(0);
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("sonik-library") || "[]"));

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumReleaseDate, setAlbumReleaseDate] = useState("");
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [albumComplete, setAlbumComplete] = useState(false);

  const loadDashboard = async () => {
    setStatus("loading");
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }),
        fetch(`${API_BASE}/api/music/mine`, { credentials: "include" }),
        fetch(`${API_BASE}/api/music?page=1&limit=1000`, { credentials: "include" }),
        fetch(`${API_BASE}/api/music/albums`, { credentials: "include" }),
      ]);
      if (responses.some((response) => response.status === 401)) {
        onUnauthorized();
        return;
      }
      const [profileResult, musicResult, allMusicResult, albumsResult] = await Promise.all(responses.map((response) => response.json()));
      if (!responses[0].ok) throw new Error(profileResult.message || "Unable to load profile");
      if (!responses[1].ok) throw new Error(musicResult.message || "Unable to load releases");
      if (!responses[2].ok) throw new Error(allMusicResult.message || "Unable to load all songs");
      if (!responses[3].ok) throw new Error(albumsResult.message || "Unable to load albums");

      const mapMusic = (items) => items.map((item, index) => ({
        id: item._id || item.id,
        title: item.title,
        artist: item.artist?.username || profileResult.user.username,
        album: "Single",
        time: "--:--",
        cover: covers[index % covers.length],
        uri: item.uri,
      }));
      const loadedMusic = mapMusic(musicResult.musics);
      const loadedAllMusic = mapMusic(allMusicResult.musics);
      const artistAlbums = (albumsResult.albums || []).filter((album) => (album.artist?._id || album.artist) === profileResult.user._id);

      setProfile(profileResult.user);
      setMusic(loadedMusic);
      setAllMusic(loadedAllMusic);
      setAlbums(artistAlbums);
      setCurrent(loadedMusic[0] || null);
      setStatus("ready");
    } catch (requestError) {
      if (requestError.status === 401) {
        onUnauthorized();
        return;
      }
      setError(requestError.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const uploadRelease = async (event) => {
    event.preventDefault();
    if (!file || !title.trim()) {
      setError("Add a title and audio file before uploading.");
      return;
    }
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("title", title.trim());
    body.append("music", file);
    try {
      const response = await fetch(`${API_BASE}/api/music/upload`, { method: "POST", credentials: "include", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Upload failed");
      setTitle("");
      setFile(null);
      setFileInputKey((key) => key + 1);
      setUploadComplete(true);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  };

  const createAlbum = async (event) => {
    event.preventDefault();
    if (!albumTitle.trim() || !albumReleaseDate || selectedMusic.length === 0) {
      setError("Add an album title, release date, and at least one song.");
      return;
    }
    setCreatingAlbum(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/music/album`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: albumTitle.trim(), releaseDate: albumReleaseDate, musics: selectedMusic }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to create album");
      setAlbumTitle("");
      setAlbumReleaseDate("");
      setSelectedMusic([]);
      setAlbumComplete(true);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreatingAlbum(false);
    }
  };

  const toggleSaved = (track) => {
    const next = saved.some((item) => item.uri === track.uri) ? saved.filter((item) => item.uri !== track.uri) : [...saved, track];
    setSaved(next);
    localStorage.setItem("sonik-library", JSON.stringify(next));
  };
  const sourceMusic = active === "All songs" ? allMusic : active === "My library" ? saved : music;
  const visibleMusic = sourceMusic.filter((track) => `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase()));
  const playTrack = (track) => { setCurrent(track); setPlayRequest((request) => request + 1); };
  const playRelative = (direction) => {
    if (!current || !allMusic.length) return;
    const index = allMusic.findIndex((track) => track.uri === current.uri);
    setCurrent(allMusic[(index + direction + allMusic.length) % allMusic.length]);
  };

  const uploadContent = uploadComplete ? <section className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-line bg-paper p-8 text-center shadow-[0_18px_45px_rgba(59,72,57,.08)] sm:p-12"><CheckCircle2 size={64} className="mx-auto text-[#6b9b2f]" strokeWidth={1.5} /><h2 className="mt-4 text-2xl font-semibold">Track uploaded successfully</h2><p className="mt-2 text-sm text-sage">Your release is now available in your catalogue.</p><Button variant="lime" className="mt-6" onClick={() => setUploadComplete(false)}><Upload size={15} /> Upload again</Button></section> : <section className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-line bg-paper p-6 shadow-[0_18px_45px_rgba(59,72,57,.08)] sm:p-10"><div className="mx-auto max-w-xl text-center"><p className="text-sm font-semibold text-moss">Artist tools</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Upload your music.</h2><p className="mt-3 text-sm leading-6 text-sage">Add an audio file to publish it to your catalogue.</p></div><form onSubmit={uploadRelease} className="mx-auto mt-8 max-w-xl rounded-2xl bg-cream p-5 sm:p-6"><label className="block text-sm font-semibold">Track title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your song a name" className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-moss" /></label><label htmlFor="artist-audio-file" className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-moss bg-paper px-4 py-3 hover:bg-[#f0f5db]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-lime"><Upload size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{file ? file.name : "Choose an audio file"}</span><span className="block text-xs text-sage">{file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB selected` : "MP3, WAV or M4A"}</span></span><span className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-paper">Browse</span></label><input id="artist-audio-file" key={fileInputKey} required type="file" accept="audio/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" /><Button type="submit" variant="lime" className="mt-5 w-full" disabled={uploading}>{uploading ? "Publishing…" : <><Upload size={15} /> Publish track</>}</Button></form></section>;

  const albumContent = <section className="mx-auto w-full max-w-3xl rounded-[1.5rem] border border-line bg-paper p-6 shadow-[0_18px_45px_rgba(59,72,57,.08)] sm:p-10"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-moss">Artist catalogue</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em]">Albums</h2><p className="mt-2 text-sm text-sage">Create and review the albums you have published.</p></div><Disc3 className="text-moss" /></div>{albumComplete && <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#eef6d8] p-4 text-sm text-[#527323]"><CheckCircle2 size={20} /> Album published successfully.</div>}{!albumComplete && <form onSubmit={createAlbum} className="mt-6 rounded-2xl bg-cream p-5"><label className="block text-sm font-semibold">Album title<input required value={albumTitle} onChange={(event) => setAlbumTitle(event.target.value)} placeholder="Give your album a name" className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-moss" /></label><label className="mt-4 block text-sm font-semibold">Release date<input required type="date" value={albumReleaseDate} onChange={(event) => setAlbumReleaseDate(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-moss" /></label><fieldset className="mt-4"><legend className="text-sm font-semibold">Choose songs</legend><div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-line bg-paper p-3">{music.length ? music.map((track) => <label key={track.id || track.uri} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-cream"><input type="checkbox" checked={selectedMusic.includes(track.id)} onChange={() => setSelectedMusic((items) => items.includes(track.id) ? items.filter((id) => id !== track.id) : [...items, track.id])} disabled={!track.id} /><span className="truncate text-sm">{track.title}</span></label>) : <p className="text-sm text-sage">Upload a song before creating an album.</p>}</div></fieldset><Button type="submit" variant="lime" className="mt-5 w-full" disabled={creatingAlbum || !music.length}><Plus size={15} />{creatingAlbum ? "Creating…" : "Create album"}</Button></form>}{albumComplete && <Button variant="outline" className="mt-5" onClick={() => setAlbumComplete(false)}><Plus size={15} /> Create new album</Button>}<div className="mt-8 border-t border-line pt-6"><h3 className="font-semibold">Your albums</h3>{albums.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2">{albums.map((album) => <div key={album._id} className="rounded-xl border border-line bg-cream p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-lime text-ink"><Disc3 size={18} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{album.title}</p><p className="text-xs text-sage">{formatDate(album.releaseDate)}</p></div></div></div>)}</div> : <p className="mt-3 text-sm text-sage">You have not created an album yet.</p>}</div></section>;

  const libraryContent = <section className="rounded-2xl border border-line bg-paper p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">{active === "All songs" ? "All songs" : "My library"}</h2><p className="mt-1 text-sm text-sage">{active === "All songs" ? "Listen to every song published on Sonik." : "Your saved songs and personal catalogue."}</p></div><div className="flex items-center gap-3"><span className="text-sm text-sage">{visibleMusic.length} tracks</span><Button variant="ghost" className="px-2" disabled={!visibleMusic.length} onClick={() => playTrack(visibleMusic[0])}><Play size={14} fill="currentColor" /> Play all</Button></div></div>{status === "loading" && <p className="mt-6 text-sm text-sage">Loading songs…</p>}{status === "ready" && !visibleMusic.length && <p className="mt-6 rounded-xl border border-dashed border-line p-5 text-sm text-sage">{active === "My library" ? "Save songs from All songs with the heart button." : "No songs match your search yet."}</p>}{status === "ready" && visibleMusic.length > 0 && <div className="mt-6 space-y-1">{visibleMusic.map((track, index) => <TrackRow key={`${track.uri}-${index}`} track={track} index={index} onPlay={playTrack} saved={saved.some((item) => item.uri === track.uri)} onToggleSaved={toggleSaved} />)}</div>}</section>;
  const content = active === "Upload music" ? uploadContent : active === "Create album" ? albumContent : libraryContent;
  return <DashboardFrame artist active={active} setActive={setActive} onExit={onExit} onLogout={onLogout} onSearch={setQuery}><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm text-sage">Artist studio</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Welcome, {profile?.username || "Artist"}<span className="text-coral">.</span></h1></div></div>{error && <p role="alert" className="mt-5 rounded-xl bg-[#fbe4de] p-4 text-sm text-[#a64f3c]">{error}</p>}{query && <p className="mt-5 text-sm text-sage">Showing releases for “{query}”</p>}<div className="mt-8">{content}</div></div>{current && <div className="mt-10"><Player track={current} playRequest={playRequest} onPrevious={() => playRelative(-1)} onNext={() => playRelative(1)} onClose={() => setCurrent(null)} /></div>}</DashboardFrame>;
}

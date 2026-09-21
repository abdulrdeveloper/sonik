import { useEffect, useState } from "react";
import { ArrowRight, Disc3, Library, Menu, Play, Zap } from "lucide-react";
import Button from "../components/ui/Button";
import Player from "../components/music/Player";
import DashboardFrame from "../components/dashboard/DashboardFrame";
import TrackRow from "../components/dashboard/TrackRow";
import { covers } from "../data/appData";
import { API_BASE } from "../config/api";

export default function ListenerDashboard({ onExit, onUnauthorized, onLogout }) {
  const [active, setActive] = useState("Home");
  const [profile, setProfile] = useState(null);
  const [music, setMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [current, setCurrent] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [albumLoading, setAlbumLoading] = useState(false);
  const [error, setError] = useState("");
  const [playRequest, setPlayRequest] = useState(0);
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("sonik-library") || "[]"));

  const loadDashboard = async () => {
    setStatus("loading");
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }),
        fetch(`${API_BASE}/api/music?page=1&limit=20`, { credentials: "include" }),
        fetch(`${API_BASE}/api/music/albums`, { credentials: "include" }),
      ]);
      if (responses.some((response) => response.status === 401)) {
        onUnauthorized();
        return;
      }
      const [profileResult, musicResult, albumsResult] = await Promise.all(responses.map((response) => response.json()));
      if (!responses.every((response) => response.ok)) throw new Error(profileResult.message || musicResult.message || albumsResult.message || "Could not load your dashboard");
      const loadedMusic = musicResult.musics.map((item, index) => ({ title: item.title, artist: item.artist?.username || "Independent artist", album: "Single", time: "--:--", cover: covers[index % covers.length], uri: item.uri }));
      setProfile(profileResult.user);
      setMusic(loadedMusic);
      setAlbums(albumsResult.albums || []);
      setCurrent(loadedMusic[0] || null);
      setStatus("ready");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const toggleSaved = (track) => {
    const next = saved.some((item) => item.uri === track.uri) ? saved.filter((item) => item.uri !== track.uri) : [...saved, track];
    setSaved(next);
    localStorage.setItem("sonik-library", JSON.stringify(next));
  };

  const playTrack = (track) => {
    if (active === "Home" && music.length && track === music[0]) {
      track = music[Math.floor(Math.random() * music.length)];
    }
    setCurrent(track);
    setPlayRequest((request) => request + 1);
  };

  const playRelative = (direction) => {
    if (!current || !music.length) return;
    const index = music.findIndex((track) => track.uri === current.uri);
    setCurrent(music[(index + direction + music.length) % music.length]);
  };

  const openAlbum = async (album) => {
    setAlbumLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/music/albums/${album._id}`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load album");
      const tracks = (result.album.musics || []).map((item, index) => ({ id: item._id, title: item.title, artist: result.album.artist?.username || "Independent artist", album: result.album.title, time: "--:--", cover: covers[index % covers.length], uri: item.uri }));
      setSelectedAlbum({ ...result.album, tracks });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAlbumLoading(false);
    }
  };

  const visibleMusic = music.filter((track) => {
    const matchesQuery = `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase());
    return active === "Your library" ? saved.some((item) => item.uri === track.uri) && matchesQuery : matchesQuery;
  });

  const albumContent = active !== "All albums" ? null : <section className="rounded-2xl border border-line bg-paper p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">All albums</h2><p className="mt-1 text-sm text-sage">Explore releases from every artist on Sonik.</p></div><Disc3 size={20} className="text-moss" /></div>{albumLoading && <p className="mt-6 text-sm text-sage">Loading album…</p>}{!albumLoading && !selectedAlbum && !albums.length && <p className="mt-6 rounded-xl border border-dashed border-line p-5 text-sm text-sage">No albums have been published yet.</p>}{!selectedAlbum && albums.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{albums.map((album) => <button type="button" key={album._id} onClick={() => openAlbum(album)} className="rounded-xl border border-line bg-cream p-4 text-left hover:border-moss"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-lime text-ink"><Disc3 size={19} /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{album.title}</span><span className="block truncate text-xs text-sage">{album.artist?.username || "Independent artist"}</span></span></div><span className="mt-3 block text-xs text-sage">{new Date(album.releaseDate).toLocaleDateString()}</span></button>)}</div>}{selectedAlbum && <div className="mt-6"><button type="button" className="mb-4 text-sm font-semibold text-moss" onClick={() => setSelectedAlbum(null)}>← Back to all albums</button><div className="rounded-xl bg-cream p-4"><h3 className="text-lg font-semibold">{selectedAlbum.title}</h3><p className="mt-1 text-sm text-sage">{selectedAlbum.artist?.username || "Independent artist"} · {selectedAlbum.tracks.length} songs</p></div><div className="mt-4 space-y-1">{selectedAlbum.tracks.map((track, index) => <TrackRow key={track.id || track.uri} track={track} index={index} onPlay={playTrack} saved={saved.some((item) => item.uri === track.uri)} onToggleSaved={toggleSaved} />)}</div></div>}</section>;

  return <DashboardFrame artist={false} active={active} setActive={setActive} onExit={onExit} onLogout={onLogout} onSearch={setQuery}><div className="mx-auto max-w-6xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-sage">Your listening space</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Good morning, {profile?.username || "Listener"}<span className="text-coral">.</span></h1></div><button className="rounded-full border border-line p-2 text-sage hover:bg-paper lg:hidden" aria-label="Open menu"><Menu size={20} /></button></div>{active === "Home" && <section className="mt-8 overflow-hidden rounded-[1.5rem] bg-ink p-6 text-paper sm:p-8"><div className="max-w-md"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-lime"><Zap size={14} /> Picked for your morning</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.05em] sm:text-4xl">A little light<br /><em className="font-serif font-normal">for the day ahead.</em></h2><p className="mt-4 text-sm leading-6 text-paper/60">A gentle mix of new finds and familiar favorites, made for the first cup.</p><button className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60" disabled={!music.length} onClick={() => playTrack(music[0])}><Play size={15} fill="currentColor" /> Play morning mix</button></div></section>}<div className="mt-10 grid gap-10 xl:grid-cols-[1fr_290px]"><section>{active !== "All albums" && <div className="flex items-center justify-between"><h2 className="text-xl font-semibold tracking-[-.03em]">{active === "Your library" ? "Your library" : active === "Discover" ? "Discover music" : "Recently uploaded"}</h2><div className="flex items-center gap-3"><span className="text-sm text-sage">{visibleMusic.length} tracks</span><Button variant="ghost" className="px-2" disabled={!visibleMusic.length} onClick={() => playTrack(visibleMusic[0])}><Play size={14} fill="currentColor" /> Play all</Button></div></div>}{albumContent}{active !== "All albums" && status === "loading" && <p className="mt-5 text-sm text-sage">Loading your music…</p>}{active !== "All albums" && status === "error" && <p role="alert" className="mt-5 rounded-xl bg-[#fbe4de] p-4 text-sm text-[#a64f3c]">{error}</p>}{active !== "All albums" && status === "ready" && !visibleMusic.length && <p className="mt-5 rounded-xl border border-dashed border-line p-5 text-sm text-sage">{active === "Your library" ? "Save tracks with the heart button and they will appear here." : "No tracks match your search yet."}</p>}{active !== "All albums" && status === "ready" && visibleMusic.length > 0 && <div className="mt-4 space-y-1">{visibleMusic.map((track, index) => <TrackRow key={`${track.uri}-${index}`} track={track} index={index} onPlay={playTrack} saved={saved.some((item) => item.uri === track.uri)} onToggleSaved={toggleSaved} />)}</div>}</section><aside className="rounded-2xl border border-line bg-paper p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Your library</h2><Library size={18} className="text-moss" /></div><p className="mt-2 text-sm leading-6 text-sage">{saved.length} saved tracks ready whenever you are.</p><Button variant="outline" className="mt-5 w-full" onClick={() => setActive("Your library")}>Open library <ArrowRight size={15} /></Button></aside></div></div>{current && <div className="mt-10"><Player track={current} playRequest={playRequest} onPrevious={() => playRelative(-1)} onNext={() => playRelative(1)} onClose={() => setCurrent(null)} /></div>}</DashboardFrame>;
}

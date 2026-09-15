import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ChevronRight,
  CircleHelp,
  Disc3,
  Headphones,
  Heart,
  Home,
  Library,
  ListMusic,
  LogOut,
  Menu,
  Mic2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Repeat,
  Search,
  Settings,
  SkipBack,
  SkipForward,
  Sparkles,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";

const covers = [
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=640&q=65&fm=webp",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=640&q=65&fm=webp",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=640&q=65&fm=webp",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=640&q=65&fm=webp",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=640&q=65&fm=webp",
];
const listenerAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=65&fm=webp",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=65&fm=webp",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=65&fm=webp",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=65&fm=webp",
];
const API_BASE = "http://localhost:3000";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

const tracks = [
  { title: "The Sun Will Find Us", artist: "Maya Lucia", album: "Soft Places", time: "3:42", cover: covers[0] },
  { title: "After the Rain", artist: "Juno Vale", album: "Small Hours", time: "4:08", cover: covers[1] },
  { title: "Bluebird", artist: "Sol & Fern", album: "Open Roads", time: "2:56", cover: covers[2] },
  { title: "City in Bloom", artist: "Tala June", album: "The Long Way Home", time: "3:18", cover: covers[3] },
  { title: "A Quiet Kind of Loud", artist: "Noah Neri", album: "Good Company", time: "3:51", cover: covers[4] },
];

const benefits = [
  { number: "01", title: "Find your next favorite", copy: "Thoughtful mixes made by people, not just patterns.", icon: Sparkles },
  { number: "02", title: "Keep the good stuff", copy: "A calm library for songs you want to come back to.", icon: Library },
  { number: "03", title: "Meet the makers", copy: "Listen closer and follow independent artists directly.", icon: Users },
];

const testimonials = [
  { quote: "Sonik makes discovering music feel personal again. Every listen leads somewhere unexpected.", name: "Nadia R.", role: "Listener in London" },
  { quote: "It gives my releases the context they deserve, not just another play button in a crowded feed.", name: "Theo James", role: "Independent artist" },
  { quote: "The calmest corner of my week. I come for the mixes and stay for the stories behind them.", name: "Mina K.", role: "Listener in Toronto" },
];

function Logo({ onClick }) {
  return (
    <button className="group flex items-center gap-2 text-left" onClick={onClick} aria-label="Go to Sonik home">
      <span className="relative grid h-10 w-10 place-items-center rounded-[1rem] bg-ink shadow-[inset_0_0_0_2px_rgba(201,232,106,.28)] transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
          <path d="M8 22c3-10 6-10 9 0s6 10 9 0 6-10 9 0" fill="none" stroke="#c9e86a" strokeLinecap="round" strokeWidth="3" />
          <path d="M8 28c3-6 6-6 9 0s6 6 9 0 6-6 9 0" fill="none" stroke="#e36d52" strokeLinecap="round" strokeWidth="2" opacity=".95" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-[-0.05em]">sonik<span className="text-coral">.</span></span>
    </button>
  );
}

function CoverArt({ src, alt, className = "", priority = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl bg-[#d8b09a] ${className}`}>
      {!failed && <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className="h-full w-full object-cover" onError={() => setFailed(true)} />}
      {failed && <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#d5b198,#6a7e67)] text-3xl text-paper/80"><Disc3 aria-hidden="true" /></div>}
    </div>
  );
}

function Button({ children, variant = "primary", className = "", props }) {
  const styles = {
    primary: "bg-ink text-paper hover:bg-[#30433c]",
    lime: "bg-lime text-ink hover:bg-[#bddd58]",
    outline: "border border-line bg-transparent text-ink hover:border-ink hover:bg-paper",
    ghost: "text-sage hover:bg-[#eaeade] hover:text-ink",
  };
  return <button className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

function Player({ track = tracks[0], compact = false, onNext, onPrevious, onClose, playRequest = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(null);
  const continuePlaybackRef = useRef(false);
  const shouldPlayRef = useRef(false);

  useEffect(() => {
    setPlaying(false);
    setPlaybackError("");
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    shouldPlayRef.current = continuePlaybackRef.current || playRequest > 0;
    continuePlaybackRef.current = false;
    if (shouldPlayRef.current && audioRef.current?.readyState >= 3) startRequestedTrack();
  }, [track.uri, playRequest]);

  const startRequestedTrack = () => {
    if (!shouldPlayRef.current || !audioRef.current) return;
    const nextPlayback = audioRef.current.play();
    nextPlayback.then(() => {
      setPlaying(true);
      setPlaybackError("");
      shouldPlayRef.current = false;
    }).catch(() => {
      setPlaying(false);
      setPlaybackError("Unable to play this track right now.");
    });
  };

  const togglePlayback = async () => {
    if (!track.uri || !audioRef.current) {
      setPlaybackError("This track does not have an audio file yet.");
      return;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setPlaying(true);
      setPlaybackError("");
    } catch {
      setPlaying(false);
      setPlaybackError("Unable to play this track right now.");
    }
  };

  return (
    <div className={`${compact ? "rounded-2xl border p-3 shadow-sm" : "border-t fixed inset-x-0 bottom-14 z-20 lg:sticky lg:bottom-0"} relative border-line bg-paper/95 backdrop-blur`}>
      <audio ref={audioRef} src={track.uri} onCanPlay={startRequestedTrack} onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)} onEnded={() => { if (repeat && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); return; } if (onNext) { continuePlaybackRef.current = true; onNext(); return; } setPlaying(false); }} onError={() => setPlaybackError("Unable to load this track.")} />
      <button onClick={onClose} className="absolute right-1 top-1 z-10 rounded-full p-1.5 text-sage hover:bg-cream hover:text-ink" aria-label="Close player"><X size={15} /></button>
      <div className={`mx-auto flex max-w-[1440px] items-center gap-3 ${compact ? "" : "px-4 py-3 sm:px-8"}`}>
        <CoverArt src={track.cover} alt={`${track.title} artwork`} className={compact ? "h-12 w-12 rounded-lg" : "h-12 w-12 rounded-lg sm:h-14 sm:w-14"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{track.title}</p>
          <p className="truncate text-xs text-sage">{track.artist}</p>
        </div>
        <div className="hidden min-w-[280px] flex-1 items-center gap-3 md:flex">
          <span className="text-[11px] text-sage">{formatTime(progress)}</span>
          <input aria-label="Track progress" type="range" min="0" max={audioRef.current?.duration || 0} value={progress} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }} className="h-1 flex-1 accent-[#6a7e67]" />
          <span className="text-[11px] text-sage">{track.time}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" className="rounded-full p-2 text-sage hover:bg-cream hover:text-ink disabled:opacity-40" disabled={!onPrevious} onClick={() => { continuePlaybackRef.current = playing; onPrevious?.(); }} aria-label="Previous track"><SkipBack size={17} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition-transform hover:scale-105" onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="ml-0.5" />}</button>
          <button type="button" className="rounded-full p-2 text-sage hover:bg-cream hover:text-ink disabled:opacity-40" disabled={!onNext} onClick={() => { continuePlaybackRef.current = playing; onNext?.(); }} aria-label="Next track"><SkipForward size={17} /></button>
        </div>
        <button onClick={() => setRepeat(!repeat)} className={`hidden rounded-full p-2 hover:bg-cream lg:block ${repeat ? "text-moss" : "text-sage hover:text-ink"}`} aria-label={repeat ? "Disable repeat" : "Repeat current song"}><Repeat size={18} /></button>
        <button className="hidden rounded-full p-2 text-sage hover:bg-cream hover:text-ink lg:block" aria-label="Open queue"><ListMusic size={18} /></button>
      </div>
      {playbackError && <p role="alert" className="mx-4 pb-2 text-right text-xs text-coral sm:mx-8">{playbackError}</p>}
      <div className={`mx-4 h-1 overflow-hidden rounded-full bg-[#e1e5d7] md:hidden ${compact ? "" : "mb-1"}`}><div className="h-full w-[38%] rounded-full bg-moss" /></div>
    </div>
  );
}

function Landing({ onAuth }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-sage md:flex">
          <a href="#why" className="transition-colors hover:text-ink">Why Sonik</a>
          <a href="#artists" className="transition-colors hover:text-ink">For artists</a>
          <a href="#ritual" className="transition-colors hover:text-ink">Our approach</a>
          <a href="#community" className="transition-colors hover:text-ink">Community</a>
          <a href="#about" className="transition-colors hover:text-ink">About</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" onClick={() => onAuth("login")}>Log in</Button>
          <Button variant="lime" onClick={() => onAuth("signup")}>Join Sonik <ArrowRight size={16} /></Button>
        </div>
        <button className="rounded-full p-2 md:hidden" onClick={() => setMenu(!menu)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button>
        {menu && <div className="absolute left-5 right-5 top-[76px] rounded-2xl border border-line bg-paper p-4 shadow-xl md:hidden"><div className="flex flex-col gap-1 text-sm"><a href="#why" onClick={() => setMenu(false)} className="rounded-lg p-3">Why Sonik</a><a href="#artists" onClick={() => setMenu(false)} className="rounded-lg p-3">For artists</a><a href="#ritual" onClick={() => setMenu(false)} className="rounded-lg p-3">Our approach</a><a href="#community" onClick={() => setMenu(false)} className="rounded-lg p-3">Community</a><a href="#about" onClick={() => setMenu(false)} className="rounded-lg p-3">About</a><button className="mt-2 rounded-full bg-ink p-3 font-semibold text-paper" onClick={() => onAuth("signup")}>Join Sonik</button></div></div>}
      </header>

      <main>
        <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-20">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-moss"><span className="h-2 w-2 rounded-full bg-coral" /> Independent music, intentionally</p>
            <h1 className="text-[clamp(3.2rem,7vw,6.4rem)] font-semibold leading-[.92] tracking-[-0.075em]">Hear more.<br /><em className="font-serif font-normal tracking-[-0.055em]">Feel closer.</em></h1>
            <p className="mt-7 max-w-md text-base leading-7 text-sage sm:text-lg">Sonik is a quieter place for discovering music with a point of view — and the people who make it.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button variant="lime" onClick={() => onAuth("signup")}>Start listening <ArrowRight size={15} /></Button><Button variant="outline" onClick={() => document.getElementById("why")?.scrollIntoView()}>See how it works</Button></div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <p className="flex items-center gap-2 text-xs text-sage"><span className="flex -space-x-2">{listenerAvatars.slice(0, 3).map((avatar) => <img key={avatar} src={avatar} alt="" className="h-7 w-7 rounded-full border-2 border-cream object-cover" />)}</span> Join 12,000+ curious listeners</p>
              <span className="hidden h-5 w-px bg-line sm:block" />
              <p className="text-xs font-semibold text-ink"><span className="text-coral">★</span> 4.9 from early listeners</p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[620px]">
            <div className="absolute -right-5 -top-8 h-36 w-36 rounded-full bg-lime/60 blur-2xl" />
            <div className="relative rotate-[2deg] rounded-[1.7rem] bg-[#dfe8c3] p-1.5 shadow-[0_20px_55px_rgba(59,72,57,.14)] sm:rounded-[1.9rem] sm:p-2">
              <CoverArt src={covers[0]} alt="Concert audience enjoying live music" priority className="aspect-[1.25] w-full rounded-[1.35rem] sm:rounded-[1.55rem]" />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-[#23312d]/95 p-4 text-paper shadow-xl sm:bottom-10 sm:left-10 sm:right-10 sm:p-5">
                <div className="flex items-center gap-3"><CoverArt src={covers[1]} alt="" className="h-12 w-12 rounded-lg" /><div className="min-w-0"><p className="truncate text-sm font-semibold">The Sun Will Find Us</p><p className="text-xs text-paper/60">Maya Lucia · Soft Places</p></div><Heart size={17} className="ml-auto text-coral" fill="currentColor" /></div>
                <div className="mt-5 h-1 rounded-full bg-paper/20"><div className="h-full w-[36%] rounded-full bg-lime" /></div>
                <div className="mt-2 flex justify-between text-[10px] text-paper/55"><span>1:16</span><span>3:42</span></div>
                <div className="mt-3 flex items-center justify-center gap-5"><button aria-label="Previous track" className="text-paper/70 hover:text-paper"><SkipBack size={18} fill="currentColor" /></button><button aria-label="Play track" className="grid h-11 w-11 place-items-center rounded-full bg-lime text-ink hover:bg-[#d8f27b]"><Play size={18} fill="currentColor" className="ml-0.5" /></button><button aria-label="Next track" className="text-paper/70 hover:text-paper"><SkipForward size={18} fill="currentColor" /></button></div>
              </div>
            </div>
            <p className="mt-5 text-right text-xs text-sage">A soundtrack for your slow mornings <span className="ml-1 text-coral">✳</span></p>
          </div>
        </section>

        <section id="why" className="border-y border-line bg-paper/45">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-3 md:gap-10 md:py-20 lg:px-12">
            {benefits.map(({ number, title, copy, icon: Icon }) => <div key={number} className="group"><div className="mb-7 flex items-center justify-between"><span className="text-sm font-semibold text-coral">{number}</span><Icon size={19} className="text-moss transition-transform group-hover:rotate-12" /></div><h2 className="text-xl font-semibold tracking-tight">{title}</h2><p className="mt-3 max-w-xs text-sm leading-6 text-sage">{copy}</p><a href={number === "03" ? "#artists" : number === "02" ? "#about" : "#why"} className="mt-5 flex cursor-pointer items-center gap-1 text-sm font-semibold text-ink hover:text-moss">Explore <ChevronRight size={15} /></a></div>)}
          </div>
        </section>

        <section id="artists" className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-28">
          <div className="relative mx-auto w-full max-w-sm"><div className="absolute -bottom-6 -left-5 h-24 w-24 rounded-full bg-coral/30 blur-2xl" /><div className="relative rotate-[-4deg] overflow-hidden rounded-[1.7rem] bg-[#78896b] p-2.5 shadow-[0_18px_45px_rgba(59,72,57,.12)] sm:rounded-[1.85rem] sm:p-3"><CoverArt src={covers[2]} alt="Crowd enjoying a live concert" className="aspect-[.9] w-full rounded-[1.35rem] sm:rounded-[1.5rem]" /><div className="absolute bottom-7 left-7 rounded-xl bg-lime px-3 py-2 text-xs font-bold text-ink">Made for the makers</div></div></div>
          <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">For artists</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">Your music deserves<br /><em className="font-serif font-normal">a real home.</em></h2><p className="mt-5 max-w-md leading-7 text-sage">Share the work behind the songs, grow a thoughtful audience, and keep more of the connection. Sonik puts artists back in the room.</p><Button className="mt-7" onClick={() => onAuth("signup", "artist")}>Make your artist page <ArrowRight size={17} /></Button></div>
        </section>

        <section id="ritual" className="border-y border-line bg-ink text-paper">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[.9fr_1.1fr] md:items-center lg:px-12 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">A better listening ritual</p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[.98] tracking-[-.06em] sm:text-5xl">Less noise.<br /><em className="font-serif font-normal text-lime">More meaning.</em></h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-paper/60">No endless scroll, no algorithmic overload. Sonik gives every release room to breathe, with recommendations shaped by taste and human curiosity.</p>
              <div className="mt-7 flex flex-wrap gap-6 text-sm"><div><p className="text-2xl font-semibold text-lime">24k+</p><p className="mt-1 text-paper/50">songs discovered</p></div><div><p className="text-2xl font-semibold text-lime">860+</p><p className="mt-1 text-paper/50">independent artists</p></div><div><p className="text-2xl font-semibold text-lime">4.9/5</p><p className="mt-1 text-paper/50">community rating</p></div></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <CoverArt src={covers[1]} alt="Singer performing under warm stage lights" className="mt-8 aspect-[.78] w-full rounded-[1.5rem]" />
              <CoverArt src={covers[4]} alt="Musician performing at a live show" className="aspect-[.78] w-full rounded-[1.5rem]" />
            </div>
          </div>
        </section>

        <section id="community" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">From the community</p><h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Good music travels<br /><em className="font-serif font-normal">by word of mouth.</em></h2></div>
            <p className="max-w-xs text-sm leading-6 text-sage">A few words from people building their everyday soundtrack with Sonik.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => <figure key={name} className="rounded-2xl border border-line bg-paper p-6"><div className="flex gap-1 text-coral" aria-label="5 stars">★★★★★</div><blockquote className="mt-5 text-lg leading-7 tracking-[-.02em]">“{quote}”</blockquote><figcaption className="mt-7 border-t border-line pt-4"><p className="text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-sage">{role}</p></figcaption></figure>)}
          </div>
        </section>

        <section className="mx-5 mb-16 overflow-hidden rounded-[2rem] bg-[#dce9a5] sm:mx-8 lg:mx-auto lg:mb-24 lg:max-w-[1392px] lg:rounded-[2.5rem]">
          <div className="grid items-center gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1fr_.65fr] md:px-14 md:py-12 lg:grid-cols-[1fr_360px] lg:px-16">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Your next chapter</p><h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.06em] sm:text-5xl">Make more room for<br /><em className="font-serif font-normal">the music you love.</em></h2><p className="mt-5 max-w-md text-sm leading-6 text-ink/65">Start with one song. Stay for the whole world around it.</p><Button variant="primary" onClick={() => onAuth("signup")} className="mt-7 w-fit">Join Sonik <ArrowRight size={15} /></Button></div>
            <div className="relative mx-auto w-full max-w-[360px]">
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-coral/35 blur-2xl" />
              <div className="relative rotate-[4deg] rounded-[1.5rem] bg-ink p-2 shadow-[0_18px_45px_rgba(28,40,36,.2)]">
                <CoverArt src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=65&fm=webp" alt="Artist singing into a microphone" className="aspect-[1.18] w-full rounded-[1.15rem]" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl border border-paper/15 bg-ink/90 px-3 py-2 text-paper backdrop-blur"><span className="grid h-7 w-7 place-items-center rounded-full bg-lime text-ink"><Play size={12} fill="currentColor" /></span><span className="min-w-0"><span className="block truncate text-[11px] font-semibold">Your next favorite</span><span className="block text-[10px] text-paper/55">The good stuff, on repeat</span></span><Heart size={14} className="ml-auto text-coral" fill="currentColor" /></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="about" className="border-t border-line"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 text-sm text-sage sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} /><p>Music discovery with intention. © 2026 Sonik.</p><div className="flex gap-4"><a href="#why" className="hover:text-ink">About</a><a href="#artists" className="hover:text-ink">Artists</a><a href="#about" className="hover:text-ink">Help</a></div></div></footer>
    </div>
  );
}

function Auth({ mode, initialRole, onBack, onSuccess, onModeChange }) {
  const [authMode, setAuthMode] = useState(mode);
  const [role, setRole] = useState(initialRole || "listener");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [usernameStatus, setUsernameStatus] = useState("idle");

  useEffect(() => {
    setAuthMode(mode);
  }, [mode]);

  useEffect(() => {
    if (authMode !== "signup" || form.username.trim().length < 3) {
      setUsernameStatus("idle");
      return undefined;
    }

    setUsernameStatus("checking");
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/check-username?username=${encodeURIComponent(form.username.trim())}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Username check failed");
        const result = await response.json();
        setUsernameStatus(result.available ? "available" : "taken");
      } catch (requestError) {
        if (requestError.name !== "AbortError") setUsernameStatus("error");
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [authMode, form.username]);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = authMode === "signup" ? "/api/auth/register" : "/api/auth/login";
    const payload = authMode === "signup"
      ? { username: form.username.trim(), email: form.email.trim(), password: form.password, type: role === "artist" ? "artist" : "user" }
      : { username: form.username.trim(), password: form.password };

    if (authMode === "signup" && usernameStatus === "taken") {
      setError("That username is already taken.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Something went wrong");
        onSuccess(role);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  };
  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  return <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-paper">
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-end px-5 py-4 sm:px-8 lg:px-10">
      <button onClick={onBack} className="grid h-10 w-12 cursor-pointer place-items-center rounded-tl-xl rounded-br-xl border border-lime bg-lime text-ink shadow-lg backdrop-blur transition-colors hover:bg-lime hover:text-ink" aria-label="Back home" title="Back home"><ArrowLeft size={18} /></button>
    </header>
    <main className="grid min-h-0 flex-1 lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img src={`${covers[3]}&fit=crop`} alt="A live crowd enjoying an intimate concert" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(28,40,36,.92),rgba(28,40,36,.3)_70%,rgba(28,40,36,.8))]" />
        <div className="relative flex h-full -translate-y-3 flex-col justify-end p-10 text-paper xl:p-16">
          <span className="mb-5 flex w-fit items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3 py-1.5 text-xs font-semibold backdrop-blur"><Sparkles size={13} className="text-lime" /> Music with intention</span>
          <h2 className="max-w-lg text-5xl font-semibold leading-[.95] tracking-[-.06em] xl:text-7xl">Your next favorite song is closer than you think.</h2>
          <p className="mt-6 max-w-md text-sm leading-6 text-paper/65">Join a thoughtful community discovering independent artists, one beautiful release at a time.</p>
          <div className="mt-8 flex items-center gap-3"><span className="flex -space-x-2">{listenerAvatars.map((avatar) => <img key={avatar} src={avatar} alt="" className="h-8 w-8 rounded-full border-2 border-ink object-cover" />)}</span><span className="text-xs text-paper/65">Loved by 12,000+ listeners</span></div>
        </div>
      </div>
      <div className="flex min-h-0 items-center justify-center overflow-hidden px-5 pb-0 pt-8 sm:px-10 lg:px-14 lg:pt-7 xl:px-20">
        <div className="w-full max-w-md -translate-y-3">
          <div className="mb-3"><p className="text-xs font-bold uppercase tracking-[.16em] text-moss">{authMode === "login" ? "Welcome back" : "Join Sonik"}</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">{authMode === "login" ? "Pick up the music." : "Make music personal."}</h1></div>
          {authMode === "signup" && <div className="mb-3 grid gap-2 sm:grid-cols-2"><RoleCard active={role === "listener"} icon={Headphones} title="Listener" copy="Discover & collect" onClick={() => setRole("listener")} /><RoleCard active={role === "artist"} icon={Mic2} title="Artist" copy="Upload & grow" onClick={() => setRole("artist")} /></div>}
          <form onSubmit={submit} className="space-y-3">{<label className="block text-sm font-semibold tracking-[-.01em] text-ink">Username{authMode === "login" && " or email"}<input required minLength={3} value={form.username} onChange={updateField("username")} type="text" className="mt-1.5 h-10 w-full rounded-xl border border-line bg-cream px-4 font-normal outline-none transition-colors focus:border-moss focus:outline-none" placeholder={authMode === "login" ? "you@example.com" : "Choose a unique username"} />{authMode === "signup" && usernameStatus !== "idle" && <span className={`mt-1 block text-xs font-normal tracking-normal ${usernameStatus === "available" ? "text-[#607a27]" : usernameStatus === "taken" ? "text-coral" : "text-sage"}`}>{usernameStatus === "checking" ? "Checking availability…" : usernameStatus === "available" ? "Username is available" : usernameStatus === "taken" ? "Username is already taken" : "Could not check username"}</span>}</label>}{authMode === "signup" && <label className="block text-sm font-semibold tracking-[-.01em] text-ink">Email<input required type="email" value={form.email} onChange={updateField("email")} className="mt-1.5 h-10 w-full rounded-xl border border-line bg-cream px-4 font-normal outline-none transition-colors focus:border-moss focus:outline-none" placeholder="you@example.com" /></label>}<label className="block text-sm font-semibold tracking-[-.01em] text-ink">Password<input required minLength={6} value={form.password} onChange={updateField("password")} type="password" className="mt-1.5 h-10 w-full rounded-xl border border-line bg-cream px-4 font-normal outline-none transition-colors focus:border-moss focus:outline-none" placeholder="At least 6 characters" /></label>{error && <p role="alert" className="rounded-lg bg-[#fbe4de] p-3 text-sm text-[#a64f3c]">{error}</p>}<Button className="w-full" variant="lime" disabled={loading || usernameStatus === "taken"}>{loading ? "Just a moment…" : authMode === "login" ? "Log in" : `Continue as ${role}`}</Button></form>
          <div className="mt-3 border-t border-line pt-3 text-center text-sm text-sage">{authMode === "login" ? "New to Sonik? " : "Already have an account? "}<button className="cursor-pointer font-semibold text-ink underline decoration-moss underline-offset-4" onClick={() => onModeChange(authMode === "login" ? "signup" : "login")}>{authMode === "login" ? "Create an account" : "Log in instead"}</button></div>
        </div>
      </div>
    </main>
  </div>;
}

function RoleCard({ active, icon: Icon, title, copy, onClick }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${active ? "border-moss bg-[#f0f5db]" : "border-line bg-cream hover:border-sage"}`}><span className={`grid h-8 w-8 place-items-center rounded-lg ${active ? "bg-lime" : "bg-paper"}`}><Icon size={16} /></span><span><span className="block text-sm font-semibold">{title}</span><span className="block text-xs text-sage">{copy}</span></span>{active && <span className="ml-auto h-2 w-2 rounded-full bg-moss" />}</button>;
}

function Sidebar({ artist, active, setActive, onExit, onLogout }) {
  const items = artist ? [{ name: "My library", icon: Library }, { name: "Upload music", icon: Upload }, { name: "Create album", icon: Disc3 }, { name: "All songs", icon: Headphones }] : [{ name: "Home", icon: Home }, { name: "Discover", icon: Sparkles }, { name: "All albums", icon: Disc3 }, { name: "Your library", icon: Library }];
  return <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-line bg-paper px-5 py-7 lg:flex"><Logo onClick={onExit} /><nav className="mt-14 space-y-1">{items.map(({ name, icon: Icon }) => <button key={name} onClick={() => setActive(name)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active === name ? "bg-lime text-ink" : "text-sage hover:bg-cream hover:text-ink"}`}><Icon size={18} />{name}</button>)}</nav><div className="mt-auto rounded-2xl bg-ink p-4 text-paper"><p className="text-sm font-semibold">{artist ? "Keep creating" : "Find something new"}</p><p className="mt-1 text-xs leading-5 text-paper/60">{artist ? "Share your next track with listeners." : "A fresh selection is waiting."}</p><button onClick={() => setActive(artist ? "Upload music" : "Discover")} className="mt-4 flex items-center gap-1 text-xs font-semibold text-lime">{artist ? "Upload music" : "Explore picks"} <ArrowRight size={13} /></button></div><button onClick={onLogout} className="mt-5 flex items-center gap-3 px-3 py-2 text-sm text-sage hover:text-ink"><LogOut size={16} /> Log out</button></aside>;
}

function TrackRow({ track, index, onPlay, saved, onToggleSaved }) {
  return <div className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-cream sm:px-3"><span className="w-5 text-center text-xs text-sage group-hover:hidden">{String(index + 1).padStart(2, "0")}</span><button className="hidden w-5 text-center text-ink group-hover:block" aria-label={`Play ${track.title}`} onClick={() => onPlay(track)}><Play size={14} fill="currentColor" /></button><CoverArt src={track.cover} alt="" className="h-12 w-12 rounded-lg" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{track.title}</p><p className="truncate text-xs text-sage">{track.artist} · {track.album}</p></div><span className="hidden text-xs text-sage sm:block">{track.time}</span><button className={`rounded-full p-2 ${saved ? "text-coral" : "text-sage"} hover:bg-paper hover:text-ink`} aria-label={saved ? `Remove ${track.title} from library` : `Save ${track.title} to library`} onClick={() => onToggleSaved(track)}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button></div>;
}

function ListenerDashboard({ onExit, onUnauthorized, onLogout }) {
  const [active, setActive] = useState("Home");
  const [current, setCurrent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [music, setMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("sonik-library") || "[]"));
  const [playRequest, setPlayRequest] = useState(0);

  useEffect(() => {
    let activeRequest = true;
    Promise.all([
      fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }),
      fetch(`${API_BASE}/api/music?page=1&limit=20`, { credentials: "include" }),
      fetch(`${API_BASE}/api/music/albums`, { credentials: "include" }),
    ])
      .then(async ([profileResponse, musicResponse, albumsResponse]) => {
        const profileResult = await profileResponse.json();
        const musicResult = await musicResponse.json();
        const albumsResult = await albumsResponse.json();
        if (!profileResponse.ok || !musicResponse.ok || !albumsResponse.ok) {
          const requestError = new Error(profileResult.message || musicResult.message || albumsResult.message || "Could not load your dashboard");
          requestError.status = [profileResponse, musicResponse, albumsResponse].find((response) => response.status === 401)?.status || musicResponse.status;
          throw requestError;
        }
        if (!activeRequest) return;
        const loadedMusic = musicResult.musics.map((item, index) => ({
          title: item.title,
          artist: item.artist?.username || "Independent artist",
          album: "Single",
          time: "--:--",
          cover: covers[index % covers.length],
          uri: item.uri,
        }));
        setProfile(profileResult.user);
        setMusic(loadedMusic);
        setAlbums(albumsResult.albums || []);
        setCurrent(loadedMusic[0] || null);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (requestError.status === 401) {
          onUnauthorized();
          return;
        }
        if (activeRequest) {
          setError(requestError.message);
          setStatus("error");
        }
      });

    return () => {
      activeRequest = false;
    };
  }, []);

  const toggleSaved = (track) => {
    const next = saved.some((item) => item.uri === track.uri) ? saved.filter((item) => item.uri !== track.uri) : [...saved, track];
    setSaved(next);
    localStorage.setItem("sonik-library", JSON.stringify(next));
  };
  const visibleMusic = music.filter((track) => {
    const matchesQuery = `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(query.toLowerCase());
    return active === "Your library" ? saved.some((item) => item.uri === track.uri) && matchesQuery : matchesQuery;
  });
  const playRelative = (direction) => {
    if (!current || !music.length) return;
    const index = music.findIndex((track) => track.uri === current.uri);
    setCurrent(music[(index + direction + music.length) % music.length]);
  };
  const playTrack = (track) => {
    setCurrent(track);
    setPlayRequest((request) => request + 1);
  };
  const openAlbum = async (album) => {
    setAlbumLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/music/albums/${album._id}`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok) {
        const requestError = new Error(result.message || "Unable to load album");
        requestError.status = response.status;
        throw requestError;
      }
      const tracks = (result.album.musics || []).map((item, index) => ({
        id: item._id,
        title: item.title,
        artist: result.album.artist?.username || "Independent artist",
        album: result.album.title,
        time: "--:--",
        cover: covers[index % covers.length],
        uri: item.uri,
      }));
      setSelectedAlbum({ ...result.album, tracks });
    } catch (requestError) {
      if (requestError.status === 401) {
        onUnauthorized();
        return;
      }
      setError(requestError.message);
    } finally {
      setAlbumLoading(false);
    }
  };

  const displayName = profile?.username || "Listener";
  const albumSection = active === "All albums" ? <section className="rounded-2xl border border-line bg-paper p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">All albums</h2><p className="mt-1 text-sm text-sage">Explore releases from every artist on Sonik.</p></div><Disc3 size={20} className="text-moss" /></div>{albumLoading && <p className="mt-6 text-sm text-sage">Loading album…</p>}{!albumLoading && !selectedAlbum && !albums.length && <p className="mt-6 rounded-xl border border-dashed border-line p-5 text-sm text-sage">No albums have been published yet.</p>}{!selectedAlbum && albums.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{albums.map((album) => <button type="button" key={album._id} onClick={() => openAlbum(album)} className="cursor-pointer rounded-xl border border-line bg-cream p-4 text-left transition-colors hover:border-moss hover:bg-[#f0f5db]"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-lime text-ink"><Disc3 size={19} /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{album.title}</span><span className="block truncate text-xs text-sage">{album.artist?.username || "Independent artist"}</span></span></div><span className="mt-3 block text-xs text-sage">{new Date(album.releaseDate).toLocaleDateString()}</span></button>)}</div>}{selectedAlbum && <div className="mt-6"><button type="button" className="mb-4 cursor-pointer text-sm font-semibold text-moss hover:text-ink" onClick={() => setSelectedAlbum(null)}>← Back to all albums</button><div className="rounded-xl bg-cream p-4"><h3 className="text-lg font-semibold">{selectedAlbum.title}</h3><p className="mt-1 text-sm text-sage">{selectedAlbum.artist?.username || "Independent artist"} · {selectedAlbum.tracks.length} songs</p></div><div className="mt-4 space-y-1">{selectedAlbum.tracks.map((track, index) => <TrackRow key={track.id || track.uri} track={track} index={index} onPlay={playTrack} saved={saved.some((item) => item.uri === track.uri)} onToggleSaved={toggleSaved} />)}</div><Button variant="lime" className="mt-4" disabled={!selectedAlbum.tracks.length} onClick={() => playTrack(selectedAlbum.tracks[0])}><Play size={14} fill="currentColor" /> Play album</Button></div>}</section> : null;
  return <DashboardFrame artist={false} active={active} setActive={setActive} onExit={onExit} onLogout={onLogout} onSearch={setQuery}><div className="mx-auto max-w-6xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-sage">Your listening space</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Good morning, {displayName}<span className="text-coral">.</span></h1></div><button className="rounded-full border border-line p-2 text-sage hover:bg-paper lg:hidden" aria-label="Open menu"><Menu size={20} /></button></div><section className="mt-8 overflow-hidden rounded-[1.5rem] bg-ink p-6 text-paper sm:p-8"><div className="max-w-md"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-lime"><Zap size={14} /> Picked for your morning</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.05em] sm:text-4xl">A little light<br /><em className="font-serif font-normal">for the day ahead.</em></h2><p className="mt-4 text-sm leading-6 text-paper/60">A gentle mix of new finds and familiar favorites, made for the first cup.</p><button className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60" disabled={!music.length} onClick={() => playTrack(music[0])}><Play size={15} fill="currentColor" /> Play morning mix</button></div></section><div className="mt-10 grid gap-10 xl:grid-cols-[1fr_290px]"><section><div className="flex items-center justify-between"><h2 className="text-xl font-semibold tracking-[-.03em]">{active === "All albums" ? "All albums" : active === "Your library" ? "Your library" : active === "Discover" ? "Discover music" : "Recently uploaded"}</h2>{active !== "All albums" && <div className="flex items-center gap-3"><span className="text-sm text-sage">{visibleMusic.length} tracks</span><Button variant="ghost" className="px-2" disabled={!visibleMusic.length} onClick={() => playTrack(visibleMusic[0])}><Play size={14} fill="currentColor" /> Play all</Button></div>}</div>{query && active !== "All albums" && <p className="mt-2 text-sm text-sage">Showing results for “{query}”</p>}{albumSection}{active !== "All albums" && active === "Discover" && albums.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{albums.map((album) => <button type="button" key={album._id} onClick={() => { setActive("All albums"); openAlbum(album); }} className="cursor-pointer rounded-xl border border-line bg-cream p-4 text-left"><p className="truncate text-sm font-semibold">{album.title}</p><p className="mt-1 text-xs text-sage">{album.artist?.username || "Independent artist"}</p></button>)}</div>}{active !== "All albums" && status === "loading" && <p className="mt-5 text-sm text-sage">Loading your music…</p>}{active !== "All albums" && status === "error" && <p role="alert" className="mt-5 rounded-xl bg-[#fbe4de] p-4 text-sm text-[#a64f3c]">{error}</p>}{active !== "All albums" && status === "ready" && !visibleMusic.length && <p className="mt-5 rounded-xl border border-dashed border-line p-5 text-sm text-sage">{active === "Your library" ? "Save tracks with the heart button and they will appear here." : "No tracks match your search yet."}</p>}{active !== "All albums" && status === "ready" && visibleMusic.length > 0 && <div className="mt-4 space-y-1">{visibleMusic.map((track, index) => <TrackRow key={`${track.title}-${index}`} track={track} index={index} onPlay={playTrack} saved={saved.some((item) => item.uri === track.uri)} onToggleSaved={toggleSaved} />)}</div>}</section><aside className="rounded-2xl border border-line bg-paper p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Your library</h2><Library size={18} className="text-moss" /></div><p className="mt-2 text-sm leading-6 text-sage">{saved.length} saved tracks ready whenever you are.</p><Button variant="outline" className="mt-5 w-full" onClick={() => setActive("Your library")}>Open library <ArrowRight size={15} /></Button></aside></div></div>{current && <Player track={current} playRequest={playRequest} onPrevious={() => playRelative(-1)} onNext={() => playRelative(1)} onClose={() => setCurrent(null)} />}</DashboardFrame>;
}

function ArtistDashboard({ onExit, onUnauthorized, onLogout }) {
  const [active, setActive] = useState("My library");
  const [profile, setProfile] = useState(null);
  const [music, setMusic] = useState([]);
  const [allMusic, setAllMusic] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumReleaseDate, setAlbumReleaseDate] = useState("");
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [current, setCurrent] = useState(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("sonik-library") || "[]"));
  const [playRequest, setPlayRequest] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(0);

  const loadDashboard = () => {
    setStatus("loading");
    Promise.all([
      fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }),
      fetch(`${API_BASE}/api/music/mine`, { credentials: "include" }),
      fetch(`${API_BASE}/api/music?page=1&limit=1000`, { credentials: "include" }),
    ])
      .then(async ([profileResponse, musicResponse, allMusicResponse]) => {
        if (profileResponse.status === 401 || musicResponse.status === 401 || allMusicResponse.status === 401) {
          onUnauthorized();
          return;
        }
        const profileResult = await profileResponse.json();
        const musicResult = await musicResponse.json();
        const allMusicResult = await allMusicResponse.json();
        if (!profileResponse.ok) throw new Error(profileResult.message || "Unable to load profile");
        if (!musicResponse.ok) throw new Error(musicResult.message || "Unable to load releases");
        if (!allMusicResponse.ok) throw new Error(allMusicResult.message || "Unable to load all songs");
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
        setProfile(profileResult.user);
        setMusic(loadedMusic);
        setAllMusic(loadedAllMusic);
        setCurrent(loadedMusic[0] || null);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (requestError.status === 401) {
          onUnauthorized();
          return;
        }
        setError(requestError.message);
        setStatus("error");
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const uploadRelease = (event) => {
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
    const request = new XMLHttpRequest();
    request.open("POST", `${API_BASE}/api/music/upload`);
    request.withCredentials = true;
    request.onload = () => {
      let result;
      try {
        result = JSON.parse(request.responseText);
      } catch {
        result = { message: "Upload failed" };
      }
      if (request.status < 200 || request.status >= 300) {
        const requestError = new Error(result.message || "Upload failed");
        requestError.status = request.status;
        setError(requestError.message);
        if (requestError.status === 401) onUnauthorized();
        setUploading(false);
        return;
      }
      setTitle("");
      setFile(null);
      setFileInputKey((key) => key + 1);
      setUploading(false);
      loadDashboard();
    };
    request.onerror = () => {
      setError("Upload failed. Check your connection and try again.");
      setUploading(false);
    };
    request.send(body);
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
      const response = await fetch(`${API_BASE}/api/music/album`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: albumTitle.trim(), releaseDate: albumReleaseDate, musics: selectedMusic }),
      });
      const result = await response.json();
      if (!response.ok) {
        const requestError = new Error(result.message || "Unable to create album");
        requestError.status = response.status;
        throw requestError;
      }
      setAlbumTitle("");
      setAlbumReleaseDate("");
      setSelectedMusic([]);
      setActive("My library");
    } catch (requestError) {
      if (requestError.status === 401) {
        onUnauthorized();
        return;
      }
      setError(requestError.message);
    } finally {
      setCreatingAlbum(false);
    }
  };

  const displayName = profile?.username || "Artist";
  const toggleSaved = (track) => {
    const next = saved.some((item) => item.uri === track.uri) ? saved.filter((item) => item.uri !== track.uri) : [...saved, track];
    setSaved(next);
    localStorage.setItem("sonik-library", JSON.stringify(next));
  };
  const sourceMusic = active === "All songs" ? allMusic : active === "My library" ? saved : music;
  const visibleMusic = sourceMusic.filter((track) => `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase()));
  const playArtistRelative = (direction) => {
    if (!current || !allMusic.length) return;
    const index = allMusic.findIndex((track) => track.uri === current.uri);
    setCurrent(allMusic[(index + direction + allMusic.length) % allMusic.length]);
  };
  const playTrack = (track) => {
    setCurrent(track);
    setPlayRequest((request) => request + 1);
  };
  const content = active === "Upload music"
    ? <section className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-line bg-paper p-6 shadow-[0_18px_45px_rgba(59,72,57,.08)] sm:p-10"><div className="mx-auto max-w-xl text-center"><p className="text-sm font-semibold text-moss">Artist tools</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Upload your music.</h2><p className="mt-3 text-sm leading-6 text-sage">Add an audio file to publish it to your catalogue and make it available in All songs.</p></div><form onSubmit={uploadRelease} className="mx-auto mt-8 max-w-xl rounded-2xl bg-cream p-5 sm:p-6"><label className="block text-sm font-semibold">Track title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your song a name" className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-moss" /></label><div className="mt-5"><p className="text-sm font-semibold">Audio file</p><label htmlFor="artist-audio-file" className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-moss bg-paper px-4 py-3 transition-colors hover:bg-[#f0f5db]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-lime"><Upload size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{file ? file.name : "Choose an audio file"}</span><span className="block text-xs text-sage">{file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB selected` : "MP3, WAV or M4A · up to your server limit"}</span></span><span className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-paper">Browse</span></label><input id="artist-audio-file" key={fileInputKey} required type="file" accept="audio/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" /></div><Button type="submit" variant="lime" className="mt-5 w-full" disabled={uploading}>{uploading ? "Publishing…" : <><Upload size={15} /> Publish track</>}</Button></form></section>
    : active === "Create album"
      ? <section className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-line bg-paper p-6 shadow-[0_18px_45px_rgba(59,72,57,.08)] sm:p-10"><div className="mx-auto max-w-xl text-center"><p className="text-sm font-semibold text-moss">Artist tools</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Create an album.</h2><p className="mt-3 text-sm leading-6 text-sage">Bundle your published songs into an album for listeners.</p></div><form onSubmit={createAlbum} className="mx-auto mt-8 max-w-xl rounded-2xl bg-cream p-5 sm:p-6"><label className="block text-sm font-semibold">Album title<input required value={albumTitle} onChange={(event) => setAlbumTitle(event.target.value)} placeholder="Give your album a name" className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-moss" /></label><label className="mt-5 block text-sm font-semibold">Release date<input required type="date" value={albumReleaseDate} onChange={(event) => setAlbumReleaseDate(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-moss" /></label><fieldset className="mt-5"><legend className="text-sm font-semibold">Choose songs</legend><div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-line bg-paper p-3">{music.length ? music.map((track) => <label key={track.id || track.uri} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-cream"><input type="checkbox" checked={selectedMusic.includes(track.id)} onChange={() => setSelectedMusic((items) => items.includes(track.id) ? items.filter((id) => id !== track.id) : [...items, track.id])} disabled={!track.id} /><span className="truncate text-sm">{track.title}</span></label>) : <p className="text-sm text-sage">Upload a song before creating an album.</p>}</div></fieldset><Button type="submit" variant="lime" className="mt-5 w-full" disabled={creatingAlbum || !music.length}>{creatingAlbum ? "Publishing…" : <><Plus size={15} /> Publish album</>}</Button></form></section>
      : <section className="rounded-2xl border border-line bg-paper p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">{active === "All songs" ? "All songs" : "My library"}</h2><p className="mt-1 text-sm text-sage">{active === "All songs" ? "Listen to every song published on Sonik." : "Your saved songs and personal catalogue."}</p></div><div className="flex items-center gap-3"><span className="text-sm text-sage">{visibleMusic.length} tracks</span><Button variant="ghost" className="px-2" disabled={!visibleMusic.length}     onClick={() => playTrack(visibleMusic[0])}><Play size={14} fill="currentColor" /> Play all</Button></div></div>{status === "loading" && <p className="mt-6 text-sm text-sage">Loading songs…</p>}{status === "ready" && !visibleMusic.length && <p className="mt-6 rounded-xl border border-dashed border-line p-5 text-sm text-sage">{active === "My library" ? "Save songs from All songs with the heart button." : "No songs match your search yet."}</p>}{status === "ready" && visibleMusic.length > 0 && <div className="mt-6 space-y-1">{visibleMusic.map((track, index) =>     <TrackRow key={`${track.uri}-${index}`} track={track} index={index} onPlay={playTrack} saved={saved.some((item) => item.uri === track.uri)} onToggleSaved={toggleSaved} />)}</div>}</section>;
  return <DashboardFrame artist active={active} setActive={setActive} onExit={onExit} onLogout={onLogout} onSearch={setQuery}><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm text-sage">Artist studio</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Welcome, {displayName}<span className="text-coral">.</span></h1></div></div>{error && <p role="alert" className="mt-5 rounded-xl bg-[#fbe4de] p-4 text-sm text-[#a64f3c]">{error}</p>}{query && <p className="mt-5 text-sm text-sage">Showing releases for “{query}”</p>}<div className="mt-8">{content}</div></div>{current && <div className="mt-10">    <Player track={current} playRequest={playRequest} onPrevious={() => playArtistRelative(-1)} onNext={() => playArtistRelative(1)} onClose={() => setCurrent(null)} /></div>}</DashboardFrame>;
}

function Stat({ label, value, trend }) {
  return <div className="rounded-2xl border border-line bg-paper p-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-sage">{label}</p><div className="mt-4 flex items-end justify-between gap-2"><p className="text-3xl font-semibold tracking-[-.06em]">{value}</p><span className="rounded-full bg-[#e8f0ce] px-2 py-1 text-[11px] font-semibold text-[#607a27]">{trend}</span></div></div>;
}

function DashboardFrame({ children, artist, active, setActive, onExit, onLogout, onSearch }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return <div className="flex min-h-screen bg-cream"><Sidebar artist={artist} active={active} setActive={setActive} onExit={onExit} onLogout={onLogout} /><div className="flex min-w-0 flex-1 flex-col"><header className="relative flex min-h-[76px] items-center justify-between border-b border-line bg-cream/90 px-5 py-3 sm:px-8 lg:px-10"><div className="lg:hidden"><Logo onClick={onExit} /></div><div className="ml-auto flex items-center gap-2"><button onClick={() => setSearchOpen(!searchOpen)} className="rounded-full p-2 text-sage hover:bg-paper" aria-label="Search"><Search size={19} /></button><button onClick={() => setSettingsOpen(!settingsOpen)} className="rounded-full p-2 text-sage hover:bg-paper" aria-label="Settings"><Settings size={19} /></button><span className="ml-2 grid h-9 w-9 place-items-center rounded-full bg-[#d8b198] text-sm font-semibold">AM</span></div>{searchOpen && <div className="absolute right-5 top-[68px] z-40 w-[min(90vw,360px)] rounded-xl border border-line bg-paper p-3 shadow-xl sm:right-8"><input autoFocus onChange={(event) => onSearch?.(event.target.value)} placeholder={artist ? "Search songs…" : "Search tracks and artists…"} className="h-10 w-full rounded-lg border border-line bg-cream px-3 text-sm outline-none focus:border-moss" /></div>}{settingsOpen && <div className="absolute right-5 top-[68px] z-40 w-56 rounded-xl border border-line bg-paper p-3 shadow-xl sm:right-8"><p className="px-2 pb-2 text-xs font-bold uppercase tracking-[.14em] text-sage">Account</p><button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-sage hover:bg-cream hover:text-ink"><LogOut size={16} /> Log out</button></div>}</header><main className="flex-1 px-5 py-8 pb-28 sm:px-8 lg:px-10 lg:pb-8">{children}</main><nav className={`fixed bottom-0 left-0 right-0 z-30 grid border-t border-line bg-paper/95 px-3 py-2 backdrop-blur lg:hidden ${artist ? "grid-cols-4" : "grid-cols-4"}`}>{(artist ? [{ name: "My library", icon: Library }, { name: "Upload music", icon: Upload }, { name: "Create album", icon: Disc3 }, { name: "All songs", icon: Headphones }] : [{ name: "Home", icon: Home }, { name: "Discover", icon: Sparkles }, { name: "All albums", icon: Disc3 }, { name: "Your library", icon: Library }]).map(({ name, icon: Icon }) => <button key={name} onClick={() => setActive(name)} className={`flex flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-semibold ${active === name ? "text-ink" : "text-sage"}`}><Icon size={18} />{name}</button>)}</nav></div></div>;
}

export default function App() {
  const getRoute = () => {
    const path = window.location.pathname;
    if (path === "/login") return { screen: "auth", authMode: "login" };
    if (path === "/signup") return { screen: "auth", authMode: "signup" };
    if (path === "/dashboard") return { screen: "listener" };
    if (path === "/artist") return { screen: "artist" };
    return { screen: "landing", authMode: "signup" };
  };
  const initialRoute = getRoute();
  const [screen, setScreen] = useState(initialRoute.screen);
  const [authMode, setAuthMode] = useState(initialRoute.authMode);
  const [initialRole, setInitialRole] = useState("listener");
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    const route = getRoute();
    setAuthMode(route.authMode || "signup");
    setScreen(route.screen);
  };
  useEffect(() => {
    const handlePopState = () => {
      const route = getRoute();
      setAuthMode(route.authMode || "signup");
      setScreen(route.screen);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const showAuth = (mode = "signup", role = "listener") => {
    setInitialRole(role);
    setAuthMode(mode);
    window.history.pushState({}, "", mode === "login" ? "/login" : "/signup");
    setScreen("auth");
  };
  const changeAuthMode = (mode) => {
    setAuthMode(mode);
    window.history.pushState({}, "", mode === "login" ? "/login" : "/signup");
  };
  const goHome = () => navigate("/");
  const logout = () => {
    fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" })
      .finally(() => navigate("/login"));
  };
  const app = useMemo(() => {
    if (screen === "listener") return <ListenerDashboard onExit={goHome} onLogout={logout} onUnauthorized={() => navigate("/login")} />;
    if (screen === "artist") return <ArtistDashboard onExit={goHome} onLogout={logout} onUnauthorized={() => navigate("/login")} />;
    if (screen === "auth") return <Auth mode={authMode} initialRole={initialRole} onBack={goHome} onModeChange={changeAuthMode} onSuccess={(role) => navigate(role === "artist" ? "/artist" : "/dashboard")} />;
    return <Landing onAuth={showAuth} />;
  }, [screen, authMode, initialRole]);
  return app;
}

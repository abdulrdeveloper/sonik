import { useEffect, useRef, useState } from "react";
import {
  ListMusic,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import CoverArt from "./CoverArt";
import { tracks } from "../../data/appData";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default function Player({
  track = tracks[0],
  compact = false,
  onNext,
  onPrevious,
  onClose,
  playRequest = 0,
}) {
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
    if (shouldPlayRef.current && audioRef.current?.readyState >= 3)
      startRequestedTrack();
  }, [track.uri, playRequest]);

  const startRequestedTrack = () => {
    if (!shouldPlayRef.current || !audioRef.current) return;
    const nextPlayback = audioRef.current.play();
    nextPlayback
      .then(() => {
        setPlaying(true);
        setPlaybackError("");
        shouldPlayRef.current = false;
      })
      .catch(() => {
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
    <div
      className={`${compact ? "rounded-2xl border p-3 shadow-sm" : "border-t fixed inset-x-0 bottom-14 z-20 lg:sticky lg:bottom-0"} relative border-line bg-paper/95 backdrop-blur`}
    >
      <audio
        ref={audioRef}
        src={track.uri}
        onCanPlay={startRequestedTrack}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onEnded={() => {
          if (repeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
          }
          if (onNext) {
            continuePlaybackRef.current = true;
            onNext();
            return;
          }
          setPlaying(false);
        }}
        onError={() => setPlaybackError("Unable to load this track.")}
      />
      <button
        onClick={onClose}
        className="absolute right-1 top-1 z-10 rounded-full p-1.5 text-sage hover:bg-cream hover:text-ink"
        aria-label="Close player"
      >
        <X size={15} />
      </button>
      <div
        className={`mx-auto flex max-w-[1440px] items-center gap-3 ${compact ? "" : "px-4 py-3 sm:px-8"}`}
      >
        <CoverArt
          src={track.cover}
          alt={`${track.title} artwork`}
          className={
            compact
              ? "h-12 w-12 rounded-lg"
              : "h-12 w-12 rounded-lg sm:h-14 sm:w-14"
          }
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{track.title}</p>
          <p className="truncate text-xs text-sage">{track.artist}</p>
        </div>
        <div className="hidden min-w-[280px] flex-1 items-center gap-3 md:flex">
          <span className="text-[11px] text-sage">{formatTime(progress)}</span>
          <input
            aria-label="Track progress"
            type="range"
            min="0"
            max={audioRef.current?.duration || 0}
            value={progress}
            onChange={(event) => {
              if (audioRef.current)
                audioRef.current.currentTime = Number(event.target.value);
            }}
            className="h-1 flex-1 accent-[#6a7e67]"
          />
          <span className="text-[11px] text-sage">{track.time}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-sage hover:bg-cream hover:text-ink disabled:opacity-40"
            disabled={!onPrevious}
            onClick={() => {
              continuePlaybackRef.current = playing;
              onPrevious?.();
            }}
            aria-label="Previous track"
          >
            <SkipBack size={17} />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition-transform hover:scale-105"
            onClick={togglePlayback}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-sage hover:bg-cream hover:text-ink disabled:opacity-40"
            disabled={!onNext}
            onClick={() => {
              continuePlaybackRef.current = playing;
              onNext?.();
            }}
            aria-label="Next track"
          >
            <SkipForward size={17} />
          </button>
        </div>
        <button
          onClick={() => setRepeat(!repeat)}
          className={`hidden rounded-full p-2 hover:bg-cream lg:block ${repeat ? "text-moss" : "text-sage hover:text-ink"}`}
          aria-label={repeat ? "Disable repeat" : "Repeat current song"}
        >
          <Repeat size={18} />
        </button>
        <button
          className="hidden rounded-full p-2 text-sage hover:bg-cream hover:text-ink lg:block"
          aria-label="Open queue"
        >
          <ListMusic size={18} />
        </button>
      </div>
      {playbackError && (
        <p
          role="alert"
          className="mx-4 pb-2 text-right text-xs text-coral sm:mx-8"
        >
          {playbackError}
        </p>
      )}
      <div
        className={`mx-4 h-1 overflow-hidden rounded-full bg-[#e1e5d7] md:hidden ${compact ? "" : "mb-1"}`}
      >
        <div className="h-full w-[38%] rounded-full bg-moss" />
      </div>
    </div>
  );
}

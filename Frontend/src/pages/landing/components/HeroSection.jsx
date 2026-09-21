import { ArrowRight, Heart, Play, SkipBack, SkipForward } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import CoverArt from "../../../components/music/CoverArt";
import { covers, listenerAvatars } from "../../../data/appData";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-20">
      <div className="max-w-xl">
        <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-moss">
          <span className="h-2 w-2 rounded-full bg-coral" /> Independent music,
          intentionally
        </p>
        <h1 className="text-[clamp(3.2rem,7vw,6.4rem)] font-semibold leading-[.92] tracking-[-0.075em]">
          Hear more.
          <br />
          <em className="font-serif font-normal tracking-[-0.055em]">
            Feel closer.
          </em>
        </h1>
        <p className="mt-7 max-w-md text-base leading-7 text-sage sm:text-lg">
          Sonik is a quieter place for discovering music with a point of view —
          and the people who make it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="lime" onClick={() => navigate("/signup")}>
            Start listening <ArrowRight size={15} />
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById("why")?.scrollIntoView()}
          >
            See how it works
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <p className="flex items-center gap-2 text-xs text-sage">
            <span className="flex -space-x-2">
              {listenerAvatars.slice(0, 3).map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt=""
                  className="h-7 w-7 rounded-full border-2 border-cream object-cover"
                />
              ))}
            </span>{" "}
            Join 12,000+ curious listeners
          </p>
          <span className="hidden h-5 w-px bg-line sm:block" />
          <p className="text-xs font-semibold text-ink">
            <span className="text-coral">★</span> 4.9 from early listeners
          </p>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-[620px]">
        <div className="absolute -right-5 -top-8 h-36 w-36 rounded-full bg-lime/60 blur-2xl" />
        <div className="relative rotate-[2deg] rounded-[1.7rem] bg-[#dfe8c3] p-1.5 shadow-[0_20px_55px_rgba(59,72,57,.14)] sm:rounded-[1.9rem] sm:p-2">
          <CoverArt
            src={covers[0]}
            alt="Concert audience enjoying live music"
            priority
            className="aspect-[1.25] w-full rounded-[1.35rem] sm:rounded-[1.55rem]"
          />
          <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-[#23312d]/95 p-4 text-paper shadow-xl sm:bottom-10 sm:left-10 sm:right-10 sm:p-5">
            <div className="flex items-center gap-3">
              <CoverArt
                src={covers[1]}
                alt=""
                className="h-12 w-12 rounded-lg"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  The Sun Will Find Us
                </p>
                <p className="text-xs text-paper/60">
                  Maya Lucia · Soft Places
                </p>
              </div>
              <Heart
                size={17}
                className="ml-auto text-coral"
                fill="currentColor"
              />
            </div>
            <div className="mt-5 h-1 rounded-full bg-paper/20">
              <div className="h-full w-[36%] rounded-full bg-lime" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-paper/55">
              <span>1:16</span>
              <span>3:42</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-5">
              <button
                aria-label="Previous track"
                className="text-paper/70 hover:text-paper"
              >
                <SkipBack size={18} fill="currentColor" />
              </button>
              <button
                aria-label="Play track"
                className="grid h-11 w-11 place-items-center rounded-full bg-lime text-ink hover:bg-[#d8f27b]"
              >
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </button>
              <button
                aria-label="Next track"
                className="text-paper/70 hover:text-paper"
              >
                <SkipForward size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-5 text-right text-xs text-sage">
          A soundtrack for your slow mornings{" "}
          <span className="ml-1 text-coral">✳</span>
        </p>
      </div>
    </section>
  );
}

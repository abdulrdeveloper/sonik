import { ArrowRight, Heart, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import CoverArt from "../../../components/music/CoverArt";

export default function LandingCta() {
  const navigate = useNavigate();
  return (
    <section className="mx-5 mb-16 overflow-hidden rounded-[2rem] bg-[#dce9a5] sm:mx-8 lg:mx-auto lg:mb-24 lg:max-w-[1392px] lg:rounded-[2.5rem]">
      <div className="grid items-center gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1fr_.65fr] md:px-14 md:py-12 lg:grid-cols-[1fr_360px] lg:px-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
            Your next chapter
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.06em] sm:text-5xl">
            Make more room for
            <br />
            <em className="font-serif font-normal">the music you love.</em>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-ink/65">
            Start with one song. Stay for the whole world around it.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/signup")}
            className="mt-7 w-fit"
          >
            Join Sonik <ArrowRight size={15} />
          </Button>
        </div>
        <div className="relative mx-auto w-full max-w-[360px]">
          <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-coral/35 blur-2xl" />
          <div className="relative rotate-[4deg] rounded-[1.5rem] bg-ink p-2 shadow-[0_18px_45px_rgba(28,40,36,.2)]">
            <CoverArt
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=65&fm=webp"
              alt="Artist singing into a microphone"
              className="aspect-[1.18] w-full rounded-[1.15rem]"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl border border-paper/15 bg-ink/90 px-3 py-2 text-paper backdrop-blur">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-lime text-ink">
                <Play size={12} fill="currentColor" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-semibold">
                  Your next favorite
                </span>
                <span className="block text-[10px] text-paper/55">
                  The good stuff, on repeat
                </span>
              </span>
              <Heart
                size={14}
                className="ml-auto text-coral"
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import CoverArt from "../../../components/music/CoverArt";
import { covers } from "../../../data/appData";

function ArtistSection() {
  const navigate = useNavigate();
  return (
    <section
      id="artists"
      className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -bottom-6 -left-5 h-24 w-24 rounded-full bg-coral/30 blur-2xl" />
        <div className="relative rotate-[-4deg] overflow-hidden rounded-[1.7rem] bg-[#78896b] p-2.5 shadow-[0_18px_45px_rgba(59,72,57,.12)] sm:rounded-[1.85rem] sm:p-3">
          <CoverArt
            src={covers[2]}
            alt="Crowd enjoying a live concert"
            className="aspect-[.9] w-full rounded-[1.35rem] sm:rounded-[1.5rem]"
          />
          <div className="absolute bottom-7 left-7 rounded-xl bg-lime px-3 py-2 text-xs font-bold text-ink">
            Made for the makers
          </div>
        </div>
      </div>
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">
          For artists
        </p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
          Your music deserves
          <br />
          <em className="font-serif font-normal">a real home.</em>
        </h2>
        <p className="mt-5 max-w-md leading-7 text-sage">
          Share the work behind the songs, grow a thoughtful audience, and keep
          more of the connection. Sonik puts artists back in the room.
        </p>
        <Button className="mt-7" onClick={() => navigate("/signup", { state: { role: "artist" } })}>
          Make your artist page <ArrowRight size={17} />
        </Button>
      </div>
    </section>
  );
}

export default ArtistSection;

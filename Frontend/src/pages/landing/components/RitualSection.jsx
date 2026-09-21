import CoverArt from "../../../components/music/CoverArt";
import { covers } from "../../../data/appData";

export default function RitualSection() {
  return (
    <section id="ritual" className="border-y border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[.9fr_1.1fr] md:items-center lg:px-12 lg:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">
            A better listening ritual
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[.98] tracking-[-.06em] sm:text-5xl">
            Less noise.
            <br />
            <em className="font-serif font-normal text-lime">More meaning.</em>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-paper/60">
            No endless scroll, no algorithmic overload. Sonik gives every
            release room to breathe, with recommendations shaped by taste and
            human curiosity.
          </p>
          <div className="mt-7 flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-2xl font-semibold text-lime">24k+</p>
              <p className="mt-1 text-paper/50">songs discovered</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-lime">860+</p>
              <p className="mt-1 text-paper/50">independent artists</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-lime">4.9/5</p>
              <p className="mt-1 text-paper/50">community rating</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <CoverArt
            src={covers[1]}
            alt="Singer performing under warm stage lights"
            className="mt-8 aspect-[.78] w-full rounded-[1.5rem]"
          />
          <CoverArt
            src={covers[4]}
            alt="Musician performing at a live show"
            className="aspect-[.78] w-full rounded-[1.5rem]"
          />
        </div>
      </div>
    </section>
  );
}

import { ChevronRight } from "lucide-react";
import { benefits } from "../../../data/appData";

function BenefitsSection() {
  return (
    <section id="why" className="border-y border-line bg-paper/45">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-3 md:gap-10 md:py-20 lg:px-12">
        {benefits.map(({ number, title, copy, icon: Icon }) => (
          <div key={number} className="group">
            <div className="mb-7 flex items-center justify-between">
              <span className="text-sm font-semibold text-coral">{number}</span>
              <Icon
                size={19}
                className="text-moss transition-transform group-hover:rotate-12"
              />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-sage">{copy}</p>
            <a
              href={
                number === "03"
                  ? "#artists"
                  : number === "02"
                    ? "#about"
                    : "#why"
              }
              className="mt-5 flex cursor-pointer items-center gap-1 text-sm font-semibold text-ink hover:text-moss"
            >
              Explore <ChevronRight size={15} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;

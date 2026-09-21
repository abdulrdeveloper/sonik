import { testimonials } from "../../../data/appData";

function CommunitySection() {
  return (
    <section
      id="community"
      className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">
            From the community
          </p>
          <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
            Good music travels
            <br />
            <em className="font-serif font-normal">by word of mouth.</em>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-6 text-sage">
          A few words from people building their everyday soundtrack with Sonik.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {testimonials.map(({ quote, name, role }) => (
          <figure
            key={name}
            className="rounded-2xl border border-line bg-paper p-6"
          >
            <div className="flex gap-1 text-coral" aria-label="5 stars">
              ★★★★★
            </div>
            <blockquote className="mt-5 text-lg leading-7 tracking-[-.02em]">
              “{quote}”
            </blockquote>
            <figcaption className="mt-7 border-t border-line pt-4">
              <p className="text-sm font-semibold">{name}</p>
              <p className="mt-1 text-xs text-sage">{role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default CommunitySection;

export default function Logo({ onClick }) {
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

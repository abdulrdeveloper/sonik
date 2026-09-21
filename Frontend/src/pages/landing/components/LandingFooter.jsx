export default function LandingFooter() {
  return (
    <footer id="about" className="border-t border-line bg-paper/50">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-[11px] text-sage sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 Sonik. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="https://github.com/abdulrdeveloper/sonik" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">GitHub</a>
            <span className="text-line">·</span>
            <span>Built by <a href="https://abdulrdeveloper.me" target="_blank" rel="noreferrer" className="font-semibold text-ink transition-colors hover:text-coral">abdulrdeveloper</a></span>
          </div>
      </div>
    </footer>
  );
}

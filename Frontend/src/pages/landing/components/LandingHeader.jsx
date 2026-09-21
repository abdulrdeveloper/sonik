import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Logo from "../../../components/ui/Logo";

export default function LandingHeader() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setMenu(false);
  const links = [
    ["Why Sonik", "#why"],
    ["For artists", "#artists"],
    ["Our approach", "#ritual"],
    ["Community", "#community"],
    ["About", "#about"],
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 mx-auto flex max-w-[1440px] items-center justify-between px-3 py-3 transition-colors duration-300 sm:px-8 lg:px-12 ${scrolled ? "bg-paper/95 shadow-sm backdrop-blur" : "bg-transparent"}`}
    >
      <Logo />
      <nav className="hidden items-center gap-8 text-sm font-medium text-sage md:flex">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="transition-colors hover:text-ink"
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="hidden items-center gap-2 md:flex">
        <Button variant="ghost" onClick={() => navigate("/login")}>
          Log in
        </Button>
        <Button variant="lime" onClick={() => navigate("/signup")}>
          Join Sonik <ArrowRight size={16} />
        </Button>
      </div>
      <button
        className="rounded-full p-2 md:hidden"
        onClick={() => setMenu(!menu)}
        aria-label={menu ? "Close menu" : "Open menu"}
        aria-expanded={menu}
      >
        {menu ? <X /> : <Menu />}
      </button>
      {menu && (
        <div className="absolute left-5 right-5 top-[76px] rounded-2xl border border-line bg-paper p-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-lg p-3"
              >
                {label}
              </a>
            ))}
            <button
              className="mt-2 rounded-full bg-ink p-3 font-semibold text-paper"
              onClick={() => navigate("/signup")}
            >
              Join Sonik
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

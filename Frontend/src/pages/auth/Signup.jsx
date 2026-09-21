import { useEffect, useState } from "react";
import { ArrowLeft, Headphones, Mic2, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { covers, listenerAvatars } from "../../data/appData";
import { API_BASE } from "../../config/api";

function RoleCard({ active, icon: Icon, title, copy, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${active ? "border-moss bg-[#f0f5db]" : "border-line bg-cream hover:border-sage"}`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-lg ${active ? "bg-lime" : "bg-paper"}`}
      >
        <Icon size={16} />
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-sage">{copy}</span>
      </span>
      {active && <span className="ml-auto h-2 w-2 rounded-full bg-moss" />}
    </button>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || "listener");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setRole(location.state?.role || "listener"), [location.key]);

  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameStatus("idle");
      return undefined;
    }
    setUsernameStatus("checking");
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/check-username?username=${encodeURIComponent(username.trim())}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Username check failed");
        const result = await response.json();
        setUsernameStatus(result.available ? "available" : "taken");
      } catch (requestError) {
        if (requestError.name !== "AbortError") setUsernameStatus("error");
      }
    }, 350);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [username]);

  const submitSignup = async (event) => {
    event.preventDefault();
    setError("");
    if (usernameStatus === "taken") {
      setError("That username is already taken.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          type: role === "artist" ? "artist" : "user",
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to create account");
      navigate(role === "artist" ? "/artist" : "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-paper">
      <header className="absolute inset-x-0 top-0 z-10 flex justify-end px-5 py-4 sm:px-8 lg:px-10">
        <button
          onClick={() => navigate("/")}
          className="grid h-10 w-12 place-items-center rounded-tl-xl rounded-br-xl border border-lime bg-lime text-ink shadow-lg"
          aria-label="Back home"
        >
          <ArrowLeft size={18} />
        </button>
      </header>
      <main className="grid min-h-0 flex-1 lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-ink lg:block">
          <img
            src={`${covers[3]}&fit=crop`}
            alt="A live crowd enjoying an intimate concert"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(28,40,36,.92),rgba(28,40,36,.3)_70%,rgba(28,40,36,.8))]" />
          <div className="relative flex h-full flex-col justify-end p-10 text-paper xl:p-16">
            <span className="mb-5 flex w-fit items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3 py-1.5 text-xs font-semibold">
              <Sparkles size={13} className="text-lime" /> Music with intention
            </span>
            <h2 className="max-w-lg text-5xl font-semibold leading-[.95] tracking-[-.06em] xl:text-7xl">
              Your next favorite song is closer than you think.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-paper/65">
              Join a thoughtful community discovering independent artists, one
              beautiful release at a time.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="flex -space-x-2">
                {listenerAvatars.map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-ink object-cover"
                  />
                ))}
              </span>
              <span className="text-xs text-paper/65">
                Loved by 12,000+ listeners
              </span>
            </div>
          </div>
        </section>
        <section className="flex min-h-0 items-center justify-center px-5 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-moss">
              Join Sonik
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">
              Make music personal.
            </h1>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <RoleCard
                active={role === "listener"}
                icon={Headphones}
                title="Listener"
                copy="Discover & collect"
                onClick={() => setRole("listener")}
              />
              <RoleCard
                active={role === "artist"}
                icon={Mic2}
                title="Artist"
                copy="Upload & grow"
                onClick={() => setRole("artist")}
              />
            </div>
            <form onSubmit={submitSignup} className="mt-4 space-y-3">
              <label className="block text-sm font-semibold text-ink">
                Username
                <input
                  required
                  minLength={3}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-cream px-4 font-normal outline-none focus:border-moss"
                  placeholder="Choose a unique username"
                />
                {usernameStatus !== "idle" && (
                  <span
                    className={`mt-1 block text-xs font-normal ${usernameStatus === "available" ? "text-[#607a27]" : usernameStatus === "taken" ? "text-coral" : "text-sage"}`}
                  >
                    {usernameStatus === "checking"
                      ? "Checking availability…"
                      : usernameStatus === "available"
                        ? "Username is available"
                        : usernameStatus === "taken"
                          ? "Username is already taken"
                          : "Could not check username"}
                  </span>
                )}
              </label>
              <label className="block text-sm font-semibold text-ink">
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-cream px-4 font-normal outline-none focus:border-moss"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-semibold text-ink">
                Password
                <input
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-cream px-4 font-normal outline-none focus:border-moss"
                  placeholder="At least 6 characters"
                />
              </label>
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-[#fbe4de] p-3 text-sm text-[#a64f3c]"
                >
                  {error}
                </p>
              )}
              <Button
                className="w-full"
                variant="lime"
                disabled={loading || usernameStatus === "taken"}
              >
                {loading ? "Just a moment…" : `Continue as ${role}`}
              </Button>
            </form>
            <div className="mt-4 border-t border-line pt-4 text-center text-sm text-sage">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-ink underline decoration-moss underline-offset-4"
              >
                Log in instead
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

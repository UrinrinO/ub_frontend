import { useState, type ReactNode } from "react";

interface Props {
  storageKey: string;
  password: string;
  children: ReactNode;
}

export default function PasswordGate({ storageKey, password, children }: Props) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(storageKey) === "1",
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === password) {
      sessionStorage.setItem(storageKey, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] flex items-center justify-center">
      <div className="border border-black/10 bg-white p-10 w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40">
            Access Required
          </p>
          <p className="font-display text-3xl text-black leading-tight">
            Private Area
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Enter password"
            autoFocus
            className="w-full border border-black/15 px-4 py-3 font-mono text-sm bg-transparent focus:outline-none focus:border-black/40 transition placeholder:text-black/30"
          />
          {error && (
            <p className="font-mono text-xs text-red-500 uppercase tracking-widest">
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-mono text-sm hover:opacity-90 transition"
          >
            Unlock →
          </button>
        </form>
      </div>
    </div>
  );
}

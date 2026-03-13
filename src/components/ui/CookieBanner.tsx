import { useState, useEffect } from "react";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-foreground/10">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-foreground/70 flex-1">
          This site uses cookies to analyse traffic and improve your experience.
          By continuing, you consent to our use of cookies in accordance with{" "}
          <a href="/privacy" className="underline hover:text-foreground transition-colors">
            our privacy policy
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-full border border-foreground/30 text-foreground/70 hover:border-foreground hover:text-foreground transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-full bg-foreground text-white hover:opacity-80 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

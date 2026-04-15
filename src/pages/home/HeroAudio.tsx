import { useEffect, useRef, useState } from "react";

const PLAYER_ID = "yt-audio-player";

// ─── Hook: one player instance, shared state ─────────────────────────────────

export function useHeroAudio() {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    function initPlayer() {
      new (window as any).YT.Player(PLAYER_ID, {
        height: "1",
        width: "1",
        videoId: "NSRWbIBf_vA",
        playerVars: { start: 77, autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: any) => {
            playerRef.current = e.target;
            e.target.seekTo(77.20, true);
            e.target.pauseVideo();
            setReady(true);
          },
          onStateChange: (e: any) => setPlaying(e.data === 1),
        },
      });
    }

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.stopVideo?.();
      playerRef.current = null;
    };
  }, []);

  function toggle() {
    const p = playerRef.current;
    if (!p || !ready) return;
    playing ? p.pauseVideo() : p.playVideo();
  }

  return { ready, playing, toggle };
}

// ─── Hidden iframe — render exactly once ─────────────────────────────────────

export function HeroAudioPlayer() {
  return (
    <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
      <div id={PLAYER_ID} />
    </div>
  );
}

// ─── Button — render in desktop and mobile, shares state via props ────────────

export function HeroAudioButton({
  ready,
  playing,
  toggle,
}: {
  ready: boolean;
  playing: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      disabled={!ready}
      aria-label={playing ? "Pause music" : "Play music"}
      className="flex items-center gap-2.5 text-foreground/40 hover:text-foreground/70 transition disabled:opacity-30 disabled:cursor-not-allowed group"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full border border-foreground/15 group-hover:border-foreground/30 transition">
        {playing ? (
          <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor">
            <rect x="0" y="0" width="2.5" height="10" rx="1" />
            <rect x="5.5" y="0" width="2.5" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" className="translate-x-px">
            <path d="M0 0l8 5-8 5V0z" />
          </svg>
        )}
      </span>
      <span className="font-mono text-xs tracking-wide">
        {playing ? "Now playing" : "Favorite coding music"}
      </span>
    </button>
  );
}

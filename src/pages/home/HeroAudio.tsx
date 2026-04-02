import { useEffect, useRef, useState } from "react";

export default function HeroAudio({ playerId = "yt-audio-player" }: { playerId?: string }) {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    function initPlayer() {
      new (window as any).YT.Player(playerId, {
        height: "1",
        width: "1",
        videoId: "NSRWbIBf_vA",
        playerVars: {
          start: 77,
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e: any) => {
            // Assign from e.target — constructor return is a stub before ready
            playerRef.current = e.target;
            e.target.seekTo(77.20, true);
            setReady(true);
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === 1);
          },
        },
      });
    }

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
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
    const player = playerRef.current;
    if (!player || !ready) return;
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* YouTube iframe — 1×1px, technically visible per ToS */}
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        <div id={playerId} />
      </div>

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
    </div>
  );
}

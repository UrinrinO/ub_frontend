import { useEffect, useRef, useState } from "react";

const STORAGE_POS = "weekFocusSticky_pos";
const STORAGE_COLLAPSED = "weekFocusSticky_collapsed";

export default function WeekFocusSticky({ text }: { text: string }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_COLLAPSED) === "true";
  });

  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { x: Math.max(0, window.innerWidth - 280), y: 96 };
  });

  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem(STORAGE_COLLAPSED, String(collapsed));
  }, [collapsed]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Only drag from the header handle, not the content
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    ref.current?.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const next = {
      x: Math.max(0, Math.min(window.innerWidth - 240, e.clientX - dragOffset.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.current.y)),
    };
    setPos(next);
    localStorage.setItem(STORAGE_POS, JSON.stringify(next));
  }

  function onPointerUp() {
    dragging.current = false;
  }

  const lines = text.split("\n").filter((l) => l.trim());

  return (
    <div
      ref={ref}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-40 w-80 select-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Tape strip */}
      <div className="flex justify-center -mb-1.5 relative z-10 pointer-events-none">
        <div className="w-18 h-6 bg-[#d6d0b8]/70 border border-[#c8c2a8]/80 rounded-sm" />
      </div>

      {/* Paper */}
      <div
        className="relative shadow-[2px_6px_18px_rgba(0,0,0,0.18)]"
        style={{ background: "#f5f0de" }}
      >
        {/* Ruled lines (decorative) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, #b8a87a 23px, #b8a87a 24px)",
            backgroundPositionY: "36px",
          }}
        />

        {/* Drag handle / header */}
        <div
          className="flex items-center justify-between px-4 pt-3 pb-2 cursor-grab active:cursor-grabbing relative"
          onPointerDown={onPointerDown}
        >
          <span style={{ fontFamily: "'Caveat', cursive" }} className="text-[24px] text-black/40">
            This week's focus
          </span>
          <button
            className="text-black/30 hover:text-black/60 transition text-sm leading-none ml-2 cursor-pointer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "▾" : "▴"}
          </button>
        </div>

        {/* Content */}
        {!collapsed && (
          <ul className="px-4 pb-4 space-y-2 relative">
            {lines.map((line, i) => (
              <li
                key={i}
                className="text-[18px] leading-snug text-black/75 tracking-wide"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

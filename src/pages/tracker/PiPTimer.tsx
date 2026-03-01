import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { paused, resumed, clockOutOpened } from "../../store/trackerSlice";
import { trackerApi } from "./tracker.api";

function formatTimer(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

function labelCategory(cat: string) {
  return cat.replaceAll("_", " ");
}

export default function PiPTimer() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, activeCategory, seconds } = useSelector(
    (s: RootState) => s.tracker,
  );

  async function handlePause() {
    try {
      await trackerApi.pause();
      dispatch(paused());
    } catch (e) {
      console.error(e);
    }
  }

  async function handleResume() {
    try {
      await trackerApi.resume();
      dispatch(resumed());
    } catch (e) {
      console.error(e);
    }
  }

  async function handleClockOut() {
    try {
      if (status === "ACTIVE") await trackerApi.pause();
      dispatch(clockOutOpened());
    } catch (e) {
      console.error(e);
    }
  }

  const dotClass =
    status === "ACTIVE"
      ? "bg-green-500"
      : status === "PAUSED"
        ? "bg-yellow-500"
        : "bg-black/30";

  const statusText =
    status === "ACTIVE"
      ? `${activeCategory ? labelCategory(activeCategory) : "ACTIVE"}`
      : status === "PAUSED"
        ? "PAUSED"
        : "IDLE";

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "#f6f5f2",
        height: "100%",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Status line */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background:
              status === "ACTIVE"
                ? "#22c55e"
                : status === "PAUSED"
                  ? "#eab308"
                  : "rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.45)",
          }}
        >
          {statusText}
        </span>
      </div>

      {/* Timer */}
      <div
        style={{
          fontSize: 42,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "#000",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {formatTimer(seconds)}
      </div>

      {/* Controls */}
      {status !== "IDLE" && (
        <div style={{ display: "flex", gap: 8 }}>
          {status === "ACTIVE" ? (
            <button
              onClick={handlePause}
              style={btnStyle("outline")}
            >
              Pause
            </button>
          ) : (
            <button
              onClick={handleResume}
              style={btnStyle("solid")}
            >
              Resume
            </button>
          )}
          <button
            onClick={handleClockOut}
            style={btnStyle("ghost")}
          >
            Clock Out
          </button>
        </div>
      )}
    </div>
  );
}

function btnStyle(variant: "solid" | "outline" | "ghost"): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "5px 12px",
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.04em",
    cursor: "pointer",
    border: "1px solid",
    transition: "opacity 0.15s",
  };
  if (variant === "solid")
    return { ...base, background: "#000", color: "#fff", borderColor: "#000" };
  if (variant === "outline")
    return { ...base, background: "#fff", color: "#000", borderColor: "rgba(0,0,0,0.6)" };
  return { ...base, background: "transparent", color: "rgba(0,0,0,0.45)", borderColor: "rgba(0,0,0,0.15)" };
}

import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import PiPTimer from "./PiPTimer";

// Minimal type declaration for the Document PiP API (Chrome 116+)
declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow(options?: {
        width?: number;
        height?: number;
      }): Promise<Window>;
    };
  }
}

function copyStylesToWindow(target: Window) {
  const sourceSheets = [...document.styleSheets];
  sourceSheets.forEach((sheet) => {
    try {
      if (sheet.href) {
        const link = target.document.createElement("link");
        link.rel = "stylesheet";
        link.href = sheet.href;
        target.document.head.appendChild(link);
      } else {
        const style = target.document.createElement("style");
        [...sheet.cssRules].forEach((rule) => {
          style.textContent += rule.cssText;
        });
        target.document.head.appendChild(style);
      }
    } catch {
      // Cross-origin sheets may throw — safe to skip
    }
  });
}

export function usePiP() {
  const pipWindowRef = useRef<Window | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(async () => {
    if (!window.documentPictureInPicture) {
      alert(
        "Picture-in-Picture is not supported in this browser.\nUse Chrome 116+ or Edge 116+.",
      );
      return;
    }

    // If already open, close it
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
      return;
    }

    const pipWin = await window.documentPictureInPicture.requestWindow({
      width: 300,
      height: 150,
    });

    copyStylesToWindow(pipWin);

    // Reset body styles so PiP fills its window cleanly
    pipWin.document.body.style.margin = "0";
    pipWin.document.body.style.height = "100vh";

    const container = pipWin.document.createElement("div");
    container.style.height = "100%";
    pipWin.document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <Provider store={store}>
        <PiPTimer />
      </Provider>,
    );

    pipWindowRef.current = pipWin;
    setIsOpen(true);

    pipWin.addEventListener("pagehide", () => {
      root.unmount();
      pipWindowRef.current = null;
      setIsOpen(false);
    });
  }, []);

  // Clean up if the Tracker page unmounts while PiP is open
  useEffect(() => {
    return () => {
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
      }
    };
  }, []);

  return { openPiP: open, isPiPOpen: isOpen };
}

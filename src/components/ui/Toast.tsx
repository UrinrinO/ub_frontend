import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RiCloseLine, RiErrorWarningLine, RiInformationLine, RiAlertLine } from "@remixicon/react";

type ToastType = "error" | "warning" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const ToastContext = createContext<{ add: (type: ToastType, msg: string) => void }>({
  add: () => {},
});

const STYLES: Record<ToastType, { wrapper: string; icon: string; IconComp: typeof RiCloseLine }> = {
  error: {
    wrapper: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-500",
    IconComp: RiErrorWarningLine,
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200 text-amber-800",
    icon: "text-amber-500",
    IconComp: RiAlertLine,
  },
  info: {
    wrapper: "bg-foreground border-white/10 text-white/90",
    icon: "text-white/60",
    IconComp: RiInformationLine,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const add = useCallback((type: ToastType, message: string) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const { wrapper, icon, IconComp } = STYLES[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 border rounded-2xl px-4 py-3 shadow-lg pointer-events-auto ${wrapper}`}
            >
              <IconComp size={18} className={`shrink-0 mt-0.5 ${icon}`} />
              <p className="text-sm leading-relaxed flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-50 hover:opacity-100 transition mt-0.5"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const { add } = useContext(ToastContext);
  return useMemo(
    () => ({
      error: (msg: string) => add("error", msg),
      warning: (msg: string) => add("warning", msg),
      info: (msg: string) => add("info", msg),
    }),
    [add],
  );
}

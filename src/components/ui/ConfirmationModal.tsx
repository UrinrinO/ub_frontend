interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  destructive = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-black/10 p-8 max-w-sm w-full mx-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-black/50">
            Confirm
          </p>
          <h2 className="font-display text-2xl leading-tight">{title}</h2>
          <p className="text-black/60 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 font-mono text-sm transition ${
              destructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-black/20 font-mono text-sm text-black/60 hover:border-black/50 hover:text-black transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

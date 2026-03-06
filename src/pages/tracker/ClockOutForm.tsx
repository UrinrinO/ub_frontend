import { useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { reset, clockOutFormClosed, weekLoaded } from "../../store/trackerSlice";
import { trackerApi } from "./tracker.api";
import { getMondayYYYYMMDD } from "./tracker.utils";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

interface Props {
  seconds: number;
  minMinutes?: number;
}

function RatingSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">
        {label}
      </p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 border font-mono text-sm transition ${
              value === n
                ? "bg-black text-white border-black"
                : "border-black/20 text-black/60 hover:border-black/50"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ClockOutForm({ seconds, minMinutes = 25 }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [workedOn, setWorkedOn] = useState("");
  const [output, setOutput] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [focus, setFocus] = useState(3);
  const [saving, setSaving] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const toast = useToast();

  const elapsedMinutes = Math.floor(seconds / 60);
  const remainingMinutes = Math.max(0, minMinutes - elapsedMinutes);
  const canSave = elapsedMinutes >= minMinutes && workedOn.trim() && output.trim();

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await trackerApi.clockOut({ workedOn, output, difficulty, focus });
      const week = await trackerApi.getWeek(getMondayYYYYMMDD());
      dispatch(weekLoaded(week));
      dispatch(reset());
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleAbandon() {
    try {
      await trackerApi.abandonSession();
      const week = await trackerApi.getWeek(getMondayYYYYMMDD());
      dispatch(weekLoaded(week));
      dispatch(reset());
    } catch (e) {
      toast.error(String(e));
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Time warning */}
        {remainingMinutes > 0 && (
          <p className="font-mono text-xs text-yellow-600 uppercase tracking-wide">
            Minimum {minMinutes} min required. {remainingMinutes} min remaining.
          </p>
        )}

        {/* workedOn */}
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase tracking-widest text-black/50">
            What did you work on? *
          </label>
          <textarea
            value={workedOn}
            onChange={(e) => setWorkedOn(e.target.value)}
            placeholder="Describe the work..."
            rows={3}
            className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-black/40 placeholder:text-black/30"
          />
        </div>

        {/* output */}
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase tracking-widest text-black/50">
            Output achieved? *
          </label>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="e.g. Solved 3 Leetcode mediums, read ch. 4"
            rows={2}
            className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-black/40 placeholder:text-black/30"
          />
        </div>

        {/* Ratings */}
        <div className="flex flex-wrap gap-8">
          <RatingSelector
            label="Difficulty"
            value={difficulty}
            onChange={setDifficulty}
          />
          <RatingSelector
            label="Focus Level"
            value={focus}
            onChange={setFocus}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="px-8 py-3 bg-black text-white font-mono text-sm transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Session"}
          </button>

          <button
            onClick={() => dispatch(clockOutFormClosed())}
            className="font-mono text-sm text-black/50 hover:text-black transition"
          >
            Cancel
          </button>

          <button
            onClick={() => setShowAbandonConfirm(true)}
            className="ml-auto font-mono text-sm text-red-500 hover:text-red-700 transition"
          >
            Delete Session
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showAbandonConfirm}
        title="Delete this session?"
        message="This session will be marked as abandoned and won't count towards your weekly total. This cannot be undone."
        confirmLabel="Delete Session"
        destructive
        onConfirm={handleAbandon}
        onCancel={() => setShowAbandonConfirm(false)}
      />
    </>
  );
}

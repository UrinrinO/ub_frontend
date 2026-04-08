import { useEffect, useState, useCallback } from "react";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";
import type { ReportNotes, WeekReport, TrackerCategory } from "../tracker/tracker.types";

/* ─── helpers ────────────────────────────────────────────────────────────── */

function addWeeks(yyyymmdd: string, n: number) {
  const d = new Date(`${yyyymmdd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n * 7);
  return d.toISOString().slice(0, 10);
}

function fmtMins(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
}

const ML_PLATFORM_ITEMS = [
  "Feature engineering improved",
  "Model training updated",
  "Evaluation logic refined",
  "MLflow tracking improved",
  "Deployment updated",
  "Monitoring enhanced",
  "Drift detection worked on",
  "Code refactored",
  "Documentation updated",
];

/* ─── field components ───────────────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-xs uppercase tracking-widest text-black/40">{label}</p>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-black/10 px-3 py-2 font-mono text-sm bg-transparent focus:outline-none focus:border-black/30 rounded transition placeholder:text-black/20"
    />
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
      placeholder={placeholder}
      className="w-full border border-black/10 px-3 py-2 font-mono text-sm bg-transparent focus:outline-none focus:border-black/30 rounded transition placeholder:text-black/20"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-black/10 px-3 py-2 font-mono text-sm bg-transparent focus:outline-none focus:border-black/30 rounded transition resize-none placeholder:text-black/20"
    />
  );
}

function YNToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-5 h-5 border flex items-center justify-center shrink-0 rounded transition ${
          value ? "border-black bg-black text-white" : "border-black/20 bg-transparent"
        }`}
      >
        {value && <span className="text-xs leading-none">✓</span>}
      </button>
      <span className="font-mono text-sm text-black/70">{label}</span>
    </label>
  );
}

function SectionHeader({
  label,
  mins,
  targetMins,
}: {
  label: string;
  mins?: number;
  targetMins?: number;
}) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <p className="font-mono text-sm uppercase tracking-widest text-black/50">{label}</p>
      {mins !== undefined && targetMins !== undefined && targetMins > 0 && (
        <p className="font-mono text-xs text-black/40">
          {fmtMins(mins)} / {fmtMins(targetMins)}
        </p>
      )}
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */

export default function AdminReport() {
  const [weekStart, setWeekStart] = useState(getMondayYYYYMMDD);
  const [weekNumber, setWeekNumber] = useState<number | undefined>();
  const [notes, setNotes] = useState<ReportNotes>({});
  const [sessions, setSessions] = useState<WeekReport | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [categories, setCategories] = useState<TrackerCategory[]>([]);

  useEffect(() => {
    trackerApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  function catTarget(key: string) {
    return categories.find((c) => c.key === key)?.targetMinutes ?? 0;
  }

  const patch = useCallback(<K extends keyof ReportNotes>(key: K, val: ReportNotes[K]) => {
    setNotes((prev) => ({ ...prev, [key]: val }));
    setSaveState("idle");
  }, []);

  useEffect(() => {
    setSessions(null);
    setNotes({});
    setWeekNumber(undefined);
    trackerApi
      .getWeeklyReport(weekStart)
      .then(({ sessions: s, report }) => {
        setSessions(s);
        if (report) {
          setWeekNumber(report.weekNumber ?? undefined);
          setNotes((report.notes as ReportNotes) ?? {});
        }
      })
      .catch(console.error);
  }, [weekStart]);

  async function handleSave() {
    setSaveState("saving");
    try {
      await trackerApi.saveWeeklyReport(weekStart, weekNumber, notes);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  const totalHours = sessions ? (sessions.totalMinutes / 60).toFixed(1) : "--";
  const pct = sessions?.percent ?? 0;

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Weekly Checklist
          </p>
          <h1 className="font-display text-3xl text-foreground/90">Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart((w) => addWeeks(w, -1))}
            className="px-3 py-2 border border-black/15 font-mono text-xs hover:border-black/30 rounded transition"
          >
            ←
          </button>
          <span className="font-mono text-xs text-black/50 px-2">
            Week of {weekStart}
          </span>
          <button
            onClick={() => setWeekStart((w) => addWeeks(w, 1))}
            className="px-3 py-2 border border-black/15 font-mono text-xs hover:border-black/30 rounded transition"
          >
            →
          </button>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-5 mb-5">
        <div className="flex items-baseline gap-6 flex-wrap">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-widest text-black/40">Week #</p>
            <input
              type="number"
              value={weekNumber ?? ""}
              onChange={(e) => {
                setWeekNumber(e.target.value === "" ? undefined : Number(e.target.value));
                setSaveState("idle");
              }}
              placeholder="—"
              className="w-20 border border-black/10 px-3 py-2 font-mono text-sm bg-transparent focus:outline-none focus:border-black/30 rounded transition"
            />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-widest text-black/40">Total Hours</p>
            <p className="font-display text-4xl leading-none">
              {totalHours}
              <span className="text-black/30 text-2xl"> / 14h</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-widest text-black/40">Progress</p>
            <p className="font-display text-4xl leading-none">{pct}%</p>
          </div>
        </div>

        {sessions && (
          <div className="h-[2px] bg-black/10">
            <div className="h-full bg-black transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}

        {Number(totalHours) < 12 && sessions !== null && (
          <Field label="If < 12h — explain why">
            <TextArea
              value={notes.totalHoursNote ?? ""}
              onChange={(v) => patch("totalHoursNote", v)}
              placeholder="What got in the way this week?"
            />
          </Field>
        )}

        {sessions && (
          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const mins = sessions.perCategory[cat.key] ?? 0;
              if (!mins && !cat.targetMinutes) return null;
              const barPct =
                cat.targetMinutes > 0
                  ? Math.min(100, Math.round((mins / cat.targetMinutes) * 100))
                  : 100;
              return (
                <div key={cat.key}>
                  <div className="flex justify-between font-mono text-xs text-black/50 mb-1">
                    <span>{cat.label}</span>
                    <span>
                      {fmtMins(mins)}
                      {cat.targetMinutes > 0 ? ` / ${fmtMins(cat.targetMinutes)}` : ""}
                    </span>
                  </div>
                  <div className="h-[2px] bg-black/10">
                    <div className="h-full bg-black" style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JOB APPLICATIONS */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader
          label="Job Applications"
          mins={sessions?.perCategory["JOB_APPLICATIONS"]}
          targetMins={catTarget("JOB_APPLICATIONS")}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Applications submitted (with breakdown)">
            <TextInput
              value={notes.applicationsSubmitted ?? ""}
              onChange={(v) => patch("applicationsSubmitted", v)}
              placeholder="e.g. 5 (3 LinkedIn, 1 referral, 1 direct)"
            />
          </Field>
          <Field label="Tailored CV updates">
            <TextInput
              value={notes.cvUpdates ?? ""}
              onChange={(v) => patch("cvUpdates", v)}
              placeholder="e.g. 1 for referral application"
            />
          </Field>
          <Field label="Networking messages sent">
            <NumberInput
              value={notes.networkingMessages}
              onChange={(v) => patch("networkingMessages", v)}
              placeholder="0"
            />
          </Field>
          <Field label="Interviews scheduled">
            <NumberInput
              value={notes.interviewsScheduled}
              onChange={(v) => patch("interviewsScheduled", v)}
              placeholder="0"
            />
          </Field>
        </div>
      </div>

      {/* ALGORITHMS */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader
          label="Algorithms"
          mins={sessions?.perCategory["ALGORITHMS"]}
          targetMins={catTarget("ALGORITHMS")}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Problems solved">
            <NumberInput
              value={notes.algorithmsSolved}
              onChange={(v) => patch("algorithmsSolved", v)}
              placeholder="0"
            />
          </Field>
          <Field label="Hard problems attempted">
            <NumberInput
              value={notes.hardProblems}
              onChange={(v) => patch("hardProblems", v)}
              placeholder="0"
            />
          </Field>
          <Field label="Average solve time">
            <TextInput
              value={notes.avgSolveTime ?? ""}
              onChange={(v) => patch("avgSolveTime", v)}
              placeholder="e.g. 45 minutes"
            />
          </Field>
          <Field label="Topics covered">
            <TextInput
              value={notes.topicsCovered ?? ""}
              onChange={(v) => patch("topicsCovered", v)}
              placeholder="e.g. Big O, arrays, hash maps"
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 pt-1">
          <YNToggle
            label="Timed mock completed"
            value={notes.timedMockDone}
            onChange={(v) => patch("timedMockDone", v)}
          />
          <YNToggle
            label="Can explain optimal solution clearly"
            value={notes.canExplainSolution}
            onChange={(v) => patch("canExplainSolution", v)}
          />
        </div>
        <Field label="Most difficult concept">
          <TextInput
            value={notes.mostDifficultConcept ?? ""}
            onChange={(v) => patch("mostDifficultConcept", v)}
            placeholder="What stumped you?"
          />
        </Field>
        <Field label="Notes & reflections">
          <TextArea
            value={notes.algorithmsNote ?? ""}
            onChange={(v) => patch("algorithmsNote", v)}
            rows={3}
            placeholder="What worked, what didn't, next steps..."
          />
        </Field>
      </div>

      {/* ML THEORY */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader
          label="ML Theory"
          mins={sessions?.perCategory["ML_THEORY"]}
          targetMins={catTarget("ML_THEORY")}
        />
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="HOML chapters/sections">
            <TextInput
              value={notes.homlCovered ?? ""}
              onChange={(v) => patch("homlCovered", v)}
              placeholder="e.g. Ch. 2 — Data preprocessing"
            />
          </Field>
          <Field label="PRML chapters/sections">
            <TextInput
              value={notes.prmlCovered ?? ""}
              onChange={(v) => patch("prmlCovered", v)}
              placeholder="e.g. §1.2 — Probability theory"
            />
          </Field>
          <Field label="DDIA chapters/sections">
            <TextInput
              value={notes.ddiaCovered ?? ""}
              onChange={(v) => patch("ddiaCovered", v)}
              placeholder="e.g. Ch. 1 — Reliability"
            />
          </Field>
        </div>
        <Field label="Concepts mastered this week">
          <TextArea
            value={notes.conceptsMastered ?? ""}
            onChange={(v) => patch("conceptsMastered", v)}
            rows={3}
            placeholder="Key things you actually learned and can explain..."
          />
        </Field>
        <Field label="Notes & reflections">
          <TextArea
            value={notes.mlTheoryNote ?? ""}
            onChange={(v) => patch("mlTheoryNote", v)}
            rows={3}
            placeholder="What you applied, what needs more work..."
          />
        </Field>
        <div className="space-y-2 pt-1">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-3">
            Can explain without notes
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            <YNToggle
              label="Bias–variance tradeoff"
              value={notes.biasVariance}
              onChange={(v) => patch("biasVariance", v)}
            />
            <YNToggle
              label="Cross-validation strategy"
              value={notes.crossValidation}
              onChange={(v) => patch("crossValidation", v)}
            />
            <YNToggle
              label="Class imbalance handling"
              value={notes.classImbalance}
              onChange={(v) => patch("classImbalance", v)}
            />
            <YNToggle
              label="Model selection reasoning"
              value={notes.modelSelection}
              onChange={(v) => patch("modelSelection", v)}
            />
          </div>
          <div className="pt-2">
            <YNToggle
              label="Applied at least one concept to project"
              value={notes.appliedToProject}
              onChange={(v) => patch("appliedToProject", v)}
            />
          </div>
        </div>
      </div>

      {/* ML PLATFORM */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader
          label="ML Platform"
          mins={sessions?.perCategory["ML_PLATFORM"]}
          targetMins={catTarget("ML_PLATFORM")}
        />
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-3">
            Work completed this week
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            {ML_PLATFORM_ITEMS.map((item) => {
              const checked = notes.mlPlatformChecklist?.includes(item) ?? false;
              return (
                <YNToggle
                  key={item}
                  label={item}
                  value={checked}
                  onChange={(v) => {
                    const current = notes.mlPlatformChecklist ?? [];
                    patch(
                      "mlPlatformChecklist",
                      v ? [...current, item] : current.filter((x) => x !== item),
                    );
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <Field label="Experiments run">
            <NumberInput
              value={notes.experimentsRun}
              onChange={(v) => patch("experimentsRun", v)}
              placeholder="0"
            />
          </Field>
          <Field label="Best validation metric">
            <TextInput
              value={notes.bestMetric ?? ""}
              onChange={(v) => patch("bestMetric", v)}
              placeholder="e.g. RMSE 0.42"
            />
          </Field>
          <Field label="Metric change vs last week">
            <TextInput
              value={notes.metricChange ?? ""}
              onChange={(v) => patch("metricChange", v)}
              placeholder="e.g. −0.05 RMSE"
            />
          </Field>
          <Field label="Deployment errors">
            <TextInput
              value={notes.deploymentErrors ?? ""}
              onChange={(v) => patch("deploymentErrors", v)}
              placeholder="None / describe"
            />
          </Field>
        </div>
        <Field label="What improved">
          <TextArea
            value={notes.whatImproved ?? ""}
            onChange={(v) => patch("whatImproved", v)}
            rows={2}
          />
        </Field>
        <Field label="What failed">
          <TextArea
            value={notes.whatFailed ?? ""}
            onChange={(v) => patch("whatFailed", v)}
            rows={2}
          />
        </Field>
        <div className="flex flex-wrap gap-6 pt-1">
          <YNToggle
            label="API live"
            value={notes.apiLive}
            onChange={(v) => patch("apiLive", v)}
          />
          <YNToggle
            label="System stable"
            value={notes.systemStable}
            onChange={(v) => patch("systemStable", v)}
          />
        </div>
      </div>

      {/* IELTS */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader
          label="IELTS"
          mins={sessions?.perCategory["IELTS"]}
          targetMins={catTarget("IELTS")}
        />
        <p className="font-mono text-xs text-black/30 -mt-2">Target: Band 8.0+ · Exam: 24 Apr 2026</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Practice tests completed">
            <NumberInput
              value={notes.ieltsTestsDone}
              onChange={(v) => patch("ieltsTestsDone", v)}
              placeholder="0"
            />
          </Field>
          <Field label="Score (raw / band)">
            <TextInput
              value={notes.ieltsScore ?? ""}
              onChange={(v) => patch("ieltsScore", v)}
              placeholder="e.g. 36/40 — Band 8.0"
            />
          </Field>
          <Field label="Weakest section">
            <TextInput
              value={notes.ieltsWeakSection ?? ""}
              onChange={(v) => patch("ieltsWeakSection", v)}
              placeholder="e.g. Section 3 — TFNG"
            />
          </Field>
          <Field label="Vocabulary added">
            <NumberInput
              value={notes.ieltsVocabAdded}
              onChange={(v) => patch("ieltsVocabAdded", v)}
              placeholder="0 words"
            />
          </Field>
        </div>
        <Field label="Notes & reflections">
          <TextArea
            value={notes.ieltsNote ?? ""}
            onChange={(v) => patch("ieltsNote", v)}
            rows={3}
            placeholder="What improved, what still needs work..."
          />
        </Field>
      </div>

      {/* SYSTEM DESIGN */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader
          label="System Design"
          mins={sessions?.perCategory["SYSTEM_DESIGN"]}
          targetMins={catTarget("SYSTEM_DESIGN")}
        />
        <Field label="Topic studied">
          <TextArea
            value={notes.systemDesignTopic ?? ""}
            onChange={(v) => patch("systemDesignTopic", v)}
            rows={3}
            placeholder="What chapter/topic did you study?"
          />
        </Field>
        <YNToggle
          label="Can explain trade-offs clearly"
          value={notes.canExplainTradeoffs}
          onChange={(v) => patch("canExplainTradeoffs", v)}
        />
      </div>

      {/* TECHNICAL GROWTH */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-3 mb-5">
        <SectionHeader label="Technical Growth Self-Check" />
        <p className="font-mono text-xs text-black/40 -mt-2">
          This week I can confidently explain:
        </p>
        <div className="grid md:grid-cols-2 gap-2">
          <YNToggle
            label="Time/space complexity of a DFS problem"
            value={notes.dfsComplexity}
            onChange={(v) => patch("dfsComplexity", v)}
          />
          <YNToggle
            label="When to use LightGBM over Logistic Regression"
            value={notes.lightgbmVsLogistic}
            onChange={(v) => patch("lightgbmVsLogistic", v)}
          />
          <YNToggle
            label="Precision vs Recall tradeoff"
            value={notes.precisionRecall}
            onChange={(v) => patch("precisionRecall", v)}
          />
          <YNToggle
            label="Why a model might be overfit"
            value={notes.whyOverfit}
            onChange={(v) => patch("whyOverfit", v)}
          />
        </div>
      </div>

      {/* METRICS SNAPSHOT */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader label="Metrics Snapshot" />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Total algorithms solved (cumulative)">
            <NumberInput
              value={notes.algorithmsTotal}
              onChange={(v) => patch("algorithmsTotal", v)}
              placeholder="0 / 75 target"
            />
          </Field>
          <Field label="Total experiments run (cumulative)">
            <NumberInput
              value={notes.experimentsTotal}
              onChange={(v) => patch("experimentsTotal", v)}
              placeholder="0"
            />
          </Field>
          <Field label="Current best model metric">
            <TextInput
              value={notes.bestModelMetric ?? ""}
              onChange={(v) => patch("bestModelMetric", v)}
              placeholder="e.g. 0.96 accuracy on breast cancer dataset"
            />
          </Field>
        </div>
        <Field label="Current deployment state">
          <TextArea
            value={notes.deploymentState ?? ""}
            onChange={(v) => patch("deploymentState", v)}
            rows={3}
            placeholder="Describe the current state of your ML platform..."
          />
        </Field>
      </div>

      {/* DISCIPLINE */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-5">
        <SectionHeader label="Discipline Score" />
        <Field label="Honest self-estimation (1–10)">
          <input
            type="number"
            min={1}
            max={10}
            value={notes.disciplineScore ?? ""}
            onChange={(e) => {
              patch(
                "disciplineScore",
                e.target.value === "" ? undefined : Number(e.target.value),
              );
            }}
            placeholder="—"
            className="w-24 border border-black/10 px-3 py-2 font-mono text-sm bg-transparent focus:outline-none focus:border-black/30 rounded transition"
          />
        </Field>
        <Field label="Reasoning">
          <TextArea
            value={notes.disciplineReasoning ?? ""}
            onChange={(v) => patch("disciplineReasoning", v)}
            rows={4}
            placeholder="Be honest. What drove the score?"
          />
        </Field>
      </div>

      {/* NEXT WEEK */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 space-y-4 mb-8">
        <SectionHeader label="Next Week Focus" />
        <Field label="Top priorities for next week">
          <TextArea
            value={notes.nextWeekFocus ?? ""}
            onChange={(v) => patch("nextWeekFocus", v)}
            rows={6}
            placeholder={"1. …\n2. …\n3. …"}
          />
        </Field>
      </div>

      {/* SAVE */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="px-8 py-3 bg-foreground text-white font-mono text-sm rounded-xl hover:bg-foreground/80 transition disabled:opacity-50"
        >
          {saveState === "saving" ? "Saving…" : "Save Report →"}
        </button>
        {saveState === "saved" && (
          <p className="font-mono text-xs text-black/40 uppercase tracking-widest">Saved</p>
        )}
        {saveState === "error" && (
          <p className="font-mono text-xs text-red-500 uppercase tracking-widest">Save failed</p>
        )}
      </div>
    </div>
  );
}

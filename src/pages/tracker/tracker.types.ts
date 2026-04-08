export type Category = string;

export interface SessionNote {
  id: string;
  sessionId: string;
  content: string;
  url: string | null;
  createdAt: string;
}

export interface TrackerCategory {
  id: string;
  key: string;
  label: string;
  targetMinutes: number;
  active: boolean;
  order: number;
}

export type SessionStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ABANDONED";

export interface WorkSegment {
  id: string;
  startTime: string;
  endTime: string | null;
}

export interface WorkSession {
  id: string;
  category: Category;
  status: SessionStatus;
  startedAt: string;
  endedAt: string | null;
  workedOn?: string;
  output?: string;
  difficulty?: number;
  focus?: number;
  segments: WorkSegment[];
  notes: SessionNote[];
}

export interface ReportNotes {
  totalHoursNote?: string;
  // Job Applications
  applicationsSubmitted?: string;
  cvUpdates?: string;
  networkingMessages?: number;
  interviewsScheduled?: number;
  // Algorithms
  algorithmsSolved?: number;
  hardProblems?: number;
  timedMockDone?: boolean;
  avgSolveTime?: string;
  topicsCovered?: string;
  algorithmsNote?: string;
  mostDifficultConcept?: string;
  canExplainSolution?: boolean;
  // ML Theory
  homlCovered?: string;
  prmlCovered?: string;
  ddiaCovered?: string;
  conceptsMastered?: string;
  mlTheoryNote?: string;
  biasVariance?: boolean;
  crossValidation?: boolean;
  classImbalance?: boolean;
  modelSelection?: boolean;
  appliedToProject?: boolean;
  // ML Platform
  mlPlatformChecklist?: string[];
  experimentsRun?: number;
  bestMetric?: string;
  metricChange?: string;
  whatImproved?: string;
  whatFailed?: string;
  apiLive?: boolean;
  deploymentErrors?: string;
  systemStable?: boolean;
  // System Design
  systemDesignTopic?: string;
  canExplainTradeoffs?: boolean;
  // Technical Growth
  dfsComplexity?: boolean;
  lightgbmVsLogistic?: boolean;
  precisionRecall?: boolean;
  whyOverfit?: boolean;
  // Metrics Snapshot
  algorithmsTotal?: number;
  experimentsTotal?: number;
  bestModelMetric?: string;
  deploymentState?: string;
  // Discipline
  disciplineScore?: number;
  disciplineReasoning?: string;
  // IELTS
  ieltsTestsDone?: number;
  ieltsScore?: string;
  ieltsWeakSection?: string;
  ieltsVocabAdded?: number;
  ieltsNote?: string;
  // Next Week
  nextWeekFocus?: string;
}

export interface StoredWeeklyReport {
  id: string;
  weekStart: string;
  weekNumber: number | null;
  notes: ReportNotes;
}

export interface WeekReport {
  totalMinutes: number;
  targetMinutes: number;
  percent: number;
  sessionsCompleted: number;
  longestSessionMinutes: number;
  perCategory: Record<string, number>;
  sessions: Array<{
    id: string;
    category: Category;
    startedAt: string;
    endedAt: string | null;
    workedOn?: string;
    output?: string;
    difficulty?: number;
    focus?: number;
    notes: SessionNote[];
    minutes: number;
    durationEdits?: Array<{
      previousMinutes: number;
      newMinutes: number;
      createdAt: string;
    }>;
  }>;
}

export type ResourceType = "INSTAGRAM" | "YOUTUBE" | "ARTICLE" | "LEETCODE" | "OTHER";

export interface ResourceTask {
  id: string;
  resourceId: string;
  title: string;
  notes?: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceNote {
  id: string;
  resourceId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url?: string;
  description?: string;
  category: string;
  type: ResourceType;
  completed: boolean;
  tags: string[];
  tasks: ResourceTask[];
  notes: ResourceNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceCategory {
  id: string;
  key: string;
  label: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const TYPE_LABELS: Record<ResourceType, string> = {
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  ARTICLE: "Article",
  LEETCODE: "LeetCode",
  OTHER: "Other",
};

export const TYPE_ICONS: Record<ResourceType, string> = {
  INSTAGRAM: "📸",
  YOUTUBE: "▶️",
  ARTICLE: "📄",
  LEETCODE: "🧩",
  OTHER: "🔗",
};


/** Auto-detect type from a URL string */
export function detectType(url: string): ResourceType {
  if (/instagram\.com/i.test(url)) return "INSTAGRAM";
  if (/youtube\.com|youtu\.be/i.test(url)) return "YOUTUBE";
  if (/leetcode\.com/i.test(url)) return "LEETCODE";
  return "ARTICLE";
}

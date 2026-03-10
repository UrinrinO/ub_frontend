import { API_URL } from "./api";

async function safeFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  img: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const blogApi = {
  list: (publishedOnly = false, slug?: string): Promise<BlogPost[]> => {
    const params = new URLSearchParams();
    if (publishedOnly) params.set("published", "true");
    if (slug) params.set("slug", slug);
    const qs = params.toString();
    return safeFetch(`${API_URL}/api/blog${qs ? `?${qs}` : ""}`);
  },

  get: (id: string): Promise<BlogPost> =>
    safeFetch(`${API_URL}/api/blog/${id}`),

  create: (data: Partial<BlogPost>): Promise<BlogPost> =>
    safeFetch(`${API_URL}/api/blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<BlogPost>): Promise<BlogPost> =>
    safeFetch(`${API_URL}/api/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    fetch(`${API_URL}/api/blog/${id}`, { method: "DELETE" }).then(() => {}),
};

// ─── Tracker Categories ───────────────────────────────────────────────────────

export interface TrackerCategory {
  id: string;
  key: string;
  label: string;
  targetMinutes: number;
  active: boolean;
  order: number;
}

export const categoryApi = {
  list: (): Promise<TrackerCategory[]> =>
    safeFetch(`${API_URL}/api/tracker/categories`),

  create: (data: { key: string; label: string; targetMinutes: number }): Promise<TrackerCategory> =>
    safeFetch(`${API_URL}/api/tracker/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<TrackerCategory>): Promise<TrackerCategory> =>
    safeFetch(`${API_URL}/api/tracker/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    fetch(`${API_URL}/api/tracker/categories/${id}`, { method: "DELETE" }).then(() => {}),
};

// ─── Engineering Notes ────────────────────────────────────────────────────────

export interface NotesPart {
  id: string;
  slug: string;
  seriesId: string;
  title: string;
  content: string;
  partNumber: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotesSeries {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  parts: NotesPart[];
}

export const notesApi = {
  listSeries: (publishedOnly = false): Promise<NotesSeries[]> =>
    safeFetch(`${API_URL}/api/notes${publishedOnly ? "?published=true" : ""}`),

  getSeriesById: (id: string): Promise<NotesSeries> =>
    safeFetch(`${API_URL}/api/notes/id/${id}`),

  getSeriesBySlug: (slug: string, publishedOnly = false): Promise<NotesSeries> =>
    safeFetch(`${API_URL}/api/notes/${slug}${publishedOnly ? "?published=true" : ""}`),

  createSeries: (data: Partial<NotesSeries>): Promise<NotesSeries> =>
    safeFetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  updateSeries: (id: string, data: Partial<NotesSeries>): Promise<NotesSeries> =>
    safeFetch(`${API_URL}/api/notes/id/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteSeries: (id: string): Promise<void> =>
    fetch(`${API_URL}/api/notes/id/${id}`, { method: "DELETE" }).then(() => {}),

  getPartById: (id: string): Promise<NotesPart & { series: NotesSeries }> =>
    safeFetch(`${API_URL}/api/notes/parts/${id}`),

  getPartBySlug: (seriesSlug: string, partSlug: string, publishedOnly = false): Promise<NotesPart & { series: NotesSeries }> =>
    safeFetch(`${API_URL}/api/notes/${seriesSlug}/${partSlug}${publishedOnly ? "?published=true" : ""}`),

  createPart: (seriesId: string, data: Partial<NotesPart>): Promise<NotesPart> =>
    safeFetch(`${API_URL}/api/notes/id/${seriesId}/parts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  updatePart: (id: string, data: Partial<NotesPart>): Promise<NotesPart> =>
    safeFetch(`${API_URL}/api/notes/parts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deletePart: (id: string): Promise<void> =>
    fetch(`${API_URL}/api/notes/parts/${id}`, { method: "DELETE" }).then(() => {}),
};

// ─── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  content: string;
  tags: string[];
  img: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  list: (publishedOnly = false, slug?: string): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (publishedOnly) params.set("published", "true");
    if (slug) params.set("slug", slug);
    const qs = params.toString();
    return safeFetch(`${API_URL}/api/projects${qs ? `?${qs}` : ""}`);
  },

  get: (id: string): Promise<Project> =>
    safeFetch(`${API_URL}/api/projects/${id}`),

  create: (data: Partial<Project>): Promise<Project> =>
    safeFetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Project>): Promise<Project> =>
    safeFetch(`${API_URL}/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" }).then(() => {}),
};

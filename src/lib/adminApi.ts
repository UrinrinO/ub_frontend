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

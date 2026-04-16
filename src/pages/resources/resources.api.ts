import { API_URL } from "../../lib/api";
import type { Resource, ResourceType, ResourceCategory, ResourceTask } from "./resources.types";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const body = JSON.parse(text);
      if (body.error) message = body.error;
    } catch {
      // keep raw text
    }
    throw new Error(message);
  }
  return res.json();
}

export const resourcesApi = {
  list(filters?: { category?: string; completed?: boolean; type?: ResourceType }) {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.completed !== undefined) params.set("completed", String(filters.completed));
    if (filters?.type) params.set("type", filters.type);
    const qs = params.toString();
    return fetch(`${API_URL}/api/resources${qs ? `?${qs}` : ""}`).then((r) =>
      json<Resource[]>(r),
    );
  },

  create(data: {
    title: string;
    url?: string;
    description?: string;
    category: string;
    type?: ResourceType;
    tags?: string[];
  }) {
    return fetch(`${API_URL}/api/resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Resource>(r));
  },

  update(
    id: string,
    data: Partial<{
      title: string;
      url: string | null;
      description: string;
      category: string;
      type: ResourceType;
      completed: boolean;
      tags: string[];
    }>,
  ) {
    return fetch(`${API_URL}/api/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Resource>(r));
  },

  remove(id: string) {
    return fetch(`${API_URL}/api/resources/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    );
  },

  // ─── Categories ───────────────────────────────────────────────────────────

  listCategories() {
    return fetch(`${API_URL}/api/resources/categories`).then((r) =>
      json<ResourceCategory[]>(r),
    );
  },

  createCategory(data: { key: string; label: string }) {
    return fetch(`${API_URL}/api/resources/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<ResourceCategory>(r));
  },

  updateCategory(
    id: string,
    data: Partial<{ key: string; label: string; active: boolean; order: number }>,
  ) {
    return fetch(`${API_URL}/api/resources/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<ResourceCategory>(r));
  },

  removeCategory(id: string) {
    return fetch(`${API_URL}/api/resources/categories/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    );
  },

  // ─── Tasks ────────────────────────────────────────────────────────────────

  createTask(resourceId: string, data: { title: string; notes?: string }) {
    return fetch(`${API_URL}/api/resources/${resourceId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<ResourceTask>(r));
  },

  updateTask(
    taskId: string,
    data: Partial<{ title: string; notes: string; completed: boolean; order: number }>,
  ) {
    return fetch(`${API_URL}/api/resources/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<ResourceTask>(r));
  },

  removeTask(taskId: string) {
    return fetch(`${API_URL}/api/resources/tasks/${taskId}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    );
  },

  // ─── Notes ────────────────────────────────────────────────────────────────

  createNote(resourceId: string, data: { content: string }) {
    return fetch(`${API_URL}/api/resources/${resourceId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<import("./resources.types").ResourceNote>(r));
  },

  updateNote(noteId: string, data: { content: string }) {
    return fetch(`${API_URL}/api/resources/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<import("./resources.types").ResourceNote>(r));
  },

  removeNote(noteId: string) {
    return fetch(`${API_URL}/api/resources/notes/${noteId}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    );
  },
};

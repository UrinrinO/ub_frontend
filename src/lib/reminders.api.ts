import { API_URL } from "./api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface Reminder {
  id: string;
  title: string;
  notes: string | null;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export const remindersApi = {
  list() {
    return fetch(`${API_URL}/api/reminders`).then((r) => json<Reminder[]>(r));
  },

  create(data: { title: string; notes?: string; deadline: string }) {
    return fetch(`${API_URL}/api/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Reminder>(r));
  },

  update(id: string, data: Partial<{ title: string; notes: string; deadline: string; completed: boolean }>) {
    return fetch(`${API_URL}/api/reminders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Reminder>(r));
  },

  delete(id: string) {
    return fetch(`${API_URL}/api/reminders/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    );
  },
};

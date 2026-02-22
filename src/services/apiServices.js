const BASE_URL = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "yassin-fspt-128-devner";


async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.detail || data?.message || `Error HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// AGENDA
export async function ensureAgenda() {
  try {
    await request(`/agendas/${AGENDA_SLUG}`, { method: "POST" });
  } catch {
    // si ya esta ignoramos
  }
}

// READ
export async function getContacts() {
  await ensureAgenda();
  const data = await request(`/agendas/${AGENDA_SLUG}/contacts`);
  return data?.contacts || [];
}

// CREATE
export async function createContact(payload) {
  await ensureAgenda();
  return request(`/agendas/${AGENDA_SLUG}/contacts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE/EDIT
export async function updateContact(id, payload) {
  await ensureAgenda();
  return request(`/agendas/${AGENDA_SLUG}/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE
export async function deleteContact(id) {
  await ensureAgenda();
  return request(`/agendas/${AGENDA_SLUG}/contacts/${id}`, { method: "DELETE" });
}
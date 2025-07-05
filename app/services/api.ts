const API_BASE = "/api";

export const signup = (
  name: string,
  email: string,
  password: string,
  phone: string
) =>
  fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  }).then((res) => res.json());

export const login = (name: string, password: string) =>
  fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  }).then((res) => res.json());

export const fetchMenu = () =>
  fetch(`${API_BASE}/menu`).then((res) => res.json());

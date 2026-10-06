export const TOKEN_KEY = "eventify_token";
export const USER_KEY = "eventify_user";


export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // Token expired or invalid: clear the session and go back to login.
  if (res.status === 401 && token) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/login";
  }

  if (!res.ok) {
    throw new Error((data && data.message) || "Something went wrong");
  }
  return data;
}

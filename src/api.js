const BASE = "https://splitwise-application-iwx7.onrender.com/api";

export function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }).then((response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return response;
  });
}
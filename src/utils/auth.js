const AUTH_KEY = "muso-ninja-auth";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function isAuthenticated() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const { expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return false;
  }
}

export function setAuthenticated() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ expires: Date.now() + THIRTY_DAYS }));
}

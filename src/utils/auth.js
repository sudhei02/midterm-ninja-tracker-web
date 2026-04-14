const AUTH_KEY = "muso-ninja-auth";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
let inMemoryAuth = null;

function getStoredAuth() {
  try {
    return localStorage.getItem(AUTH_KEY);
  } catch {
    return null;
  }
}

function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // Ignore storage cleanup failures and rely on in-memory state reset.
  }
}

export function isAuthenticated() {
  const raw = getStoredAuth() || inMemoryAuth;
  if (!raw) return false;
  try {
    const { expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      inMemoryAuth = null;
      clearStoredAuth();
      return false;
    }
    inMemoryAuth = raw;
    return true;
  } catch {
    inMemoryAuth = null;
    clearStoredAuth();
    return false;
  }
}

export function setAuthenticated() {
  const value = JSON.stringify({ expires: Date.now() + THIRTY_DAYS });
  inMemoryAuth = value;
  try {
    localStorage.setItem(AUTH_KEY, value);
  } catch {
    // Storage may be unavailable or full; keep the in-memory auth state.
  }
}

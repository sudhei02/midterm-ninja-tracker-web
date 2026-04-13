const SESSION_KEY = "muso-ninja-auth";

export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function setAuthenticated() {
  sessionStorage.setItem(SESSION_KEY, "true");
}

let online = navigator.onLine;
const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return online;
}

// Update store when browser status changes
window.addEventListener("online", () => {
  online = true;
  listeners.forEach((l) => l());
});

window.addEventListener("offline", () => {
  online = false;
  listeners.forEach((l) => l());
});

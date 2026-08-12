// Base URL of the soitgoes API.
//
// The UI dev server proxies "/api" -> http://localhost:8001; a Firefox
// extension cannot rely on that proxy, so we talk to the API host directly.
// Point this at your local Django server for development.
//const API_BASE = "http://localhost:8001";
const API_BASE = "https://tracking.cloud.stuartquin.com";

// Web UI URL for an individual tracked-time entry (not the API host).
const TRACKING_URL = (id) => `https://tracking.cloud.stuartquin.com/tracking/${id}`;

const ENDPOINTS = {
  login: `${API_BASE}/api/users/login/`,
  trackedTimes: `${API_BASE}/api/tracked-times/`,
  trackedTime: (id) => `${API_BASE}/api/tracked-times/${id}`,
  projects: `${API_BASE}/api/projects/`,
};

const STORAGE_KEYS = {
  token: "authToken",
};

// SVG markup copied verbatim from ui/src/components/Icons/IconPlay.tsx
// and IconStop.tsx so the popup matches the webapp's icons.
const ICON_PLAY = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>`;
const ICON_STOP = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" /></svg>`;

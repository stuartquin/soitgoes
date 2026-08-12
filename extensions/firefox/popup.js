// Tracking popup — a minimal mirror of ui/src/routes/tracking/ +
// ui/src/components/tracking/TrackedTimeList.tsx, in vanilla JS.
//
// Behavior parity with the webapp:
//   * A project can have at most one in-progress TrackedTime at a time;
//     starting a new one closes the existing open row for that project first.
//   * Rows are grouped by day (most recent first); within a day, in-progress
//     rows sort first, then by started_at DESC.
//   * Running rows show a live ticking duration; completed rows show the
//     server-provided `duration`.

const app = document.getElementById("app");

// --- tiny helpers ---------------------------------------------------------
function isRowOpen(tt) {
  return !tt.ended_at;
}

// Duration formatter copied from ui/src/components/tracking/TrackedTimeRow.tsx
function formatDuration(duration) {
  if (duration === null || duration === undefined) return "—";
  const seconds = Math.floor(Number(duration));
  if (Number.isNaN(seconds)) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}:${p(dt.getSeconds())}`;
}

function dayKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

function isToday(date) {
  const d = date instanceof Date ? date : new Date(date);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

// Total tracked duration (seconds) for a day's entries, counting any
// in-progress row up to the current moment so the header total ticks
// live alongside the running row durations.
function dayTotalSeconds(entries) {
  let total = 0;
  for (const tt of entries) {
    if (isRowOpen(tt)) {
      total += (Date.now() - new Date(tt.started_at).getTime()) / 1000;
    } else {
      total += Number(tt.duration) || 0;
    }
  }
  return total;
}

// Format a duration (seconds) as "<H>h <M>m" with zero-padded minutes,
// e.g. 2h 32m, 0h 05m.
function formatDayTotal(seconds) {
  const s = Math.floor(Number(seconds) || 0);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

// Start of the current week as a Date. Weeks start on Monday, matching
// lib/date.ts getStartOfWeek (weekStartsOn: 1) used by the webapp's
// TrackingSummaryPanel.
function startOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
  d.setDate(d.getDate() - dow);
  return d;
}

// Total tracked duration (seconds) for entries that started in the current
// week. In-progress rows count up to now. Mirrors TrackingSummaryPanel.
function weekTotalSeconds(trackedTimes) {
  const start = startOfWeek().getTime();
  let total = 0;
  for (const tt of trackedTimes) {
    if (new Date(tt.started_at).getTime() < start) continue;
    if (isRowOpen(tt)) {
      total += (Date.now() - new Date(tt.started_at).getTime()) / 1000;
    } else {
      total += Number(tt.duration) || 0;
    }
  }
  return total;
}

function dayLabel(key) {
  const d = new Date(key + "T00:00:00");
  if (isToday(d)) return "Today";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// --- badge sync ----------------------------------------------------------
// Tell the background script whether any session is in progress so the
// toolbar badge (green dot) updates immediately, without waiting for the
// next alarm poll.
function syncBadge(trackedTimes) {
  const open = Array.isArray(trackedTimes) && trackedTimes.some(isRowOpen);
  try {
    browser.runtime.sendMessage({ type: "refresh-badge", open });
  } catch {
    // Background may be unavailable during temporary-addon reload; ignore.
  }
}

// --- storage ---------------------------------------------------------------
async function getToken() {
  const res = await browser.storage.local.get(STORAGE_KEYS.token);
  return res[STORAGE_KEYS.token] ?? null;
}

async function setToken(token) {
  if (token) {
    await browser.storage.local.set({ [STORAGE_KEYS.token]: token });
  } else {
    await browser.storage.local.remove(STORAGE_KEYS.token);
  }
}

// --- api ------------------------------------------------------------------
async function apiGet(path) {
  return apiFetch(path, { method: "GET" });
}

async function apiFetch(path, init) {
  const token = await getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Token ${token}`;
  const res = await fetch(path, { ...init, headers });
  if (res.status === 401) {
    // Token invalid/expired — bounce back to the login form.
    await setToken(null);
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

class UnauthorizedError extends Error {}
class ApiError extends Error {}

// --- rendering ------------------------------------------------------------
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v != null) node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

let liveTimer = null;
// Re-render callback installed while a view with running rows is mounted.
let rerunRunningView = null;

// Periodic refetch of the tracked-time list so changes made elsewhere (e.g.
// start/stop on another device) appear while the popup is open. Cleared
// alongside the live timer whenever the view is torn down.
let refreshTimer = null;

// True while a start/stop mutation is awaiting its response, so the refresh
// poll doesn't race with the post-mutation full reload.
let mutationInFlight = false;

function clearTimers() {
  if (liveTimer) {
    clearInterval(liveTimer);
    liveTimer = null;
  }
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  rerunRunningView = null;
}

function ensureLiveTimer() {
  if (liveTimer) return;
  liveTimer = setInterval(() => {
    if (rerunRunningView) rerunRunningView();
  }, 1000);
}

// How often the popup re-fetches the tracked-time list from the API.
const REFRESH_INTERVAL_MS = 30_000;

// --- login view -----------------------------------------------------------
function renderLogin(prefilledEmail = "", formError = "") {
  clearTimers();
  // Logged out / no session: clear the toolbar badge.
  syncBadge([]);
  app.innerHTML = "";

  const emailInput = el("input", {
    type: "email",
    placeholder: "you@example.com",
    value: prefilledEmail,
    autocomplete: "username",
  });
  const passwordInput = el("input", {
    type: "password",
    placeholder: "password",
    autocomplete: "current-password",
  });
  const submitBtn = el("button", { type: "submit" }, "Log in");
  const errorEl = el("div", { class: "form-error" }, formError);

  const form = el(
    "form",
    {
      class: "login",
      onsubmit: async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        errorEl.textContent = "";
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        try {
          const data = await apiFetch(ENDPOINTS.login, {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          if (!data || !data.token) {
            throw new Error("No token returned");
          }
          await setToken(data.token);
          passwordInput.value = "";
          renderList();
        } catch (err) {
          submitBtn.disabled = false;
          if (err instanceof UnauthorizedError) {
            errorEl.textContent = "Invalid email or password.";
          } else {
            errorEl.textContent = err.message || "Login failed.";
          }
        }
      },
    },
    el("h1", {}, "Log in"),
    el("label", {}, "Email", emailInput),
    el("label", {}, "Password", passwordInput),
    submitBtn,
    errorEl
  );

  app.append(form);
  emailInput.focus();
}

// --- list view ------------------------------------------------------------
async function renderList() {
  app.innerHTML = "";
  app.append(el("div", { class: "message" }, "Loading…"));

  let projects = [];
  let trackedTimes = [];
  try {
    // Both endpoints are paginated (global LimitOffsetPagination) and return
    // { count, next, previous, results: [...] }; read the .results array.
    let projectsResp, trackedResp;
    [projectsResp, trackedResp] = await Promise.all([
      apiGet(ENDPOINTS.projects),
      apiGet(ENDPOINTS.trackedTimes),
    ]);
    projects = (projectsResp && projectsResp.results) || [];
    trackedTimes = (trackedResp && trackedResp.results) || [];
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      renderLogin();
      return;
    }
    syncBadge([]);
    app.innerHTML = "";
    app.append(el("div", { class: "message error" }, err.message || "Failed to load."));
    return;
  }

  drawListView(trackedTimes, projects);
  syncBadge(trackedTimes);
}

function drawListView(trackedTimes, projects) {
  clearTimers();
  app.innerHTML = "";

  const projectLookup = new Map();
  projects.forEach((p) => {
    if (p.id !== undefined) projectLookup.set(p.id, p);
  });

  // The single in-progress TrackedTime per project (if any).
  const openByProject = new Map();
  trackedTimes.forEach((tt) => {
    if (isRowOpen(tt)) openByProject.set(tt.project, tt);
  });

  // ---- header: project select + start button ----
  const select = el("select", {});
  select.append(el("option", { value: "" }, "Start tracking…"));
  // Surface projects with recent/active tracking first, matching the webapp
  // StartTrackingPopover ordering.
  const activeIds = new Set(trackedTimes.map((tt) => tt.project));
  const active = projects.filter((p) => p.id != null && activeIds.has(p.id));
  const rest = projects.filter((p) => p.id == null || !activeIds.has(p.id));
  const byName = (a, b) => (a.name || "").localeCompare(b.name || "");
  [...active.sort(byName), ...rest.sort(byName)].forEach((p) => {
    select.append(el("option", { value: String(p.id) }, p.name || `Project ${p.id}`));
  });

  const startBtn = el(
    "button",
    {
      class: "icon-btn start",
      title: "Start tracking",
      "aria-label": "Start tracking",
      disabled: "disabled",
    }
  );
  startBtn.innerHTML = ICON_PLAY;
  select.addEventListener("change", () => {
    if (select.value) startBtn.removeAttribute("disabled");
    else startBtn.setAttribute("disabled", "disabled");
  });
  startBtn.addEventListener("click", async () => {
    const projectId = Number(select.value);
    if (!projectId) return;
    startBtn.disabled = true;
    mutationInFlight = true;
    try {
      await startProject(projectId, null, openByProject);
      await renderList();
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        renderLogin();
        return;
      }
      alert(err.message || "Failed to start tracking.");
    } finally {
      mutationInFlight = false;
      startBtn.disabled = !select.value;
    }
  });

  const logoutBtn = el("button", {}, "Log out");
  logoutBtn.addEventListener("click", async () => {
    await setToken(null);
    renderLogin();
  });

  const weekSummary = el("span", { class: "week-summary" }, "This week: …");

  app.append(
    el("div", { class: "header" }, select, startBtn),
    el("div", { class: "logout-bar" }, weekSummary)
  );

  // ---- list body ----
  // `listRoot` is always created (even when empty) so the periodic refresh
  // can populate it without rebuilding the header or resetting the select.
  const listRoot = el("div", {});
  app.append(listRoot);

  // Footer logout, pinned to the bottom of the pane.
  app.append(el("div", { class: "logout-bar logout-bar--bottom" }, logoutBtn));

  // Group by day (most recent first); within a day, open rows first then
  // started_at DESC — same rules as TrackedTimeList.groupedDays.
  function buildGroups(items) {
    const byDay = new Map();
    items.forEach((tt) => {
      const key = dayKey(tt.started_at);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(tt);
    });
    return [...byDay.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, entries]) => ({
        key,
        entries: entries.sort((a, b) => {
          const ao = isRowOpen(a);
          const bo = isRowOpen(b);
          if (ao !== bo) return ao ? -1 : 1;
          return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
        }),
      }));
  }

  let groups = buildGroups(trackedTimes);

  function setOpenByProject(items) {
    openByProject.clear();
    items.forEach((tt) => {
      if (isRowOpen(tt)) openByProject.set(tt.project, tt);
    });
  }

  function drawBody() {
    listRoot.innerHTML = "";
    weekSummary.textContent = `This week: ${formatDayTotal(weekTotalSeconds(trackedTimes))}`;
    if (!groups.length) {
      listRoot.append(el("div", { class: "message" }, "No tracked time yet."));
      return;
    }
    groups.forEach(({ key, entries }) => {
      const group = el("div", { class: "day-group" });
      group.append(
        el(
          "div",
          { class: "day-header" },
          el("span", {}, dayLabel(key)),
          el(
            "span",
            { class: "count" },
            formatDayTotal(dayTotalSeconds(entries))
          )
        )
      );
      entries.forEach((tt) => group.append(renderRow(tt, projectLookup, openByProject)));
      listRoot.append(group);
    });
  }

  // Re-fetch the tracked-time list so changes made elsewhere (e.g. a
  // start/stop on another device) appear while the popup is open. Only
  // tracked times are refetched — projects rarely change, and re-fetching
  // them would rebuild the <select> and lose the current selection.
  async function refreshTrackedTimes() {
    if (mutationInFlight) return;
    try {
      const resp = await apiGet(ENDPOINTS.trackedTimes);
      const fresh = (resp && resp.results) || [];
      trackedTimes = fresh;
      setOpenByProject(fresh);
      groups = buildGroups(fresh);
      drawBody();
      syncBadge(fresh);
      if (fresh.some(isRowOpen)) ensureLiveTimer();
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        renderLogin();
        return;
      }
      // Transient fetch errors are ignored so a flaky network doesn't wipe
      // the currently-displayed list.
    }
  }

  // Live-update running rows without a full refetch.
  rerunRunningView = drawBody;
  if (trackedTimes.some(isRowOpen)) ensureLiveTimer();
  refreshTimer = setInterval(refreshTrackedTimes, REFRESH_INTERVAL_MS);
  drawBody();
}

function renderRow(tt, projectLookup, openByProject) {
  const project = projectLookup.get(tt.project);
  const active = isRowOpen(tt);

  let durationText;
  if (active) {
    const start = new Date(tt.started_at).getTime();
    durationText = formatDuration((Date.now() - start) / 1000);
  } else {
    durationText = formatDuration(tt.duration);
  }

  const startedAt = fmtDate(tt.started_at);
  const endedAt = tt.ended_at ? fmtDate(tt.ended_at) : null;
  const timesLine = `${startedAt}${endedAt ? ` → ${endedAt.split(" ").pop()}` : " → running"}`;

  const button = el(
    "button",
    {
      class: `icon-btn ${active ? "stop" : "start"}`,
      title: active ? "Stop tracking" : "Start tracking",
      "aria-label": active ? "Stop tracking" : "Start tracking",
    }
  );
  button.innerHTML = active ? ICON_STOP : ICON_PLAY;
  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    button.disabled = true;
    mutationInFlight = true;
    try {
      if (active) {
        await stopTrackedTime(tt);
      } else {
        // Restart tracking for this row's project (mirrors handleStart).
        await startProject(tt.project, tt.task ?? null, openByProject);
      }
      await renderList();
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        renderLogin();
        return;
      }
      alert(err.message || "Request failed.");
    } finally {
      mutationInFlight = false;
    }
  });

  return el(
    "div",
    { class: "row" },
    el(
      "div",
      {},
      el("div", { class: "name" }, project?.name ?? `Project #${tt.project}`),
      tt.comment ? el("div", { class: "comment" }, tt.comment) : null,
      el("div", { class: "times" }, timesLine)
    ),
    el(
      "div",
      { class: "right" },
      active ? el("span", { class: "dot" }) : null,
      el(
        "div",
        {},
        el("div", { class: "duration" }, durationText),
        el("div", { class: "status" }, active ? "tracking" : "complete")
      ),
      button
    )
  );
}

// --- mutations (mirror TrackedTimeList start/stop mutations) --------------
async function stopTrackedTime(tt) {
  const endedAt = new Date().toISOString();
  await apiFetch(ENDPOINTS.trackedTime(tt.id), {
    method: "PATCH",
    body: JSON.stringify({
      project: tt.project,
      task: tt.task ?? null,
      started_at: tt.started_at,
      ended_at: endedAt,
    }),
  });
}

// Start a new TrackedTime for a project, first closing any in-progress row
// for that project (enforces one open session per project).
async function startProject(projectId, task, openByProject) {
  const startedAt = new Date().toISOString();
  const openToClose = openByProject.get(projectId);
  if (openToClose) {
    await apiFetch(ENDPOINTS.trackedTime(openToClose.id), {
      method: "PATCH",
      body: JSON.stringify({
        project: openToClose.project,
        task: openToClose.task ?? null,
        started_at: openToClose.started_at,
        ended_at: startedAt,
      }),
    });
  }
  await apiFetch(ENDPOINTS.trackedTimes, {
    method: "POST",
    body: JSON.stringify({
      project: projectId,
      task: task ?? null,
      started_at: startedAt,
    }),
  });
}

// --- bootstrap ------------------------------------------------------------
(async function init() {
  const token = await getToken();
  if (token) {
    renderList();
  } else {
    renderLogin();
  }
})();

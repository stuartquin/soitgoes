// Background event page: keeps the toolbar badge in sync with whether a
// tracked-time session is currently in progress.
//
// The badge is a green "●" when at least one TrackedTime has ended_at == null.
// We refresh it on a 1-minute alarm and immediately when the popup reports a
// change (start/stop/login/logout) so updates feel instant.

async function getToken() {
  const res = await browser.storage.local.get(STORAGE_KEYS.token);
  return res[STORAGE_KEYS.token] ?? null;
}

// Ask the API whether any tracked-time session is open. Uses the `open`
// filter (ended_at IS NULL) from journal.filters.TrackedTimeFilter.
async function fetchHasOpen() {
  const token = await getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${ENDPOINTS.trackedTimes}?open=true`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return ((data && data.results) || []).length > 0;
  } catch {
    return false;
  }
}

function setBadge(on) {
  if (on) {
    // Transparent background + green glyph renders as a green dot over the
    // toolbar icon, matching the pulsing green dot used in the webapp rows.
    browser.action.setBadgeBackgroundColor({ color: "transparent" });
    browser.action.setBadgeTextColor({ color: "#22c55e" });
    browser.action.setBadgeText({ text: "●" });
  } else {
    browser.action.setBadgeText({ text: "" });
  }
}

async function refreshBadge(knownOpen) {
  // If the popup already knows the answer, skip the extra fetch.
  if (typeof knownOpen === "boolean") {
    setBadge(knownOpen);
    return;
  }
  setBadge(await fetchHasOpen());
}

// Poll roughly once a minute so the badge reflects state changes that
// happen while the popup is closed (e.g. a session started elsewhere, or
// the API auto-closes one).
browser.alarms.create("refresh-badge", { periodInMinutes: 1 });
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refresh-badge") refreshBadge();
});

// The popup sends { type: "refresh-badge", open?: boolean } after it loads
// the list or performs a start/stop, so the badge updates immediately.
browser.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "refresh-badge") {
    refreshBadge(msg.open);
  }
});

// Refresh on startup / install.
refreshBadge();

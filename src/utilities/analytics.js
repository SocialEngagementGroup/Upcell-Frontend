const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/';
const analyticsEndpoint = new URL('analytics-events', baseUrl).toString();
const analyticsStorageKey = 'upcell_analytics_session_id';

const normalizePayload = (payload = {}) => ({
    category: payload.category,
    name: payload.name,
    status: payload.status,
    formName: payload.formName,
    path: payload.path || `${window.location.pathname}${window.location.search}`,
    message: payload.message,
    sessionId: payload.sessionId || getAnalyticsSessionId(),
    metadata: payload.metadata || {},
});

export const getAnalyticsSessionId = () => {
    const existingId = window.sessionStorage.getItem(analyticsStorageKey);
    if (existingId) return existingId;

    const nextId = `analytics-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(analyticsStorageKey, nextId);
    return nextId;
};

export const trackAnalyticsEvent = async (payload, options = {}) => {
    const normalizedPayload = normalizePayload(payload);
    const body = JSON.stringify(normalizedPayload);

    if (options.beacon && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(analyticsEndpoint, blob);
        return;
    }

    await fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: Boolean(options.keepalive),
    }).catch(() => null);
};

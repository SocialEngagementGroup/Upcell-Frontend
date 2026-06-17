import axios from "axios";
import { trackAnalyticsEvent } from "./analytics";
import { apiBaseUrl } from "./env";

const axiosInstance = axios.create({
    baseURL: apiBaseUrl
})

const getRequestUrl = (config = {}) => {
    return String(config.url || "");
};

const isAdminRequest = (requestUrl) => {
    return requestUrl.includes("admin") || requestUrl.includes("shop-categories") || requestUrl.includes("product-family");
};

const redirectToLogin = (requestUrl) => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const isAlreadyOnLogin = currentPath === "/login";

    if (isAlreadyOnLogin) return;

    const shouldUseAdminLogin = currentPath.startsWith("/admin-secret") || isAdminRequest(requestUrl);
    const loginPath = shouldUseAdminLogin ? "/login?admin=true" : "/login";

    window.location.replace(loginPath);
};

// Authentication Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    const token = await window.Clerk?.session?.getToken();

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => response, (error) => {
    const requestUrl = getRequestUrl(error?.config);
    const isAnalyticsRequest = typeof requestUrl === 'string' && requestUrl.includes('analytics-events');
    const isAdminRoute = window.location.pathname.startsWith('/admin-secret');

    if (isAdminRoute && !isAnalyticsRequest) {
        trackAnalyticsEvent({
            category: 'admin_api_error',
            name: 'admin_request_failed',
            status: 'error',
            message: error?.response?.data?.error || error?.message || 'Admin request failed',
            metadata: {
                method: error?.config?.method || 'get',
                url: requestUrl,
                statusCode: error?.response?.status || null,
            },
        });
    }

    if (error?.response?.status === 401 && !isAnalyticsRequest) {
        redirectToLogin(requestUrl);
    }

    return Promise.reject(error);
});

export default axiosInstance

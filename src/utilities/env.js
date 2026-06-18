const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
    throw new Error("Missing VITE_API_URL");
}

export const apiBaseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

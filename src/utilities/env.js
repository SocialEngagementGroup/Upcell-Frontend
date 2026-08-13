const apiUrl = import.meta.env.VITE_API_URL || "/";

export const apiBaseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

// The cloud name is public — it appears in the URL of every image on the page.
// The API key and secret are not, and must never reach the browser: uploads are
// authorised by a signature the backend issues (POST /uploads/signature).
//
// Hardcoded default rather than env-only. Since the local files were removed
// from the repo there is nothing to fall back to, so a missing value does not
// degrade — it blanks every image on the site. That is exactly what happened on
// the first Vercel deploy, where VITE_CLOUDINARY_CLOUD_NAME was never set.
// The env var still overrides, so a different environment can point elsewhere.
const DEFAULT_CLOUD_NAME = "jbis4ply";

export const cloudinaryCloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;

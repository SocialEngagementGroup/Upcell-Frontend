const apiUrl = import.meta.env.VITE_API_URL || "/";

export const apiBaseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

// The cloud name is public — it appears in every delivery URL. The API key and
// secret are not, and must never reach the browser: uploads are authorised by
// a signature the backend issues (POST /uploads/signature).
// Empty here simply means Cloudinary delivery is off and images fall back to
// their existing local paths, so an unset value degrades rather than breaks.
export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

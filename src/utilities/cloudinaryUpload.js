import axiosInstance from "./axiosInstance";

// Signed direct-to-Cloudinary upload.
//
// The file never passes through our own API. The backend only issues a
// signature (POST /uploads/signature, admin-only); the browser then posts the
// bytes straight to Cloudinary. That is what lets the 25mb JSON body limit in
// Backend/src/app.js come back down — previously admin images were base64'd
// into the request body and stored in MongoDB, which is why shopcategories
// averaged 57.9 KB/doc against 0.5 KB everywhere else.
//
// The signature covers folder, public_id and timestamp. Cloudinary rejects the
// upload if any of those are altered in transit, so the browser cannot choose
// where the asset lands or what it overwrites.

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;

export const UPLOAD_TARGETS = ["product", "category", "hero", "ad", "static"];

const validate = (file) => {
    if (!file) throw new Error("No file selected");

    if (!ACCEPTED_TYPES.includes(file.type)) {
        throw new Error(`Unsupported image type: ${file.type || "unknown"}`);
    }

    if (file.size > MAX_BYTES) {
        throw new Error(`Image is ${(file.size / 1048576).toFixed(1)} MB; the limit is 10 MB`);
    }
};

/**
 * Uploads one image and resolves with the stored reference.
 *
 * @param {File}   file              the browser File object
 * @param {string} options.target    one of UPLOAD_TARGETS
 * @param {string} options.context   free text used to pick the product family
 *                                   folder (ignored for non-product targets)
 * @param {string[]} options.parts   descriptive parts for the readable slug,
 *                                   e.g. ["iPhone 16 Pro", "Blue"]
 * @returns {Promise<{publicId: string, url: string, width: number, height: number, bytes: number, format: string}>}
 *
 * Store `publicId` in MongoDB, not `url` — the URL embeds transformations and
 * the cloud name, both of which can change. resolveImageSrc() rebuilds it.
 */
export const uploadImage = async (file, { target, context = "", parts = [] } = {}) => {
    validate(file);

    if (!UPLOAD_TARGETS.includes(target)) {
        throw new Error(`Invalid upload target: ${target}`);
    }

    // sourceKey makes the public_id deterministic: re-uploading the same file
    // for the same product overwrites in place instead of leaving an orphan.
    const sourceKey = `${target}/${parts.join("/")}/${file.name}`;

    const { data: signed } = await axiosInstance.post("uploads/signature", {
        target,
        context,
        parts,
        sourceKey,
    });

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signed.apiKey);
    form.append("timestamp", signed.timestamp);
    form.append("signature", signed.signature);
    form.append("folder", signed.folder);
    form.append("public_id", signed.publicId);

    const response = await fetch(signed.uploadUrl, { method: "POST", body: form });

    if (!response.ok) {
        // Cloudinary returns a JSON body with error.message on failure; fall
        // back to the status when it does not (network-level failures).
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.error?.message || `Upload failed (${response.status})`);
    }

    const result = await response.json();

    return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        format: result.format,
    };
};

export const uploadImages = (files, options) => (
    Promise.all(Array.from(files).map((file) => uploadImage(file, options)))
);

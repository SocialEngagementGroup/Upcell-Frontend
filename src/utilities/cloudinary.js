import { cloudinaryCloudName } from "./env";

// Cloudinary delivery URLs.
//
//   https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<public_id>
//
// Every URL carries f_auto and q_auto:
//   f_auto  serves AVIF/WebP/JPEG based on what the requesting browser accepts,
//           so no <picture> elements or fallback logic are needed anywhere.
//   q_auto  picks quality per image from its actual content.
//
// Measured on this catalogue, f_auto alone takes 51.3 MB down to 19.1 MB
// (-63%), and the PNGs -94%. Adding a width is where the rest of the win is:
// without one, a 800x800 source still ships to a 200px thumbnail slot.
const BASE = "https://res.cloudinary.com";

// Widths used for srcset. Chosen to cover the real slots in this UI: grid
// thumbnail, product card, detail view, and 2x for retina on the largest.
export const IMAGE_WIDTHS = [200, 400, 600, 1000];

// A Cloudinary public_id, as produced by the backend's buildPublicId, looks
// like "upcell/products/iphone/iphone-16-pro-blue--a1b2c3d4". Anything that is
// an absolute URL or starts with a slash is a legacy local asset and must be
// passed through untouched. Both kinds coexist during the migration.
export const isCloudinaryId = (value) => (
    typeof value === "string"
    && value.startsWith("upcell/")
    && !value.startsWith("http")
);

const buildTransforms = ({ width, height, crop = "limit", quality = "auto", format = "auto" }) => {
    const parts = [`f_${format}`, `q_${quality}`];

    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    if (width || height) parts.push(`c_${crop}`);

    return parts.join(",");
};

// Builds a delivery URL for a Cloudinary public_id. Returns an empty string
// when either the id or the cloud name is missing, so callers can treat a
// falsy result as "nothing to render" rather than emitting a broken URL.
export const cloudinaryUrl = (publicId, options = {}) => {
    if (!publicId || !cloudinaryCloudName) return "";

    return `${BASE}/${cloudinaryCloudName}/image/upload/${buildTransforms(options)}/${publicId}`;
};

// srcset string so the browser picks a width appropriate to the device,
// rather than every device downloading the largest variant.
export const cloudinarySrcSet = (publicId, widths = IMAGE_WIDTHS, options = {}) => {
    if (!publicId || !cloudinaryCloudName) return "";

    return widths
        .map((width) => `${cloudinaryUrl(publicId, { ...options, width })} ${width}w`)
        .join(", ");
};

// The single entry point components should use while the catalogue is part
// migrated. Hands back a Cloudinary URL for a public_id, and the original
// value untouched for a legacy /product-images/... path or an external URL.
// That means a component can be switched over once and keep working whether
// or not its images have moved yet.
export const resolveImageSrc = (value, options = {}) => {
    if (!value) return "";
    if (!isCloudinaryId(value)) return value;

    return cloudinaryUrl(value, options) || "";
};

export const resolveImageSrcSet = (value, widths = IMAGE_WIDTHS, options = {}) => (
    isCloudinaryId(value) ? cloudinarySrcSet(value, widths, options) : ""
);

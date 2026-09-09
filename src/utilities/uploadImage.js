import axiosInstance from './axiosInstance';

// Uploads a product photo to Cloudinary and hands back the reference the
// catalogue stores: { url, publicId }.
//
// The upload is signed, not unsigned. The browser never sees the Cloudinary API
// secret — it asks the backend (POST /uploads/signature, admin only) for a
// short-lived signature naming exactly one folder and one public_id, and
// Cloudinary rejects anything the browser adds beyond what was signed. So an
// admin session can put a file in upcell/products/<family>/ and nowhere else.
//
// This replaces reading the file into a base64 data URL and posting that as the
// image. That worked, in the sense that a picture appeared, but it stored the
// whole file inside the product document: a single test product pushed the
// admin list from 23 KB to 89 KB, the image could not be resized or converted
// because there was no public_id to build a delivery URL from, and every page
// that listed products paid for it. A publicId is a few dozen bytes and can be
// asked for at any width.
export const uploadProductImage = async (file, { productName = '' } = {}) => {
    const baseName = file.name.replace(/\.[^.]+$/, '');

    // sourceKey decides the hash suffix on the public_id, and the same key
    // always produces the same id. Including the file's own size and date means
    // re-uploading the identical file overwrites in place rather than leaving a
    // near-duplicate behind, while a genuinely different photo for the same
    // product gets its own id instead of silently replacing the first.
    const { data: signature } = await axiosInstance.post('uploads/signature', {
        target: 'product',
        context: productName,
        parts: [productName, baseName],
        sourceKey: `${productName}|${file.name}|${file.size}|${file.lastModified}`,
    });

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', signature.apiKey);
    form.append('timestamp', signature.timestamp);
    form.append('signature', signature.signature);
    // Both are signed, so both must be sent back exactly as issued.
    form.append('folder', signature.folder);
    form.append('public_id', signature.publicId);

    // Deliberately fetch rather than the shared axios instance: that one
    // carries our base URL and the admin's auth header, and neither belongs in
    // a request to a third party.
    const response = await fetch(signature.uploadUrl, { method: 'POST', body: form });

    if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.error?.message || `Image upload failed (${response.status})`);
    }

    const result = await response.json();

    return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
    };
};

export default uploadProductImage;

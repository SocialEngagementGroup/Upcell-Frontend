import axiosInstance from './axiosInstance';

// Saving a file from an endpoint that needs a token.
//
// The obvious way to offer a CSV is a plain <a href> to the API, because the
// browser already knows how to save a file. It does not work here: every admin
// endpoint is behind verifyToken, and a link navigation sends no Authorization
// header — axios adds it in an interceptor, and a link never goes through
// axios. The download answered 401 and the page bounced to the login screen.
//
// So the request goes through axios, and the blob it returns is handed to the
// browser through an object URL. Slightly more code than a link, and it is the
// only version that works while the endpoint is protected.

/**
 * Fetches a CSV and saves it.
 *
 * @param {string} path     the API path, e.g. "admin-returns-report.csv"
 * @param {object} params   query string parameters
 * @param {string} fallbackName  used only if the server sends no filename
 */
export async function downloadCsv(path, params = {}, fallbackName = 'upcell-export.csv') {
    const response = await axiosInstance.get(path, { params, responseType: 'blob' });

    // The server names the file, and it dates it — a file called returns.csv in
    // a downloads folder is indistinguishable from the last four. Read from the
    // header rather than rebuilt here, so the two cannot disagree.
    const disposition = response.headers?.['content-disposition'] || '';
    const match = /filename="?([^"]+)"?/.exec(disposition);
    const filename = match?.[1] || fallbackName;

    const url = window.URL.createObjectURL(response.data);

    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
    } finally {
        // Revoked either way. An object URL that is never released holds the
        // whole file in memory for as long as the tab is open.
        window.URL.revokeObjectURL(url);
    }

    return filename;
}

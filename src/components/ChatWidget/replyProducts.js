// Turning an assistant reply into product cards: the two pure steps, kept out
// of the component so they can be tested directly rather than only looked at.
//
// This is a *lookup*, not a parse-and-trust. An id only becomes a card if it
// resolves against the product list the widget already fetched from our own
// API, so a model that invents an id renders nothing at all. Same rule the rest
// of the assistant follows: the model proposes, our code decides.

const PRODUCT_PATH_GLOBAL = /\/iphone\/([a-f\d]{24})\/([a-f\d]{24})/gi;

export const MAX_PRODUCT_CARDS = 3;

export const productsInReply = (text, productsById) => {
    const seen = new Set();
    const found = [];

    for (const match of (text || '').matchAll(PRODUCT_PATH_GLOBAL)) {
        const id = match[2];
        if (seen.has(id)) continue;
        seen.add(id);

        const product = productsById?.get(id);
        if (product) found.push({ product, path: match[0] });
        if (found.length === MAX_PRODUCT_CARDS) break;
    }

    return found;
};

// With a card on screen the raw path in the sentence is noise, and a 50
// character hex string reads as a glitch. This removes it and the small joining
// words left stranded around it, so the prose still scans.
export const stripPaths = (text, paths) => {
    let cleaned = text || '';

    for (const path of paths) {
        cleaned = cleaned
            .replaceAll(`(${path})`, '')
            .replaceAll(`at ${path}`, '')
            .replaceAll(path, '');
    }

    return cleaned
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/ ([.,;:])/g, '$1')
        .replace(/\(\s*\)/g, '')
        .trim();
};

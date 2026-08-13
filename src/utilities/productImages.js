import productImageManifest from '../data/productImageManifest.js';
import { cloudinaryUrl, resolveImageRef } from './cloudinary';

// Width the catalogue actually renders at. Applied here rather than in each
// component because this is the single point every product image passes
// through — without a width, f_auto still ships a 522px source into a 200px
// grid slot, which is most of the remaining payload.
const CATALOG_IMAGE_WIDTH = 600;

const normalizeText = (value = '') => (
    String(value)
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
);

const tokenize = (value = '') => normalizeText(value).split(' ').filter(Boolean);
const unique = (items) => Array.from(new Set(items));

const PRODUCT_STOP_WORDS = new Set([
    'apple',
    'cellular',
    'wifi',
    'wi',
    'fi',
    'gb',
    'tb',
    'gen',
    'generation',
    'inch',
]);

const COLOR_STOP_WORDS = new Set([
    'product',
    'titanium',
    'space',
    'sierra',
    'alpine',
    'sky',
]);

const FAMILY_SEGMENT = {
    iphone: 'iphone',
    ipad: 'ipad',
    macbook: 'macbook',
};

const imageRecords = productImageManifest.map((image) => {
    const searchable = normalizeText(`${image.category} ${image.model} ${image.file} ${image.originalPath}`);
    const pathParts = image.originalPath.split('/').map((part) => normalizeText(part));
    return {
        ...image,
        searchable,
        pathParts,
        tokens: new Set(tokenize(searchable)),
    };
});

const getFamily = (product) => {
    const value = normalizeText(`${product?.categoryName || ''} ${product?.productName || ''}`);
    if (value.includes('iphone')) return 'iphone';
    if (value.includes('ipad')) return 'ipad';
    if (value.includes('macbook')) return 'macbook';
    return '';
};

const getProductTokens = (product) => unique(
    tokenize(`${product?.categoryName || ''} ${product?.productName || ''}`)
        .filter((token) => !PRODUCT_STOP_WORDS.has(token))
);

const getColorTokens = (product) => unique(
    tokenize(product?.color?.name || '')
        .filter((token) => !COLOR_STOP_WORDS.has(token))
);

const getRequiredModelTokens = (product, family) => {
    const nameTokens = tokenize(product?.productName || '');
    const categoryTokens = tokenize(product?.categoryName || '');
    const required = [];

    nameTokens.forEach((token, index) => {
        if (/^\d+(st|nd|rd|th)$/.test(token)) required.push(token);
        if (/^\d+e$/.test(token)) required.push(token);
        if (/^m\d+$/.test(token)) required.push(token);

        if (family === 'iphone') {
            if (/^\d+$/.test(token) && nameTokens[index - 1] === 'iphone') required.push(token);
            if (['mini', 'plus', 'pro', 'max'].includes(token)) required.push(token);
        }

        if (family === 'macbook') {
            if (/^\d+$/.test(token)) required.push(token);
            if (['air', 'pro', 'max'].includes(token)) required.push(token);
        }

        if (family === 'ipad') {
            if (/^\d+$/.test(token) && ['11', '13'].includes(token)) required.push(token);
            if (['mini', 'air', 'pro'].includes(token)) required.push(token);
        }
    });

    if (family === 'iphone') {
        categoryTokens.filter((token) => ['plus', 'pro', 'max'].includes(token)).forEach((token) => required.push(token));
    }

    if (family === 'macbook') {
        categoryTokens.filter((token) => ['air', 'pro'].includes(token)).forEach((token) => required.push(token));
    }

    if (family === 'ipad') {
        categoryTokens.filter((token) => ['mini', 'air', 'pro'].includes(token)).forEach((token) => required.push(token));
    }

    return unique(required);
};

const hasRequiredFamilyPath = (image, family) => {
    const segment = FAMILY_SEGMENT[family];
    if (!segment) return true;
    if (image.pathParts[0] !== segment) return false;

    // The zip contains duplicated iPad folders under MacBook; never use those
    // for MacBook products even if a chip/color token happens to match.
    if (family === 'macbook' && image.pathParts.some((part) => part === 'ipad')) return false;

    return true;
};

const containsRequiredTokens = (image, requiredTokens) => (
    requiredTokens.every((token) => image.tokens.has(token))
);

const containsColorTokens = (image, colorTokens) => (
    colorTokens.length === 0 || colorTokens.every((token) => image.tokens.has(token))
);
const getForbiddenModelTokens = (family, requiredTokens) => {
    const required = new Set(requiredTokens);
    if (family === 'iphone') {
        return ['mini', 'plus', 'pro', 'max'].filter((token) => !required.has(token));
    }
    if (family === 'ipad') {
        return ['mini', 'air', 'pro'].filter((token) => !required.has(token));
    }
    if (family === 'macbook') {
        return ['air', 'pro', 'max'].filter((token) => !required.has(token));
    }
    return [];
};

const avoidsForbiddenTokens = (image, forbiddenTokens) => (
    forbiddenTokens.every((token) => !image.tokens.has(token))
);

const scoreImage = (image, productTokens, colorTokens, family) => {
    let score = 0;

    if (family && image.tokens.has(family)) score += 40;

    productTokens.forEach((token) => {
        if (image.tokens.has(token)) score += token.length <= 2 ? 16 : 10;
    });

    colorTokens.forEach((token) => {
        if (image.tokens.has(token)) score += 45;
    });

    if (image.searchable.includes('front')) score += 4;
    if (image.searchable.includes('hero')) score += 4;

    return score;
};

// Fallback for products the manifest cannot match — newer models such as the
// iPhone 17e are not in it at all, so this path is common, not exceptional.
//
// imagePublicId is what the backfill wrote; image still holds the original
// /product-images/... path because the backfill was additive. Reading `image`
// alone left those products pointing at local files that are no longer
// deployed, so the public_id must be preferred.
const fallbackImage = (product) => resolveImageRef(
    { publicId: product?.imagePublicId, url: product?.image },
    { width: CATALOG_IMAGE_WIDTH }
);

export const resolveProductImage = (product) => {
    const productTokens = getProductTokens(product);
    if (!productTokens.length) return fallbackImage(product);

    const family = getFamily(product);
    const colorTokens = getColorTokens(product);
    const requiredModelTokens = getRequiredModelTokens(product, family);
    const forbiddenModelTokens = getForbiddenModelTokens(family, requiredModelTokens);

    const matching = (colors) => imageRecords.filter((image) => (
        hasRequiredFamilyPath(image, family)
        && containsRequiredTokens(image, requiredModelTokens)
        && avoidsForbiddenTokens(image, forbiddenModelTokens)
        && containsColorTokens(image, colors)
    ));

    // Colour is a hard filter first, because a colour-specific photo is always
    // the right answer when one exists. But not every model is photographed per
    // colour: the iPhone 17 Pro files are named iphone-17-pro-1/2/3 with no
    // colour in them, so requiring a colour token eliminated every candidate and
    // sent the whole model to the generic fallback. Retrying without the colour
    // constraint gives those products a real photo of the right model rather
    // than a stock hero image of a different phone. Colour matches still win
    // outright wherever they exist — this only runs when nothing matched at all.
    let candidates = matching(colorTokens);
    let scoringColorTokens = colorTokens;

    if (!candidates.length && colorTokens.length) {
        candidates = matching([]);
        scoringColorTokens = [];
    }

    if (!candidates.length) return fallbackImage(product);

    const best = candidates.reduce((winner, image) => {
        const score = scoreImage(image, productTokens, scoringColorTokens, family);
        if (!winner || score > winner.score) return { image, score };
        return winner;
    }, null);

    return best?.score >= 35
        ? cloudinaryUrl(best.image.publicId, { width: CATALOG_IMAGE_WIDTH })
        : fallbackImage(product);
};



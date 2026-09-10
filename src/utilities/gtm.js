// Google Tag Manager, loaded only when there is a container to load.
//
// The container id is not set yet — Yasir supplies it (X5 in PIPELINE.md).
// Everything here is wired now so that adding VITE_GTM_ID to Vercel turns
// tracking on with no code change and no release. With the env empty nothing
// loads, no script tag is written, and every push below is a no-op.
//
// The events are the standard GA4 ecommerce set. Named exactly as GA4 expects
// them, because a renamed event is one GA4 shows in reports as a custom event
// with no revenue attached to it — which looks like tracking that works and is
// not.

const containerId = () => import.meta.env.VITE_GTM_ID;

let loaded = false;

/**
 * Loads GTM once, if configured.
 *
 * Injected from JavaScript rather than written into index.html so that a
 * missing id means no request at all, rather than a request to a container
 * that does not exist. Called once from main.jsx.
 */
export const loadGtm = () => {
    const id = containerId();
    if (!id || loaded || typeof document === 'undefined') return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
};

/**
 * Pushes one event.
 *
 * Silent when GTM is not configured — the calls stay in the pages either way,
 * so turning tracking on later needs no edit to any of them.
 */
export const track = (event, payload = {}) => {
    if (!containerId() || typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
};

// GA4 wants items in a particular shape. Built here so a page cannot get it
// subtly wrong in its own way.
const toItem = (product, quantity = 1) => ({
    item_id: String(product?._id || product?.productId || ''),
    item_name: product?.productName || product?.name || '',
    item_category: product?.categoryName || undefined,
    item_variant: product?.storage || undefined,
    price: Number(product?.price ?? (product?.unitPriceCents ?? 0) / 100) || 0,
    quantity,
});

export const trackViewItem = (product) => track('view_item', {
    ecommerce: { currency: 'USD', value: Number(product?.price) || 0, items: [toItem(product)] },
});

export const trackAddToCart = (product, quantity = 1) => track('add_to_cart', {
    ecommerce: {
        currency: 'USD',
        value: (Number(product?.price) || 0) * quantity,
        items: [toItem(product, quantity)],
    },
});

export const trackBeginCheckout = (products = [], valueDollars = 0) => track('begin_checkout', {
    ecommerce: { currency: 'USD', value: valueDollars, items: products.map((p) => toItem(p)) },
});

// The key that stops a purchase being counted twice.
//
// The confirmation page is reachable by refresh, by the back button, and by
// the bank redirecting to it again. Each of those would fire another purchase
// with the same transaction_id, and GA4 does not deduplicate — revenue would
// simply be wrong, in the direction nobody questions.
const purchaseKey = (orderId) => `upcell:purchase-tracked:${orderId}`;

// Two guards, because they fail in different places.
//
// sessionStorage survives a refresh and the back button, which is how this
// page is most often reached twice — but it throws outright in some privacy
// modes, and a guard that depends on it fires twice for exactly the visitors
// whose storage is locked down.
//
// The Set covers a remount inside one page load, where storage is not
// consulted at all. Between them there is no configuration in which a purchase
// is counted twice, and inflated revenue is the worse failure of the two: a
// missing event is a gap somebody notices, an invented one looks like a sale.
const trackedThisLoad = new Set();

export const trackPurchase = (order) => {
    if (!order?._id) return;

    const key = purchaseKey(order._id);
    if (trackedThisLoad.has(key)) return;

    try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
    } catch {
        // Storage unavailable. The Set below still holds for this page load.
    }

    trackedThisLoad.add(key);

    track('purchase', {
        ecommerce: {
            transaction_id: String(order._id),
            currency: 'USD',
            value: Number(order.totalCents || 0) / 100,
            tax: Number(order.taxCents || 0) / 100,
            shipping: Number(order.shippingCents || 0) / 100,
            items: (order.items || []).map((item) => ({
                item_id: String(item.productId || ''),
                item_name: item.name || '',
                price: Number(item.unitPriceCents || 0) / 100,
                quantity: item.quantity || 1,
            })),
        },
    });
};

// Not a sale, but the thing UpCell most wants to measure on the trade-in page:
// somebody who went all the way through and left their details.
export const trackTradeInLead = ({ modelTitle, estimate }) => track('generate_lead', {
    currency: 'USD',
    value: Number(estimate) || 0,
    lead_type: 'trade_in',
    device: modelTitle,
});

export const trackWholesaleInquiry = () => track('wholesale_inquiry', { lead_type: 'wholesale' });

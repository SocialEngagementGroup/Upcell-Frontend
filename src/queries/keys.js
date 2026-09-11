// A single stable reference so `data = EMPTY_ARRAY` fallbacks don't create a
// new array every render while a query is loading — a fresh `[]` literal on
// each render breaks referential equality for anything that depends on it.
export const EMPTY_ARRAY = [];

export const productKeys = {
    list: () => ['products'],
    byParent: (parentId) => ['products', 'byParent', parentId],
    // The shop page's own lean, field-projected data source (see
    // Backend's getShopProducts) — a separate cache entry from list()
    // because it's a different payload shape, not just a different filter.
    shopList: () => ['products', 'shop'],
    // AllProduct/AddProduct's own lean data source (see Backend's
    // getAdminProducts) — includes accessories and edit-form fields
    // (discountPrice/originalPrice) that the public shopList() doesn't.
    adminList: () => ['products', 'admin'],
    // The four cards under a product page, grouped server-side (see Backend's
    // getRecommendedProducts). Keyed by the parent it excludes, because the
    // result differs per product page.
    recommended: (excludeParentId) => ['products', 'recommended', excludeParentId],
    // A product page, keyed by the slug in its URL. Two customers on the same
    // product share this entry; the old id-keyed lookup could not, because the
    // same product reached through different routes produced different keys.
    bySlug: (slug) => ['products', 'bySlug', slug],
    // The same handful of add-ons on every product page, so they are fetched
    // once for the session rather than per page.
    accessories: () => ['products', 'accessories'],
    // Just the products sitting in one cart (see Backend's getCartProducts).
    // Sorted so that adding A then B and adding B then A are the same cache
    // entry rather than two fetches of identical data.
    cart: (ids = []) => ['products', 'cart', [...ids].sort().join(',')],
};

export const categoryKeys = {
    parents: () => ['categories'],
    parent: (id) => ['categories', id],
    shop: () => ['shopCategories'],
    // The admin categories page's own data source — parent products with
    // variant counts computed server-side (see Backend's
    // getCategoriesWithProductCounts), not the full parents+variants fetch.
    parentsWithCounts: () => ['categories', 'withCounts'],
};

// The shop's sales tax rate. One number, quoted on every price.
// One guest order, read from an emailed link.
export const orderKeys = {
    guest: (id) => ['orders', 'guest', id],
};

export const taxKeys = {
    rate: () => ['tax', 'rate'],
};

export const refundRequestKeys = {
    // What the return form needs before it can be drawn: which items are still
    // returnable on this order, and how long is left.
    // Keyed on the reason and the chosen items as well as the order, because
    // the answer genuinely differs: the window is 14 days for a change of mind
    // and 30 for a fault, and the estimate depends on what is being sent back.
    // Sorted so picking A then B and B then A are one cache entry, not two.
    refundable: (orderId, reasonCode = '', itemIds = []) =>
        ['refundRequests', 'refundable', orderId, reasonCode, [...itemIds].sort().join(',')],
    mine: () => ['refundRequests', 'mine'],
    adminList: (status) => ['refundRequests', 'admin', status],
    // The counters at the top of the returns dashboard.
    dashboard: () => ['refundRequests', 'dashboard'],
    // Devices waiting to go back, and ones that came back undelivered.
    shipBacks: () => ['refundRequests', 'shipBacks'],
    // The fixed lists the server owns: the inspection checklist and the
    // dispositions. Cached hard because they only change when the code does.
    // One customer's offer, read from an emailed link.
    offer: (id) => ['refundRequests', 'offer', id],
    checklist: () => ['refundRequests', 'checklist'],
    // Keyed by request because the answer includes whether the supplier
    // route is open for that particular unit, which is a fact about the
    // device rather than about the list.
    dispositions: (requestId = '') => ['refundRequests', 'dispositions', requestId],
    report: (filters = {}) => ['refundRequests', 'report', filters],
};

// What customers said. Keyed by product and page for the product page, by
// status for the moderation queue.
export const reviewKeys = {
    forProduct: (parentId, page = 1) => ['reviews', 'product', parentId, page],
    mine: () => ['reviews', 'mine'],
    admin: (status) => ['reviews', 'admin', status],
};

export const notificationKeys = {
    // Shared between the sidebar badge (AdminSecret) and the Notifications
    // page itself — before this, each polled admin-notifications-unread-count
    // independently with no shared cache, so marking one read on the
    // Notifications page never updated the sidebar badge until a full reload.
    unreadCount: () => ['notifications', 'unreadCount'],
};

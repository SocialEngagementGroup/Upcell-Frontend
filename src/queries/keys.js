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

export const notificationKeys = {
    // Shared between the sidebar badge (AdminSecret) and the Notifications
    // page itself — before this, each polled admin-notifications-unread-count
    // independently with no shared cache, so marking one read on the
    // Notifications page never updated the sidebar badge until a full reload.
    unreadCount: () => ['notifications', 'unreadCount'],
};

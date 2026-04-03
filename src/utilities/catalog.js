export const inferFamily = (product) => {
    const name = `${product?.productName || ''} ${product?.description || ''}`.toLowerCase();
    if (name.includes('iphone')) return 'iPhone';
    if (name.includes('ipad')) return 'iPad';
    if (name.includes('macbook')) return 'MacBook';
    if (name.includes('watch')) return 'Watch';
    return 'Device';
};

export const getProductRouteParent = (product) => product?.parentCatagory || product?.parentId || '';

export const normalizeProduct = (product) => ({
    ...product,
    color: {
        ...(product?.color || {}),
        value: product?.color?.value || product?.color?.hex || '#d1d5db',
    },
    family: inferFamily(product),
});

export const groupProductsByParent = (products = []) => {
    const map = new Map();
    products.forEach((product) => {
        const key = getProductRouteParent(product);
        if (!key) return;
        const existing = map.get(key);
        if (!existing || Number(product.price || 0) < Number(existing.price || 0)) {
            map.set(key, product);
        }
    });
    return Array.from(map.values());
};

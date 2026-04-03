export const inferFamily = (product) => {
    const name = `${product?.categoryName || ''} ${product?.productName || ''} ${product?.description || ''}`.toLowerCase();
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
        const nextColor = product?.color?.name
            ? {
                name: product.color.name,
                value: product?.color?.value || product?.color?.hex || '#d1d5db',
            }
            : null;

        const mergeVariantMeta = (baseProduct) => {
            const colorMap = new Map(
                (baseProduct.availableColors || []).map((color) => [color.name, color])
            );

            if (nextColor) {
                colorMap.set(nextColor.name, nextColor);
            }

            return {
                ...baseProduct,
                availableColors: Array.from(colorMap.values()),
            };
        };

        if (product.outOfStock && !existing) {
            map.set(key, mergeVariantMeta(product));
            return;
        }
        if (existing?.outOfStock && !product.outOfStock) {
            map.set(key, mergeVariantMeta(product));
            return;
        }
        if ((!existing || Number(product.price || 0) < Number(existing.price || 0)) && !(product.outOfStock && !existing?.outOfStock)) {
            map.set(key, mergeVariantMeta(product));
            return;
        }

        if (existing) {
            map.set(key, mergeVariantMeta(existing));
        }
    });
    return Array.from(map.values());
};

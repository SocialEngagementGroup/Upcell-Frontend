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

import axiosInstance from './axiosInstance';

let productCachePromise = null;
const CACHE_KEY = 'upcell_product_cache';
const CACHE_VERSION = 1;

const readCachedProducts = () => {
    if (typeof window === 'undefined') return null;

    const cachedData = window.localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    try {
        const parsed = JSON.parse(cachedData);
        if (parsed?.version !== CACHE_VERSION || !Array.isArray(parsed?.products)) {
            window.localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return parsed.products;
    } catch (err) {
        console.error("Failed to parse cached products", err);
        window.localStorage.removeItem(CACHE_KEY);
        return null;
    }
};

const writeCachedProducts = (products) => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(CACHE_KEY, JSON.stringify({
        version: CACHE_VERSION,
        cachedAt: Date.now(),
        products,
    }));
};

export const fetchCachedProducts = () => {
    if (!productCachePromise) {
        const cachedProducts = readCachedProducts();
        if (cachedProducts) {
            productCachePromise = Promise.resolve(cachedProducts);
            return productCachePromise;
        }

        productCachePromise = axiosInstance.get('product')
            .then(res => {
                const normalized = res.data.map(normalizeProduct);
                writeCachedProducts(normalized);
                return normalized;
            })
            .catch(error => {
                productCachePromise = null;
                throw error;
            });
    }
    return productCachePromise;
};

export const clearProductCache = () => {
    productCachePromise = null;
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(CACHE_KEY);
    }
};

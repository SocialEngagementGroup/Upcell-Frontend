import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { normalizeProduct } from '../utilities/catalog';
import { productKeys, categoryKeys } from './keys';

const invalidateProductData = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: productKeys.list() });
    queryClient.invalidateQueries({ queryKey: productKeys.shopList() });
    queryClient.invalidateQueries({ queryKey: productKeys.adminList() });
    queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
    // A product being added/edited/removed changes the per-category variant
    // counts shown on the admin categories page.
    queryClient.invalidateQueries({ queryKey: categoryKeys.parentsWithCounts() });
};

// Hoisted so `select` has a stable identity across renders â€” an inline
// `select` fn is recreated every render, which defeats React Query's memoized
// selector and produces a brand-new array every render, forever.
const selectNormalizedProducts = (products) => products.map(normalizeProduct);

export const useProductsQuery = (options = {}) => useQuery({
    queryKey: productKeys.list(),
    queryFn: () => axiosInstance.get('product').then((res) => res.data),
    select: selectNormalizedProducts,
    ...options,
});

// The shop page's data source. Same normalization as useProductsQuery
// (family inference, image resolution, color fallback), but backed by
// /products/shop — which returns only the fields a listing card needs
// instead of every field of every SingleVariation document. Grouping,
// filtering and search all stay client-side in ShopPage itself, exactly as
// before; this only changes how much data it takes to get there.
export const useShopProductsQuery = (options = {}) => useQuery({
    queryKey: productKeys.shopList(),
    queryFn: () => axiosInstance.get('products/shop').then((res) => res.data),
    select: selectNormalizedProducts,
    ...options,
});

// The cart's own products, fetched by id through the endpoint checkout already
// uses. The page previously read useProductsQuery — every field of all 956
// variations, 838 KB — to show the two or three items someone had added.
//
// A product that has since been deleted simply is not in the response, which is
// the same signal the old approach gave (it was absent from the catalogue), so
// the page's stale-id cleanup still works unchanged.
export const useCartProductsQuery = (ids = [], options = {}) => useQuery({
    queryKey: productKeys.cart(ids),
    queryFn: () => axiosInstance.post('cart', { ids }).then((res) => res.data),
    select: selectNormalizedProducts,
    enabled: ids.length > 0,
    ...options,
});

// Everything a product page needs, from the slug in the URL: the variant being
// viewed, its whole family for the colour and storage pickers, and the parent.
// One request rather than three, because the page cannot render any of it
// without all of it.
//
// A 404 from here means the slug does not exist. That is a real answer, not a
// failure to retry — retrying a URL that was never valid just delays the 404
// the customer needs to see.
export const useProductBySlugQuery = (slug, options = {}) => useQuery({
    queryKey: productKeys.bySlug(slug),
    queryFn: () => axiosInstance.get(`products/by-slug/${slug}`).then((res) => res.data),
    enabled: Boolean(slug),
    retry: (failureCount, error) => error?.response?.status !== 404 && failureCount < 1,
    // Choosing a different colour or storage navigates to another slug, which
    // is a different query. Without this the page emptied to a skeleton and
    // rebuilt itself on every swatch — the whole layout flashing for data it
    // already had, since every variant of a family returns the same family.
    //
    // Keeping the previous result on screen while the new one arrives means the
    // price and photo update in place. Not applied to a 404: showing the last
    // good product under a URL that does not exist would be the old bug back in
    // a different form.
    placeholderData: (previous, previousQuery) =>
        (previousQuery?.state?.error ? undefined : previous),
    ...options,
});

// One product by its Mongo id. Used only by the legacy redirect, which has an
// old /iphone/:parentId/:productId URL and needs the slug to send the visitor
// on to. Nothing else should reach for this — pages address products by slug.
export const useProductQuery = (productId, options = {}) => useQuery({
    queryKey: ['products', 'byId', productId],
    queryFn: () => axiosInstance.get(`product/${productId}`).then((res) => res.data),
    enabled: Boolean(productId),
    ...options,
});

// The add-ons offered on every product page. Moved out of a raw useEffect so
// the two accessories are fetched once and reused across product pages instead
// of being refetched every time somebody opens a different phone.
export const useAccessoriesQuery = (options = {}) => useQuery({
    queryKey: productKeys.accessories(),
    queryFn: () => axiosInstance.get('accessories').then((res) => res.data),
    ...options,
});

// A product page needs two things, and neither is the whole catalogue: the
// variants of the product being viewed (for the colour and storage pickers)
// and a few cards to recommend. It used to read useProductsQuery for both,
// which fetches every field of all 956 variations — 838 KB — to render one
// product.
//
// These two endpoints already existed on the backend and simply were not
// being used here.
export const useProductFamilyQuery = (parentId, options = {}) => useQuery({
    queryKey: productKeys.byParent(parentId),
    queryFn: () => axiosInstance.get(`allSameParentProducts/${parentId}`).then((res) => res.data),
    select: selectNormalizedProducts,
    enabled: Boolean(parentId),
    ...options,
});

// limit is deliberately higher than the four cards that get rendered. The
// server groups and slices before the client can drop families it does not
// show (Watch, and anything inferFamily cannot place), so asking for exactly
// four would sometimes render three.
export const useRecommendedProductsQuery = (excludeParentId, options = {}) => useQuery({
    queryKey: productKeys.recommended(excludeParentId),
    queryFn: () => axiosInstance
        .get('products/recommended', { params: { excludeParentId, limit: 8 } })
        .then((res) => res.data),
    select: selectNormalizedProducts,
    enabled: Boolean(excludeParentId),
    ...options,
});

// Warms the shop cache from a page the visitor is already on, so opening Shop
// renders products straight away instead of showing the loading skeleton.
//
// Deliberately waits for the browser to go idle: the home page's own hero
// image is what the visitor is actually looking at, and a prefetch that
// competes with it for bandwidth would make the page they are on slower to
// make a page they may never open faster.
//
// prefetchQuery is a no-op when the cache already holds fresh data, so
// returning to the home page mid-session does not refetch.
export const usePrefetchShopProducts = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        let cancelled = false;

        const run = () => {
            if (cancelled) return;
            queryClient.prefetchQuery({
                queryKey: productKeys.shopList(),
                queryFn: () => axiosInstance.get('products/shop').then((res) => res.data),
            });
        };

        // requestIdleCallback is unsupported in Safari < 17, hence the fallback.
        // Which one scheduled it decides which one cancels it — reading the
        // pair independently would clear a timeout id with cancelIdleCallback.
        const hasIdleCallback = typeof window.requestIdleCallback === 'function';
        const handle = hasIdleCallback
            ? window.requestIdleCallback(run, { timeout: 3000 })
            : window.setTimeout(run, 1500);

        return () => {
            cancelled = true;
            if (hasIdleCallback) {
                window.cancelIdleCallback(handle);
            } else {
                window.clearTimeout(handle);
            }
        };
    }, [queryClient]);
};

// AllProduct and AddProduct's own data source — same full, ungrouped variant
// list they've always needed (for instant client-side search and duplicate-
// name detection while typing), just trimmed to the fields those two pages
// actually render or edit, instead of every field of every document.
export const useAdminProductsQuery = (options = {}) => useQuery({
    queryKey: productKeys.adminList(),
    queryFn: () => axiosInstance.get('admin-products').then((res) => res.data),
    select: selectNormalizedProducts,
    ...options,
});

export const useProductsByParentQuery = (parentId, options = {}) => useQuery({
    queryKey: productKeys.byParent(parentId),
    queryFn: () => axiosInstance.get(`allSameParentProducts/${parentId}`).then((res) => res.data),
    select: selectNormalizedProducts,
    enabled: Boolean(parentId),
    ...options,
});

export const useSaveProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => axiosInstance.post('product', payload),
        onSuccess: () => invalidateProductData(queryClient),
    });
};

export const useUpdateProductVariantMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, patch }) => axiosInstance.patch(`product/${id}`, patch),
        onSuccess: () => invalidateProductData(queryClient),
    });
};

export const useDeleteProductVariantMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`product/${id}`),
        onSuccess: () => invalidateProductData(queryClient),
    });
};

export const useDeleteProductFamilyMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (parentId) => axiosInstance.delete(`product-family/${parentId}`),
        onSuccess: () => invalidateProductData(queryClient),
    });
};


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


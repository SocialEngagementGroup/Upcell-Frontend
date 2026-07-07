import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { normalizeProduct } from '../utilities/catalog';
import { productKeys, categoryKeys } from './keys';

const invalidateProductData = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: productKeys.list() });
    queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
};

// Hoisted so `select` has a stable identity across renders — an inline
// `select` fn is recreated every render, which defeats React Query's memoized
// selector and produces a brand-new array every render, forever.
const selectNormalizedProducts = (products) => products.map(normalizeProduct);

export const useProductsQuery = (options = {}) => useQuery({
    queryKey: productKeys.list(),
    queryFn: () => axiosInstance.get('product').then((res) => res.data),
    select: selectNormalizedProducts,
    ...options,
});

export const useProductsByParentQuery = (parentId, options = {}) => useQuery({
    queryKey: productKeys.byParent(parentId),
    queryFn: () => axiosInstance.get(`allSameParentProducts/${parentId}`).then((res) => res.data),
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

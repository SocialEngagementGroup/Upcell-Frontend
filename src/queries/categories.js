import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { categoryKeys, productKeys } from './keys';

export const useParentCategoriesQuery = (options = {}) => useQuery({
    queryKey: categoryKeys.parents(),
    queryFn: () => axiosInstance.get('catagory').then((res) => res.data),
    ...options,
});

export const useParentCategoryQuery = (id, options = {}) => useQuery({
    queryKey: categoryKeys.parent(id),
    queryFn: () => axiosInstance.get(`catagory/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    ...options,
});

// The admin categories page's own lean data source — variant counts computed
// server-side via $lookup/$group, instead of fetching every ParentProduct
// AND every SingleVariation (956+ documents) just to count matches in a
// JavaScript loop.
export const useCategoriesWithCountsQuery = (options = {}) => useQuery({
    queryKey: categoryKeys.parentsWithCounts(),
    queryFn: () => axiosInstance.get('admin-catagory-counts').then((res) => res.data),
    ...options,
});

export const useShopCategoriesQuery = (options = {}) => useQuery({
    queryKey: categoryKeys.shop(),
    queryFn: () => axiosInstance.get('shop-categories').then((res) => res.data),
    ...options,
});

export const useCreateShopCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => axiosInstance.post('shop-categories', payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.shop() });
        },
    });
};

export const useUpdateShopCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, patch }) => axiosInstance.patch(`shop-categories/${id}`, patch),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.shop() });
            // A category rename can affect how products under it are labeled/
            // grouped — both product caches, not just the full-list one, or
            // the Shop page's own leaner cache goes stale until it naturally
            // expires (found during the 2026-09-04 caching audit).
            queryClient.invalidateQueries({ queryKey: productKeys.list() });
            queryClient.invalidateQueries({ queryKey: productKeys.shopList() });
            queryClient.invalidateQueries({ queryKey: productKeys.adminList() });
        },
    });
};

export const useDeleteShopCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`shop-categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.shop() });
            queryClient.invalidateQueries({ queryKey: productKeys.list() });
            queryClient.invalidateQueries({ queryKey: productKeys.shopList() });
            queryClient.invalidateQueries({ queryKey: productKeys.adminList() });
        },
    });
};

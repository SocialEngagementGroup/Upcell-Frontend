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
            // A category rename can affect how products under it are labeled/grouped.
            queryClient.invalidateQueries({ queryKey: productKeys.list() });
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
        },
    });
};

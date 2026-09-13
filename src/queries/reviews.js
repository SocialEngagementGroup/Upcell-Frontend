import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { reviewKeys } from './keys';

// What customers said about a product, and what this customer still could.

export const useProductReviewsQuery = (parentId, page = 1, options = {}) => useQuery({
    queryKey: reviewKeys.forProduct(parentId, page),
    queryFn: () => axiosInstance.get(`products/${parentId}/reviews`, { params: { page } }).then((res) => res.data),
    enabled: Boolean(parentId),
    // A review approved a minute ago does not need to appear this second, and
    // this runs on every product page view.
    staleTime: 5 * 60 * 1000,
    ...options,
});

export const useMyReviewsQuery = (options = {}) => useQuery({
    queryKey: reviewKeys.mine(),
    queryFn: () => axiosInstance.get('reviews/mine').then((res) => res.data),
    ...options,
});

export const useWriteReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => axiosInstance.post('reviews', payload).then((res) => res.data),
        // Only the customer's own list. The product page does not change —
        // a new review is pending, and pending reviews are not published.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.mine() }),
    });
};

export const useAdminReviewsQuery = (status = 'PENDING', options = {}) => useQuery({
    queryKey: reviewKeys.admin(status),
    queryFn: () => axiosInstance.get('admin-reviews', { params: { status } }).then((res) => res.data),
    ...options,
});

export const useModerateReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }) => axiosInstance.patch(`admin-reviews/${id}`, body).then((res) => res.data),
        // Every list, because a review moves between them — and the product
        // page's own cache, whose average has just changed.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

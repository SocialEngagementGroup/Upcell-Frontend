import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { refundRequestKeys } from './keys';

// Whether this order can be returned, and which items. The server answers 200
// with ok:false when it cannot — "delivered yesterday, the window opens then",
// "closed on the 3rd", "you already have a request open" — so the page can say
// which of those it is instead of showing one generic failure.
//
// enabled by `orderId` so it only runs once an order is actually open.
export const useRefundableItemsQuery = (orderId, { reasonCode = '', itemIds = [], ...options } = {}) => useQuery({
    queryKey: refundRequestKeys.refundable(orderId, reasonCode, itemIds),
    queryFn: () => axiosInstance
        .get(`orders/${orderId}/refundable`, {
            params: {
                ...(reasonCode ? { reasonCode } : {}),
                ...(itemIds.length ? { itemIds: [...itemIds].sort().join(',') } : {}),
            },
        })
        .then((res) => res.data),
    enabled: Boolean(orderId),
    // The reason and the tick boxes change as the customer works through the
    // form, and each change is a different query. Without this the panel
    // emptied to its loading line on every click.
    placeholderData: (previous) => previous,
    ...options,
});

export const useMyRefundRequestsQuery = (options = {}) => useQuery({
    queryKey: refundRequestKeys.mine(),
    queryFn: () => axiosInstance.get('refund-requests/mine').then((res) => res.data),
    ...options,
});

export const useCreateRefundRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => axiosInstance.post('refund-requests', payload).then((res) => res.data),
        onSuccess: (_data, variables) => {
            // Both change: the order now has a request open, so its refundable
            // check must stop offering the form, and the customer's own list
            // has a new row.
            queryClient.invalidateQueries({ queryKey: refundRequestKeys.refundable(variables.orderId) });
            queryClient.invalidateQueries({ queryKey: refundRequestKeys.mine() });
        },
    });
};

// Staff side.
export const useAdminRefundRequestsQuery = (status, options = {}) => useQuery({
    queryKey: refundRequestKeys.adminList(status),
    queryFn: () => axiosInstance
        .get(`admin-refund-requests/${status}`)
        .then((res) => res.data),
    ...options,
});

export const useUpdateRefundRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }) => axiosInstance
            .patch(`admin-refund-requests/${id}/status`, body)
            .then((res) => res.data),
        // A move takes the request out of one queue and into another, so every
        // status list is stale, not just the one being viewed.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['refundRequests', 'admin'] }),
    });
};

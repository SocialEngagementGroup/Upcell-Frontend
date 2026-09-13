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

// The counters Yasir opens the returns page to. Refetched on an interval
// because a device can arrive or a customer can answer an offer while the page
// is open, and a stale "3 overdue" is worse than no number.
export const useReturnsDashboardQuery = (options = {}) => useQuery({
    queryKey: refundRequestKeys.dashboard(),
    queryFn: () => axiosInstance.get('admin-returns-dashboard').then((res) => res.data),
    refetchInterval: 60_000,
    ...options,
});

// The inspection checklist and the disposition list come from the server so
// the options on screen and the ones it accepts are one list. They only change
// when the code does, so they are cached for the session rather than refetched.
const STATIC_LIST_OPTIONS = {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
};

export const useInspectionChecklistQuery = (options = {}) => useQuery({
    queryKey: refundRequestKeys.checklist(),
    queryFn: () => axiosInstance.get('admin-return-inspection-checklist').then((res) => res.data),
    ...STATIC_LIST_OPTIONS,
    ...options,
});

// The routes a device can take, and — when a request is named — whether each
// one is open for that unit. A device bought from a member of the public has
// no supplier to go back to, and the answer is better given before the staff
// member picks the route than after they have typed a reason for it.
export const useDispositionsQuery = (requestId, options = {}) => useQuery({
    queryKey: refundRequestKeys.dispositions(requestId),
    queryFn: () => axiosInstance
        .get('admin-return-dispositions', {
            params: requestId ? { requestId } : undefined,
        })
        .then((res) => res.data),
    ...STATIC_LIST_OPTIONS,
    // The availability half depends on the unit, so this one is not the
    // session-long cache the plain list is.
    ...(requestId ? { staleTime: 60_000, gcTime: 5 * 60_000 } : {}),
    ...options,
});

export const useShipBackQueueQuery = (options = {}) => useQuery({
    queryKey: refundRequestKeys.shipBacks(),
    queryFn: () => axiosInstance.get('admin-return-ship-backs').then((res) => res.data),
    ...options,
});

export const useReturnsReportQuery = (filters = {}, options = {}) => useQuery({
    queryKey: refundRequestKeys.report(filters),
    queryFn: () => axiosInstance
        .get('admin-returns-report', { params: filters })
        .then((res) => res.data),
    // Changing a filter is a different question, not a reason to blank the
    // page — the previous answer stays up while the new one loads.
    placeholderData: (previous) => previous,
    ...options,
});

// Every write below moves a request between queues, so all of them invalidate
// the whole admin tree rather than one status. A request that just left
// "To inspect" has to disappear from it, and the dashboard counters change too.
const invalidateReturns = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['refundRequests', 'admin'] });
    queryClient.invalidateQueries({ queryKey: refundRequestKeys.dashboard() });
    queryClient.invalidateQueries({ queryKey: refundRequestKeys.shipBacks() });
};

const adminMutation = (path, method = 'patch') => () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }) => axiosInstance[method](
            `admin-refund-requests/${id}/${path}`,
            body
        ).then((res) => res.data),
        onSuccess: () => invalidateReturns(queryClient),
    });
};

export const useRecordLabelMutation = adminMutation('label');
export const useSubmitInspectionMutation = adminMutation('inspection');
export const useOfferRevisedRefundMutation = adminMutation('revised-offer');
export const useSettleReturnMutation = adminMutation('settle');
export const useShipBackMutation = adminMutation('ship-back');
export const useMarkUndeliverableMutation = adminMutation('undeliverable');
export const useRecordDispositionMutation = adminMutation('disposition');
// Moving the date the customer's 30 days started from. It decides whether a
// return is inside the window, so it moves money — the server demands a note.
export const useOverrideWindowMutation = adminMutation('window');
// Freezing the inspection photos past their ninety days, and letting them go.
export const useSetDisputeHoldMutation = adminMutation('dispute-hold');

// The revised offer, for the page the email links to.
//
// No auth: the token in the link is the authorisation, and it grants exactly
// this one return. A bad token, an unknown id and a deleted return all answer
// 404, so retry is pointless and would only help somebody guessing.
export const useRevisedOfferQuery = (id, token) => useQuery({
    queryKey: refundRequestKeys.offer(id),
    queryFn: () => axiosInstance
        .get(`returns/${id}`, { params: { token } })
        .then((res) => res.data),
    enabled: Boolean(id && token),
    retry: false,
    refetchOnWindowFocus: false,
});

// Accepting or declining it. Deliberately not wired to invalidateReturns: the
// customer is not signed in and has no admin queries to refresh.
export const useRespondToOfferMutation = () => useMutation({
    mutationFn: ({ id, decision, token }) => axiosInstance
        .post(`returns/${id}/${decision}`, {}, { params: { token } })
        .then((res) => res.data),
});

// Finding a parcel on the receiving bench by RMA or tracking number.
//
// A lookup rather than a search-as-you-type: staff read a number off a box, and
// firing a request per keystroke against an unindexed prefix would be slower
// and noisier than pressing enter.
export const useReturnLookup = () => useMutation({
    mutationFn: (q) => axiosInstance
        .get('admin-refund-requests/lookup', { params: { q } })
        .then((res) => res.data),
});

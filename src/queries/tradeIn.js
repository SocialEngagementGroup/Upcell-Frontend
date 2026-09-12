import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import { tradeInKeys } from './keys';

// The models UpCell quotes for and the questions each type is asked.
//
// This used to be four tables in the page's own bundle — the models, their
// prices, the storage multipliers and the questions. Prices were a deploy to
// change, and the arithmetic ran in the browser, which is why posting an
// invented estimate worked.
//
// Cached hard: the same answer for everyone, and it changes when staff edit a
// price rather than when a customer does anything.
export const useTradeInCatalogQuery = (options = {}) => useQuery({
    queryKey: ['tradeIn', 'catalog'],
    queryFn: () => axiosInstance.get('trade-in-catalog').then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
});

const quoteFor = (payload) => axiosInstance.post('trade-in-quote', payload).then((res) => res.data);

/**
 * What this device is worth, asked as the customer answers.
 *
 * Debounced, because the selection changes on every tap: a request per tap
 * would be a dozen for one quote, and the answer that matters is the one after
 * they stop. 300ms is under the time it takes to move a thumb to the next
 * option, so the number is there before they look for it.
 *
 * The previous answer stays on screen while a new one is in flight. A price
 * that blanks between taps reads as though something went wrong.
 */
export const useTradeInQuote = ({ modelKey, storage, carrier, answers }) => {
    const [quote, setQuote] = useState(null);
    const [pending, setPending] = useState(false);
    const [failed, setFailed] = useState(false);

    // Stringified so the effect compares by value. answers is rebuilt on every
    // render, so a reference comparison would fire on every one of them.
    const key = JSON.stringify({ modelKey, storage, carrier, answers });

    useEffect(() => {
        if (!modelKey) {
            setQuote(null);
            return undefined;
        }

        let cancelled = false;
        setPending(true);

        const timer = setTimeout(() => {
            quoteFor({ modelKey, storage, carrier, answers })
                .then((result) => {
                    // A reply to a selection the customer has already moved on
                    // from must not overwrite a newer one.
                    if (cancelled) return;
                    setQuote(result);
                    setFailed(false);
                })
                .catch(() => {
                    if (!cancelled) setFailed(true);
                })
                .finally(() => {
                    if (!cancelled) setPending(false);
                });
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            setPending(false);
        };
    }, [key]);

    return { quote, pending, failed };
};

export const useSubmitTradeInMutation = () => useMutation({
    mutationFn: (payload) => axiosInstance.post('trade-in-requests', payload).then((res) => res.data),
});

// ---------------------------------------------------------------------------
// Trade-in intake: the admin queue and the panels that hang off it.
//
// The mirror of queries/refundRequests.js, because the workflow is the mirror
// of returns. Every mutation invalidates the whole trade-in tree rather than
// one key: a request moves between status tabs, so the list it came from and
// the list it lands in are both stale.

export const useAdminTradeInsQuery = (status = 'Quoted', page = 1, options = {}) => useQuery({
    queryKey: tradeInKeys.adminList(`${status}:${page}`),
    queryFn: () => axiosInstance
        .get(`admin-trade-in-requests/${encodeURIComponent(status)}`, { params: { page } })
        .then((res) => res.data),
    ...options,
});

// One shared invalidator. Six panels move a request, and each one leaves both
// the list it left and the list it joined out of date.
const useTradeInMutation = (buildRequest) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: buildRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tradeIns'] }),
    });
};

export const useTradeInStatusMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.patch(`trade-in-requests/${id}/status`, body).then((res) => res.data));

export const useTradeInLabelMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.post(`admin-trade-in-requests/${id}/label`, body).then((res) => res.data));

export const useTradeInInspectionMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.post(`admin-trade-in-requests/${id}/inspection`, body).then((res) => res.data));

export const useTradeInRevisedOfferMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.post(`admin-trade-in-requests/${id}/revised-offer`, body).then((res) => res.data));

export const useTradeInPayoutMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.patch(`admin-trade-in-requests/${id}/payout`, body).then((res) => res.data));

export const useTradeInShipBackMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.post(`admin-trade-in-requests/${id}/ship-back`, body).then((res) => res.data));

export const useTradeInUndeliverableMutation = () => useTradeInMutation(({ id, ...body }) =>
    axiosInstance.post(`admin-trade-in-requests/${id}/undeliverable`, body).then((res) => res.data));

export const useListTradedDeviceMutation = () => useTradeInMutation(({ id }) =>
    axiosInstance.post(`admin-trade-in-requests/${id}/list`).then((res) => res.data));

// The receiving desk. Not a query with a key that caches: somebody types a
// number off a box and wants this answer, not the last one.
export const lookupTradeIn = (term) =>
    axiosInstance.get('admin-trade-in-lookup', { params: { q: term } }).then((res) => res.data);

export const useTradeInReportQuery = (filters = {}, options = {}) => useQuery({
    queryKey: tradeInKeys.report(filters),
    queryFn: () => axiosInstance.get('admin-trade-in-report', { params: filters }).then((res) => res.data),
    ...options,
});

// The customer's side of a revised offer, read from the link in an email. No
// login — an offer they cannot open is an offer that expires and a device that
// gets posted back.
export const useTradeInOfferQuery = (id, token, options = {}) => useQuery({
    queryKey: tradeInKeys.offer(id, token),
    queryFn: () => axiosInstance.get(`trade-ins/${id}/offer`, { params: { token } }).then((res) => res.data),
    enabled: Boolean(id && token),
    // One answer per link. Refetching on every focus would re-ask a question
    // the customer has already answered.
    staleTime: Infinity,
    retry: false,
    ...options,
});

export const useAnswerTradeInOfferMutation = () => useMutation({
    mutationFn: ({ id, decision, token }) =>
        axiosInstance.post(`trade-ins/${id}/${decision}`, { token }).then((res) => res.data),
});

// A customer's own trade-ins, for the My Account panel.
export const useMyTradeInsQuery = (options = {}) => useQuery({
    queryKey: tradeInKeys.mine(),
    queryFn: () => axiosInstance.get('trade-ins/mine').then((res) => res.data),
    // A 403 here means the email is not confirmed yet, which is an answer
    // rather than a failure to retry.
    retry: false,
    ...options,
});

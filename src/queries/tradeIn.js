import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axiosInstance from '../utilities/axiosInstance';

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

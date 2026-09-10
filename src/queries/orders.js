import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { taxKeys } from './keys';

// What a page quotes for the instant before the rate arrives, and if the
// request fails. The same 8% the server falls back to, so the two never
// disagree by more than one render.
export const DEFAULT_TAX_RATE = 0.08;

// The sales tax rate, from the server.
//
// It used to be written into three places on this side — twice in the cart as
// 0.08 and 1.08, once at the checkout — so changing it meant finding all
// three, and any one of them could drift from what the customer is actually
// charged. The rate is the same for everyone and changes about never, so it is
// cached hard and the last known answer is kept while it revalidates.
export const useTaxRateQuery = (options = {}) => useQuery({
    queryKey: taxKeys.rate(),
    queryFn: () => axiosInstance.get('tax-rate').then((res) => res.data.rate),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    // A quoted total is better slightly stale than missing. The figure that
    // binds is the one checkout computes anyway.
    placeholderData: (previous) => previous,
    ...options,
});

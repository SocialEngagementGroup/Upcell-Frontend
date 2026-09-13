import axiosInstance from '../utilities/axiosInstance';

// The saved cart of a signed-in customer.
//
// Deliberately not React Query. A cart is not a cached read — it is one piece
// of state that already lives in App, and putting a second copy of it in a
// query cache means two sources of truth that can disagree on the one screen
// where that is most visible. These are plain calls, used once each by
// useCartSync.

export const fetchSavedCart = () =>
    axiosInstance.get('cart/mine').then((res) => ({
        items: Array.isArray(res.data?.items) ? res.data.items.map(String) : [],
        removed: Number(res.data?.removed) || 0,
    }));

export const saveCart = (items) =>
    axiosInstance.put('cart/mine', { items: items.map(String) });

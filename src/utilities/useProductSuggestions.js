import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

// Fetch product-level search suggestions. `signal` is provided by TanStack Query
// so stale/out-of-date keystroke requests get cancelled automatically.
const fetchSuggestions = async (term, signal) => {
    const { data } = await axiosInstance.get('products/suggest', {
        params: { q: term },
        signal,
    });
    return Array.isArray(data) ? data : [];
};

// Type-ahead suggestions powered by TanStack Query:
//  - cached per search term (re-typing a term is instant)
//  - keepPreviousData => no flicker while the next results load
//  - enabled only for terms >= 2 chars (no wasted calls)
export default function useProductSuggestions(term) {
    const normalized = (term || '').trim();

    return useQuery({
        queryKey: ['product-suggestions', normalized.toLowerCase()],
        queryFn: ({ signal }) => fetchSuggestions(normalized, signal),
        enabled: normalized.length >= 2,
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
}

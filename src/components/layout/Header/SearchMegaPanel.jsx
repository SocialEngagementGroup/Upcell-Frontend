import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { POPULAR_SEARCHES } from './navigationData';

// Full-width search mega-panel displayed underneath the main navigation.
// Replicates the Back Market layout:
// - 100% viewport width white background section
// - Constrained inner search container aligned with the left edge of the search input
// - "Ask me..." lavender row
// - "Popular searches" label and items with smooth hover-revealed right arrow
const SearchMegaPanel = ({
    searchTerm = '',
    onClose,
    suggestions = [],
    isLoading = false,
    onSelectSuggestion,
}) => {
    const navigate = useNavigate();
    const isQuerying = searchTerm.trim().length >= 2;

    const handlePopularClick = (to) => {
        onClose?.();
        navigate(to);
    };

    return (
        <div
            className="w-full border-b border-black/[0.08] bg-white transition-all duration-200"
            style={{
                animation: 'searchPanelReveal 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div className="header-shell pb-8 pt-4 md:pb-10 md:pt-5">
                <div className="flex">
                    {/* Left spacer to align content precisely under the search input on desktop */}
                    <div
                        className="hidden shrink-0 md:block md:w-[150px] lg:w-[180px]"
                        aria-hidden="true"
                    />

                    {/* Constrained Search Content container (~590px to 600px width) */}
                    <div className="w-full max-w-[590px]">
                        {!isQuerying ? (
                            <>
                                {/* "Ask me..." Row */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="flex h-[42px] w-full items-center gap-2.5 rounded-lg bg-[#f6effb] px-3.5 text-[#6a2da8] transition-colors duration-150 hover:bg-[#ede0f7] cursor-pointer outline-none select-none focus-visible:ring-2 focus-visible:ring-[#6a2da8]"
                                >
                                    <SmartToyOutlinedIcon className="!text-[20px] text-[#6a2da8]" aria-hidden="true" />
                                    <span className="text-[14.5px] font-semibold tracking-[-0.01em]">
                                        Ask me ...
                                    </span>
                                </div>

                                {/* Popular searches label */}
                                <p
                                    id="header-popular-searches-label"
                                    className="mb-1.5 mt-5 px-3.5 text-[13.5px] font-medium text-[#18181b]"
                                >
                                    Popular searches
                                </p>

                                {/* Popular search items with hover background and diagonal arrow */}
                                <ul
                                    aria-labelledby="header-popular-searches-label"
                                    className="m-0 flex list-none flex-col gap-1 p-0"
                                >
                                    {POPULAR_SEARCHES.map((item) => (
                                        <li key={item.label}>
                                            <button
                                                type="button"
                                                onClick={() => handlePopularClick(item.to)}
                                                className="group flex h-[42px] w-full cursor-pointer items-center justify-between rounded-lg px-3.5 text-left outline-none transition-colors duration-150 hover:bg-[#f2f2f2] focus-visible:bg-[#f2f2f2] focus-visible:ring-1 focus-visible:ring-brand-red"
                                            >
                                                <span className="text-[15.5px] font-semibold text-[#0c0c0c] transition-colors">
                                                    {item.label}
                                                </span>
                                                <span className="flex items-center text-[#0c0c0c] opacity-0 translate-y-0.5 -translate-x-0.5 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
                                                    <svg
                                                        className="h-[18px] w-[18px]"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                    >
                                                        <line x1="7" y1="17" x2="17" y2="7" />
                                                        <polyline points="7 7 17 7 17 17" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            /* Query result suggestions when user types */
                            <div className="flex flex-col">
                                <p className="mb-2 text-[13px] font-medium text-apple-gray">
                                    {isLoading ? 'Searching...' : `Results for "${searchTerm.trim()}"`}
                                </p>

                                {suggestions.length > 0 ? (
                                    <ul className="m-0 flex list-none flex-col p-0">
                                        {suggestions.map((suggestion) => (
                                            <li key={suggestion._id}>
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectSuggestion?.(suggestion)}
                                                    className="group flex h-[44px] w-full cursor-pointer items-center justify-between border-b border-black/[0.04] py-1 text-left outline-none transition-colors duration-150 hover:bg-surface-alt px-2 rounded-lg"
                                                >
                                                    <span className="text-[15px] font-semibold text-apple-text">
                                                        {suggestion.productName}
                                                    </span>
                                                    <span className="text-[13px] font-bold text-apple-gray">
                                                        ${suggestion.price}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    !isLoading && (
                                        <p className="py-4 text-[14px] text-apple-gray">
                                            No matching devices found.
                                        </p>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchMegaPanel;

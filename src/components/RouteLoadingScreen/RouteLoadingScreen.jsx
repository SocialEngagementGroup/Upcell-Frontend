import React from 'react';

const RouteLoadingScreen = ({ compact = false }) => {
    return (
        <div className={compact ? "py-4" : "page-container py-16"}>
            <div className={`flex flex-col items-center justify-center rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)] ${compact ? "min-h-[220px]" : "min-h-[320px]"}`}>
                <img src="/staticImages/upcellLogo.png" alt="UpCell" className="mb-6 h-9 w-auto" />
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-black/5 border-t-[#d90b0f]" />
                    <div className="h-6 w-6 animate-pulse rounded-full bg-[#d90b0f]/10" />
                </div>
                <h2 className="mt-8 text-[24px] font-bold tracking-tight text-apple-text">Loading Upcell</h2>
                <p className="mt-2 text-[15px] text-ink-soft">Preparing your premium experience...</p>
            </div>
        </div>
    );
};

export default RouteLoadingScreen;

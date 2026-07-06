import React from 'react';

// Classic Apple logo silhouette (single path).
const AppleMark = ({ className = '' }) => (
    <svg viewBox="0 0 384 512" className={className} aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.1 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
);

const RouteLoadingScreen = ({ compact = false }) => {
    return (
        <div className={compact ? "py-4" : "page-container py-16"}>
            <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-black/[0.06] bg-[linear-gradient(180deg,#ffffff_0%,#f5f6f8_100%)] p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)] ${compact ? "min-h-[220px]" : "min-h-[340px]"}`}>
                {/* soft brand glow */}
                <div className="pointer-events-none absolute -top-20 h-44 w-44 rounded-full bg-brand-red/10 blur-3xl" />

                {/* Apple mark inside a spinning brand ring */}
                <div className="relative flex h-24 w-24 items-center justify-center">
                    <span
                        className="absolute inset-0 animate-spin rounded-full border-[3px] border-black/[0.06] border-t-brand-red"
                        style={{ animationDuration: '0.9s' }}
                    />
                    <span className="absolute inset-[7px] rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />
                    <AppleMark className="relative h-10 w-10 animate-pulse fill-apple-text" />
                </div>

                {/* brand wordmark */}
                <img src="/staticImages/upcellLogo.png" alt="UpCell" className="mt-7 h-8 w-auto" />

                <h2 className="mt-4 text-[22px] font-bold tracking-tight text-apple-text">Loading UpCell</h2>
                <p className="mt-2 text-[15px] text-ink-soft">Preparing your premium experience…</p>

                {/* brand bouncing dots */}
                <div className="mt-6 flex items-center gap-2">
                    {[0, 150, 300].map((delay) => (
                        <span
                            key={delay}
                            className="h-2 w-2 animate-bounce rounded-full bg-brand-red"
                            style={{ animationDelay: `${delay}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RouteLoadingScreen;

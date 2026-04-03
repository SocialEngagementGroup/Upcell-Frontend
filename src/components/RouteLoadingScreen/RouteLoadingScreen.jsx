import React from 'react';

const RouteLoadingScreen = () => {
    return (
        <div className="page-container py-16">
            <div className="premium-card flex min-h-[320px] flex-col items-center justify-center rounded-[36px] p-10 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-apple-text" />
                <h2 className="mt-6 text-[28px] text-apple-text">Loading page</h2>
                <p className="mt-3 text-sm text-ink-soft">Pulling the next view into place.</p>
            </div>
        </div>
    );
};

export default RouteLoadingScreen;

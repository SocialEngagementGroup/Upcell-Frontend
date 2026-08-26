import React from 'react';

// `compact` is kept: callers use it to switch between the full-page route
// fallback and the smaller in-panel one.
const RouteLoadingScreen = ({ compact = false }) => {
    // TODO(redesign): build the new route loading screen here.
    return (
        <div role="status" data-compact={compact}>
            <span>Loading UpCell…</span>
        </div>
    );
};

export default RouteLoadingScreen;

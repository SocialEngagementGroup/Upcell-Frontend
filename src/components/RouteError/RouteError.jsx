import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

// Fallback shown if a route throws, instead of react-router's default
// "Unexpected Application Error" screen.
const RouteError = () => {
    const error = useRouteError();

    if (import.meta.env.DEV && error) {
        // Surface details in dev only.
        console.error('Route error:', error);
    }

    // TODO(redesign): build the new route error UI here.
    return (
        <div>
            <h1>Something went wrong.</h1>
            <p>We hit an unexpected glitch loading this page. Please try again — your data is safe.</p>
            <button type="button" onClick={() => window.location.reload()}>Reload page</button>
            <Link to="/">Back to home</Link>
        </div>
    );
};

export default RouteError;

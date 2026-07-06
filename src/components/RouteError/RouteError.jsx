import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

// Branded fallback shown if a route ever throws, instead of react-router's
// default "Unexpected Application Error" screen.
const RouteError = () => {
    const error = useRouteError();

    if (import.meta.env.DEV && error) {
        // Surface details in dev only.
        console.error('Route error:', error);
    }

    return (
        <div className="page-shell">
            <section className="page-container py-20">
                <div className="premium-card mx-auto max-w-[560px] rounded-[32px] px-8 py-14 text-center sm:rounded-[40px]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                        <ReportProblemOutlinedIcon className="!text-[32px]" />
                    </div>
                    <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-apple-text">Something went wrong.</h1>
                    <p className="mx-auto mt-3 max-w-[420px] text-base leading-7 text-ink-soft">
                        We hit an unexpected glitch loading this page. Please try again — your data is safe.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <button onClick={() => window.location.reload()} className="premium-button w-full sm:w-auto">
                            Reload page
                        </button>
                        <Link to="/" className="premium-button-secondary w-full sm:w-auto">
                            Back to home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RouteError;

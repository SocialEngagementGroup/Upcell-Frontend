import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

// Branded fallback shown if a route ever throws, instead of react-router's
// default "Unexpected Application Error" screen.
// A page's JavaScript is split into a chunk named by content hash, so a deploy
// renames every one of them. A tab left open across a deploy still holds the
// old names, and the request for a chunk that no longer exists comes back as
// index.html — which the browser refuses to run as a module. The message is
// about a MIME type and says nothing about the real cause, which is simply an
// out-of-date page.
const isStaleChunk = (error) => /dynamically imported module|Importing a module script failed|Failed to fetch dynamically/i
    .test(String(error?.message || error));

// Reloading fetches a fresh index.html with the new names.
//
// Guarded by a timestamp rather than a plain flag: a flag that is never
// cleared means the second deploy of the day stops recovering, and one that
// is cleared on success is cleared by the reload itself. Two failures inside
// the window is a real error and falls through to the page below; a failure
// long after the last reload gets its own attempt.
const RELOAD_KEY = 'upcell:chunk-reload';
const RELOAD_WINDOW_MS = 15000;

// Storage throws outright in some privacy modes, and a crash inside the error
// screen leaves the user with a blank page instead of a bad one.
const recentlyReloaded = () => {
    try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY));
        return Number.isFinite(last) && Date.now() - last < RELOAD_WINDOW_MS;
    } catch {
        return true;
    }
};

const rememberReload = () => {
    try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        return true;
    } catch {
        return false;
    }
};

const RouteError = () => {
    const error = useRouteError();

    if (import.meta.env.DEV && error) {
        // Surface details in dev only.
        console.error('Route error:', error);
    }

    if (isStaleChunk(error) && !recentlyReloaded() && rememberReload()) {
        window.location.reload();
        return null;
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

import { Link } from 'react-router-dom';

import { UTILITY_LINKS, UTILITY_TAGLINE } from './navigationData';

// Row 1. Secondary, low-traffic destinations plus a one-line reassurance.
// Hidden entirely below md — on a phone these belong in the drawer, and 32px
// of chrome is 32px the product grid does not get.
const UtilityBar = () => (
    <div className="hidden border-b border-black/[0.06] bg-apple-bg md:block">
        <div className="mx-auto flex h-8 max-w-site items-center justify-between px-6 lg:px-10">
            <p className="text-[12px] font-medium text-apple-gray">
                {UTILITY_TAGLINE}
            </p>

            <nav aria-label="Utility">
                <ul className="flex items-center gap-1">
                    {UTILITY_LINKS.map((link) => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className="rounded-full px-3 py-1 text-[12px] font-medium text-apple-gray outline-none transition-colors duration-200 ease-smooth hover:text-apple-text focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1 focus-visible:ring-offset-apple-bg"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </div>
);

export default UtilityBar;

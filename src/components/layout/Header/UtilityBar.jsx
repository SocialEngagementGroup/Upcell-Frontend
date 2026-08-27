import { Link } from 'react-router-dom';

import { UTILITY_LINKS } from './navigationData';

// Row 1. Secondary, low-traffic destinations, aligned left. The right side is
// deliberately empty — it is where a locale switcher would sit, and UpCell is
// single-market, so there is nothing to put there.
//
// Hidden entirely below md — on a phone these belong in the drawer, and 32px
// of chrome is 32px the product grid does not get.
const UtilityBar = () => (
    <div className="hidden border-b border-black/[0.06] bg-apple-bg md:block">
        <div className="mx-auto flex h-8 max-w-site items-center px-6 lg:px-10">
            <nav aria-label="Utility">
                {/* The negative inset cancels the first pill's padding so the
                    link text lines up with the logo in the row below, while
                    the pills keep their hover target. */}
                <ul className="-mx-3 flex items-center gap-1">
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

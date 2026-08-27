import { Link } from 'react-router-dom';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import { UTILITY_LINKS } from './navigationData';

// Row 1. Secondary, low-traffic destinations, aligned left. The right side is
// deliberately empty — it is where a locale switcher would sit, and UpCell is
// single-market, so there is nothing to put there.
//
// Hidden entirely below md — on a phone these belong in the drawer, and 32px
// of chrome is 32px the product grid does not get.
const UtilityBar = () => (
    <div className="hidden bg-white pb-3 pt-3 md:block">
        <div className="header-shell flex h-8 items-center">
            <nav aria-label="Utility">
                {/* The negative inset cancels the first pill's padding so the
                    link text lines up with the logo in the row below, while
                    the pills keep their hover target. */}
                <ul className="-mx-3 flex items-center gap-1">
                    {UTILITY_LINKS.map((link) => (
                        <li key={link.label}>
                            <Link
                                to={link.to}
                                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1 focus-visible:ring-offset-white [&_svg]:!text-[16px]"
                            >
                                {link.withShield && <VerifiedUserOutlinedIcon aria-hidden="true" />}
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

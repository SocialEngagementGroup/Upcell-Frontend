import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

import { STATIC_IMAGES, staticImageUrl } from '../../../constants/staticImages';
import { LOGO_METRICS, MAIN_ROW_LINKS, TRADE_IN_LINK } from './navigationData';
import HeaderSearch from './HeaderSearch';
import AccountMenu from './AccountMenu';
import CartButton from './CartButton';

// Row 2. Flex-wraps on purpose: below md the search drops onto its own
// full-width line under the bar (order-last / basis-full), which is the only
// way to give it a usable hit area on a 375px screen without shrinking the
// logo or the cart.
const PrimaryBar = ({ menuButtonRef, onOpenDrawer, isDrawerOpen }) => (
    <div className="bg-white">
        <div className="header-shell flex flex-wrap items-center gap-x-3 pb-3 pt-0 md:flex-nowrap md:gap-x-5 md:pb-0 lg:gap-x-8">
            <button
                ref={menuButtonRef}
                type="button"
                onClick={onOpenDrawer}
                aria-label="Open menu"
                aria-expanded={isDrawerOpen}
                aria-haspopup="dialog"
                className="-ml-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden [&_svg]:!text-[24px]"
            >
                <MenuIcon aria-hidden="true" />
            </button>

            {/* This link is what sets the 56 / 64 / 72px bar height — it is the
                tallest thing on the row at every width. `transition-none`
                because the brand foundation puts `transition-all` on every <a>,
                which would otherwise animate that height across a breakpoint. */}
            <Link
                to="/"
                aria-label="UpCell home"
                className="flex h-14 shrink-0 items-center rounded-lg outline-none transition-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:h-16 lg:h-[72px]"
            >
                {/* The logo PNG carries transparent padding on all four sides.
                    The box below is the artwork's own aspect ratio and clips an
                    oversized, centred copy of the file, so the mark optically
                    fills the space at 56 / 64 / 72px alike. Ratios in
                    navigationData.js — this is the only place they are used. */}
                <span
                    className="relative block h-[26px] overflow-hidden md:h-[28px] lg:h-[32px]"
                    style={{ aspectRatio: String(LOGO_METRICS.aspectRatio) }}
                >
                    <img
                        src={staticImageUrl(STATIC_IMAGES.LOGO, 400)}
                        alt="UpCell"
                        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
                        style={{ width: `${LOGO_METRICS.overscan * 100}%` }}
                    />
                </span>
            </Link>

            <HeaderSearch className="order-last mt-3 basis-full md:order-none md:mt-0 md:max-w-[520px] md:flex-1 md:basis-auto" />

            <nav aria-label="Primary" className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
                <Link
                    to={TRADE_IN_LINK.to}
                    className="hidden h-10 items-center gap-1.5 rounded-full border border-brand-red px-4 text-[14px] font-bold text-brand-red outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red/[0.08] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:inline-flex [&_svg]:!text-[18px]"
                >
                    <AutorenewRoundedIcon aria-hidden="true" />
                    {TRADE_IN_LINK.label}
                </Link>

                {MAIN_ROW_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        to={link.to}
                        className="hidden h-10 items-center rounded-full px-3 text-[14px] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:inline-flex"
                    >
                        {link.label}
                    </Link>
                ))}

                <AccountMenu />
                <CartButton />
            </nav>
        </div>
    </div>
);

export default PrimaryBar;

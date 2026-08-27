import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

import { STATIC_IMAGES, staticImageUrl } from '../../../constants/staticImages';
import { LOGO_METRICS, MAIN_ROW_LINKS, TRADE_IN_LINK } from './navigationData';
import HeaderSearch from './HeaderSearch';
import AccountMenu from './AccountMenu';
import CartButton from './CartButton';

// Row 2, and two different layouts held in one flex container.
//
// Below md it wraps to two lines: hamburger / centred logo / account+cart on
// the first, then Trade-in and the search sharing the second. That second line
// is a real wrapper element with basis-full, so the two stay together and the
// search still gets a usable hit area on a 375px screen.
//
// From md the wrapper becomes `display: contents` and dissolves, putting
// Trade-in and the search back into the bar as direct children. Order classes
// then run logo -> search -> Trade-in -> account+cart, which is the reference's
// desktop arrangement rather than the mobile one.
const PrimaryBar = ({
    menuButtonRef,
    onOpenDrawer,
    isDrawerOpen,
    searchTerm,
    onSearchChange,
    isSearchOpen,
    onOpenSearch,
    onCloseSearch,
    searchInputRef,
}) => (
    <div className="bg-white">
        <div className="header-shell flex flex-wrap items-center gap-x-3 pb-3 pt-0 md:flex-nowrap md:gap-x-3 md:pb-0 lg:gap-x-6">
            <button
                ref={menuButtonRef}
                type="button"
                onClick={onOpenDrawer}
                aria-label="Open menu"
                aria-expanded={isDrawerOpen}
                aria-haspopup="dialog"
                className="order-1 -ml-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden [&_svg]:!text-[24px]"
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
                className="order-2 mx-auto flex h-14 shrink-0 items-center rounded-lg outline-none transition-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:order-1 md:mx-0 md:h-16 lg:h-[72px]"
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

            {/* Below md this wrapper is the second line: Trade-in first, then
                the search filling the rest. `md:contents` dissolves it from md
                up so both become direct children of the bar again and take
                their own order — search before Trade-in, as the reference has
                it on desktop. */}
            <div className="order-4 mt-3 flex w-full basis-full items-center gap-2 md:contents">
                <Link
                    to={TRADE_IN_LINK.to}
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-solid border-brand-red px-4 text-[14px] font-bold text-brand-red outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red/[0.08] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:order-3 [&_svg]:!text-[18px]"
                >
                    <AutorenewRoundedIcon aria-hidden="true" />
                    {TRADE_IN_LINK.label}
                </Link>

                <HeaderSearch
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    isSearchOpen={isSearchOpen}
                    onOpenSearch={onOpenSearch}
                    onCloseSearch={onCloseSearch}
                    inputRef={searchInputRef}
                    className="min-w-0 flex-1 md:order-2 md:min-w-[180px] lg:max-w-[520px]"
                />
            </div>

            <nav aria-label="Primary" className="order-3 flex shrink-0 items-center gap-1 md:order-4 md:ml-auto md:gap-2">
                {MAIN_ROW_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        to={link.to}
                        className="hidden h-10 items-center rounded-full px-2 text-[14px] font-bold text-apple-text underline-offset-4 outline-none transition-colors duration-200 ease-smooth hover:text-brand-red hover:underline focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white md:inline-flex lg:px-3"
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

import { Link } from 'react-router-dom';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { cloudinaryUrl } from '../../../utilities/cloudinary';
import MobileBottomNav from './MobileBottomNav';
import { CATEGORIES, FEATURES, HERO_BANNER, PROMO_CARDS } from './mobileHomeData';

const FEATURE_ICONS = {
    verified: VerifiedOutlinedIcon,
    inspection: FactCheckOutlinedIcon,
    warranty: VerifiedUserOutlinedIcon,
    returns: EventRepeatOutlinedIcon,
};

// The mobile home page.
//
// A separate component rather than a responsive version of the desktop one:
// the two share no section order and no components, so expressing both in one
// tree would mean a pile of breakpoint classes that describe neither clearly.
// Home.jsx picks between them on the md breakpoint.
//
// The header is untouched — the existing one already handles mobile, and the
// bar at the bottom of this page is an addition beneath it, not a replacement.
//
// Bottom padding clears the fixed nav so the last row of tiles is never
// trapped underneath it.
const MobileHome = () => (
    <div className="pb-24">
        {/* ===============================================================
            Hero banner.
            =============================================================== */}
        <section aria-labelledby="m-hero-heading" className="px-4 pt-4">
            <div className="overflow-hidden rounded-2xl bg-apple-text">
                <div className="px-5 pt-6">
                    <p className="text-[0.75rem] font-medium uppercase tracking-wide text-white/60">
                        {HERO_BANNER.eyebrow}
                    </p>

                    {/* The base layer sizes h1 at text-5xl and font-extrabold;
                        both overridden — Roboto has no 800 face, and 48px is
                        far too large for a 375px screen. */}
                    <h1
                        id="m-hero-heading"
                        className="mt-1.5 text-[1.625rem] font-bold leading-[1.15] tracking-[-0.03em] text-white"
                    >
                        {HERO_BANNER.title}
                    </h1>

                    <p className="mt-2 text-[0.875rem] font-normal leading-snug text-white/75">
                        {HERO_BANNER.copy}
                    </p>

                    <Link
                        to={HERO_BANNER.cta.to}
                        className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-brand-red px-6 text-[0.875rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-[#b00a0d] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-apple-text"
                    >
                        {HERO_BANNER.cta.label}
                    </Link>
                </div>

                <img
                    src={cloudinaryUrl(HERO_BANNER.image, { width: 760 })}
                    alt=""
                    width="760"
                    height="420"
                    decoding="async"
                    className="mt-5 block h-[170px] w-full object-contain"
                />
            </div>
        </section>

        {/* ===============================================================
            Two promo cards.
            =============================================================== */}
        <section aria-label="Featured" className="px-4 pt-3">
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
                {PROMO_CARDS.map((card) => (
                    <li key={card.id}>
                        <Link
                            to={card.to}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-solid border-black/[0.06] bg-white outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            <span className="flex items-center justify-center bg-surface-alt py-3">
                                <img
                                    src={cloudinaryUrl(card.image, { width: 320 })}
                                    alt=""
                                    width="320"
                                    height="200"
                                    decoding="async"
                                    className="block h-[70px] w-auto object-contain transition-transform duration-300 ease-smooth group-hover:scale-105"
                                />
                            </span>
                            <span className="px-3 py-2.5">
                                <span className="block text-[0.875rem] font-bold leading-tight text-apple-text">
                                    {card.title}
                                </span>
                                <span className="mt-0.5 block text-[0.75rem] font-normal leading-snug text-apple-gray">
                                    {card.copy}
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>

        {/* ===============================================================
            The four-up promise strip.
            =============================================================== */}
        <section aria-label="What every device comes with" className="px-4 pt-4">
            <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-3.5 rounded-2xl border border-solid border-black/[0.06] bg-white p-4">
                {FEATURES.map((feature) => {
                    const Icon = FEATURE_ICONS[feature.icon];

                    return (
                        <li key={feature.id} className="flex items-center gap-2">
                            <Icon aria-hidden="true" className="shrink-0 !text-[20px] text-brand-red" />
                            <span className="text-[0.75rem] font-medium leading-tight text-ink-soft">
                                {feature.label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>

        {/* ===============================================================
            Shop by category.
            =============================================================== */}
        <section aria-labelledby="m-categories-heading" className="px-4 pt-6">
            <div className="flex items-center justify-between gap-3">
                <h2
                    id="m-categories-heading"
                    className="text-[1.125rem] font-bold leading-tight tracking-[-0.02em] text-apple-text"
                >
                    Shop by category
                </h2>

                <Link
                    to="/shop"
                    className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-solid border-black/[0.12] bg-white pl-3.5 pr-2.5 text-[0.75rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:border-apple-text focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[16px]"
                >
                    See all
                    <ChevronRightRoundedIcon aria-hidden="true" />
                </Link>
            </div>

            <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-3 p-0">
                {CATEGORIES.map((category) => (
                    <li key={category.id}>
                        <Link
                            to={category.to}
                            className="group flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            <span className="flex h-[124px] items-center justify-center overflow-hidden rounded-2xl bg-surface-alt">
                                <img
                                    src={cloudinaryUrl(category.image, { width: 320 })}
                                    alt=""
                                    width="320"
                                    height="320"
                                    decoding="async"
                                    className="block h-[86px] w-auto object-contain transition-transform duration-300 ease-smooth group-hover:scale-105"
                                />
                            </span>
                            <span className="mt-2 text-[0.875rem] font-bold leading-tight text-apple-text group-hover:text-brand-red">
                                {category.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>

        <MobileBottomNav />
    </div>
);

export default MobileHome;

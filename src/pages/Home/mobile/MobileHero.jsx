import { Link } from 'react-router-dom';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';

import { cloudinaryUrl } from '../../../utilities/cloudinary';
import { FEATURES, HERO_BANNER, PROMO_CARDS } from './mobileHomeData';

const FEATURE_ICONS = {
    verified: VerifiedOutlinedIcon,
    inspection: FactCheckOutlinedIcon,
    warranty: VerifiedUserOutlinedIcon,
    returns: EventRepeatOutlinedIcon,
};

// The mobile hero: banner, two promo cards, and the four-up promise strip.
//
// This is the only part of the home page that differs between mobile and
// desktop — it stands in for HeroBanner below the md breakpoint. Everything
// under it (Most wanted, Recommended, Trade-in, Top brands, Reviews) is shared
// by both, so those are not duplicated here.
const MobileHero = () => (
    <>
        {/* ===============================================================
            Hero banner.
            =============================================================== */}
        <section aria-labelledby="m-hero-heading" className="px-4 pt-4">
            <div className="overflow-hidden rounded-2xl bg-apple-text">
                <div className="px-5 pt-6">
                    <p className="text-[0.8125rem] font-medium uppercase tracking-wide text-white/60">
                        {HERO_BANNER.eyebrow}
                    </p>

                    {/* The base layer sizes h1 at text-5xl and font-extrabold;
                        both overridden — Roboto has no 800 face, and 48px is
                        far too large for a 375px screen. */}
                    <h1
                        id="m-hero-heading"
                        className="mt-1.5 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-white"
                    >
                        {HERO_BANNER.title}
                    </h1>

                    <p className="mt-2 text-[0.9375rem] font-normal leading-snug text-white/75">
                        {HERO_BANNER.copy}
                    </p>

                    <Link
                        to={HERO_BANNER.cta.to}
                        className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-brand-red px-6 text-[0.9375rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-[#b00a0d] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-apple-text"
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
                                <span className="block text-[0.9375rem] font-bold leading-tight text-apple-text">
                                    {card.title}
                                </span>
                                <span className="mt-0.5 block text-[0.8125rem] font-normal leading-snug text-apple-gray">
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
                            <span className="text-[0.8125rem] font-medium leading-tight text-ink-soft">
                                {feature.label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    </>
);

export default MobileHero;

import React from "react";
import ScrollToTop from "../../utilities/ScrollToTop";
import useIsMobile from "../../utilities/useIsMobile";
import HeroBanner from "../../components/Hero/HeroBanner";
import MostWanted from "../../components/MostWanted/MostWanted";
import RecommendedSection from "../../components/Recommended/RecommendedSection";
import TradeInBanner from "../../components/TradeInBanner/TradeInBanner";
import TopBrands from "../../components/TopBrands/TopBrands";
import Reviews from "../../components/Reviews/Reviews";
import PromiseSection from "../../components/Promise/PromiseSection";
import MobileHero from "./mobile/MobileHero";
import MobileCategories from "./mobile/MobileCategories";
import MobileBottomNav from "./mobile/MobileBottomNav";

// One home page, with two openings.
//
// Only the top of the page differs between mobile and desktop: the mobile
// design opens with its own banner, promo cards and promise strip, then a
// category grid, where the desktop opens with HeroBanner. Everything from
// "Shop our most wanted" down is shared, and renders at both sizes.
//
// The swap is a matchMedia hook rather than breakpoint classes, so only the
// opening that applies mounts and the other's images are never requested.
//
// The header is untouched — it already handles mobile. The tab bar at the
// bottom is an addition beneath it, mobile only.
const Home = () => {
    const isMobile = useIsMobile();

    return (
        // Bottom padding on mobile clears the fixed tab bar, so the last
        // section is never trapped underneath it.
        <div className={isMobile ? "pb-24" : undefined}>
            <ScrollToTop />

            {isMobile ? (
                <>
                    <MobileHero />
                    <MobileCategories />
                </>
            ) : (
                <HeroBanner />
            )}

            <PromiseSection />
            <MostWanted />
            <RecommendedSection />
            <TradeInBanner />
            <TopBrands />
            <Reviews />

            {isMobile && <MobileBottomNav />}
        </div>
    );
};

export default Home;

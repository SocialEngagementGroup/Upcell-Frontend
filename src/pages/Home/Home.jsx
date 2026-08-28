import React from "react";
import ScrollToTop from "../../utilities/ScrollToTop";
import useIsMobile from "../../utilities/useIsMobile";
import HeroBanner from "../../components/Hero/HeroBanner";
import MostWanted from "../../components/MostWanted/MostWanted";
import RecommendedSection from "../../components/Recommended/RecommendedSection";
import TradeInBanner from "../../components/TradeInBanner/TradeInBanner";
import TopBrands from "../../components/TopBrands/TopBrands";
import Reviews from "../../components/Reviews/Reviews";
import MobileHome from "./mobile/MobileHome";

// Two home pages, picked on the md breakpoint.
//
// They are separate components rather than one responsive tree because they
// share no section order and no components — the mobile design is a banner,
// two promo cards, a four-up strip and a category grid, none of which appear on
// the desktop page. Expressing both in one tree would mean breakpoint classes
// on every block, describing neither layout clearly.
//
// Only one mounts, so the other's images are never requested.
const Home = () => {
    const isMobile = useIsMobile();

    return (
        <div>
            <ScrollToTop />

            {isMobile ? (
                <MobileHome />
            ) : (
                <>
                    <HeroBanner />
                    <MostWanted />
                    <RecommendedSection />
                    <TradeInBanner />
                    <TopBrands />
                    <Reviews />
                </>
            )}
        </div>
    );
};

export default Home;

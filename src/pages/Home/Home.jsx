import React from "react";
import ScrollToTop from "../../utilities/ScrollToTop";
import HeroBanner from "../../components/Hero/HeroBanner";
import MostWanted from "../../components/MostWanted/MostWanted";
import RecommendedSection from "../../components/Recommended/RecommendedSection";
import TradeInBanner from "../../components/TradeInBanner/TradeInBanner";
import TopBrands from "../../components/TopBrands/TopBrands";
import Reviews from "../../components/Reviews/Reviews";

// The previous home page composed six section components (hero, featured units,
// category shelf, trade-in CTA, trust features, journal). All were deleted with
// the old design. Rebuild the new sections under src/components/<Name>/ and
// compose them here.
const Home = () => {
    return (
        <div>
            <ScrollToTop />
            <HeroBanner />
            <MostWanted />
            <RecommendedSection />
            <TradeInBanner />
            <TopBrands />
            <Reviews />
            {/* TODO(redesign): the remaining home sections go here. */}
        </div>
    );
};

export default Home;

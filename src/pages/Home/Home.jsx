import React from "react";
import ModernHero from "./ModernHero";
import CategoryShelf from "../../components/CategoryShelf/CategoryShelf";
import FeaturedUnits from "../../components/FeaturedUnits/FeaturedUnits";
import TradeInAction from "../../components/TradeInAction/TradeInAction";
import HomeTrustFeatures from "../../components/HomeTrustFeatures/HomeTrustFeatures";
import JournalInsights from "../../components/JournalInsights/JournalInsights";
import ScrollToTop from "../../utilities/ScrollToTop";

const Home = () => {
    return (
        <div className="page-shell w-full overflow-x-hidden">
            <ScrollToTop />
            <ModernHero />
            <CategoryShelf />
            <FeaturedUnits />
            <TradeInAction />
            <HomeTrustFeatures />
            <JournalInsights />
        </div>
    );
};

export default Home;

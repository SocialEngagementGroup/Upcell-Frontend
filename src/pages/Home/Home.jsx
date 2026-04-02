import React from "react";
import ModernHero from "./ModernHero";
import CategoryShelf from "../../components/CategoryShelf/CategoryShelf";
import FeaturedUnits from "../../components/FeaturedUnits/FeaturedUnits";
import TradeInAction from "../../components/TradeInAction/TradeInAction";
import HomeTrustFeatures from "../../components/HomeTrustFeatures/HomeTrustFeatures";
import FlashDealBanner from "../../components/FlashDealBanner/FlashDealBanner";
import NewsletterSignup from "../../components/NewsletterSignup/NewsletterSignup";
import ScrollToTop from "../../utilities/ScrollToTop";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-page">
            <ScrollToTop />
            <ModernHero />
            <CategoryShelf />
            <FeaturedUnits />
            <TradeInAction />
            <HomeTrustFeatures />
            <FlashDealBanner />
            <NewsletterSignup />
        </div>
    );
};

export default Home;

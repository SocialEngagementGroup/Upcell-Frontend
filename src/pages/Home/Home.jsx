import React from "react";
import ModernHero from "./ModernHero";
import CategoryShelf from "../../components/CategoryShelf/CategoryShelf";
import TradeInAction from "../../components/TradeInAction/TradeInAction";
import HomeTrustFeatures from "../../components/HomeTrustFeatures/HomeTrustFeatures";
import JournalInsights from "../../components/JournalInsights/JournalInsights";
import ScrollToTop from "../../utilities/ScrollToTop";
import { usePrefetchShopProducts } from "../../queries/products";

const Home = () => {
    // Shop is the next page most visitors open. Fetching its catalogue while
    // they read the home page means it is already in cache when they click.
    usePrefetchShopProducts();

    return (
        <div className="page-shell w-full overflow-x-hidden">
            <ScrollToTop />
            <ModernHero />
            <CategoryShelf />
            <TradeInAction />
            <HomeTrustFeatures />
            <JournalInsights />
        </div>
    );
};

export default Home;

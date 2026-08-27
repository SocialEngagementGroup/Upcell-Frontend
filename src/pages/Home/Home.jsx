import React from "react";
import ScrollToTop from "../../utilities/ScrollToTop";
import HeroCarousel from "../../components/Hero/HeroCarousel";

// The previous home page composed six section components (hero, featured units,
// category shelf, trade-in CTA, trust features, journal). All were deleted with
// the old design. Rebuild the new sections under src/components/<Name>/ and
// compose them here.
const Home = () => {
    return (
        <div>
            <ScrollToTop />
            <HeroCarousel />
            {/* TODO(redesign): the remaining home sections go here. */}
        </div>
    );
};

export default Home;

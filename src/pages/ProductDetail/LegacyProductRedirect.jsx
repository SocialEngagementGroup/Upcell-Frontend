import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useProductQuery } from '../../queries/products';
import RouteLoadingScreen from '../../components/RouteLoadingScreen/RouteLoadingScreen';

// Keeps the old /iphone/:parentId/:productId URLs working.
//
// Those ids are in shared links, bookmarks and anything a search engine
// indexed before the catalogue moved to readable slugs. The route itself was
// also misnamed — every iPad and MacBook was served from /iphone/ too — which
// is part of why it was worth changing.
//
// Looks the product up by id, then replaces the URL with its slug. `replace`
// so the old address does not sit in history for Back to land on.
const LegacyProductRedirect = () => {
    const { productId } = useParams();
    const { data: product, isLoading, isError } = useProductQuery(productId);

    if (isLoading) {
        return (
            <div className="page-shell">
                <RouteLoadingScreen />
            </div>
        );
    }

    // No product, or one saved before slugs existed. /product/ with no slug
    // renders the same "not found" page a bad slug does, which is the honest
    // answer either way.
    if (isError || !product?.slug) {
        return <Navigate to="/shop" replace />;
    }

    return <Navigate to={`/product/${product.slug}`} replace />;
};

export default LegacyProductRedirect;

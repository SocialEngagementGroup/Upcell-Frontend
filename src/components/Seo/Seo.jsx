import React from 'react';
import { Helmet } from 'react-helmet-async';

// Every page had the same title and the same description — whatever index.html
// carried. A search result for an iPhone 15 Pro and a search result for the
// returns policy were indistinguishable, and a link shared to a group chat
// unfurled as the site's name and nothing else.
//
// This is a single-page app with no server rendering, so a crawler that does
// not run JavaScript still sees index.html. Google does run it; most social
// scrapers do not. The og: tags below therefore matter most on the pages
// somebody actually pastes into a message — a product, a trade-in quote — and
// the pre-rendering that would fix the rest is a separate piece of work.

const SITE_NAME = 'UpCell';
const BASE_URL = 'https://www.upcellit.com';

/**
 * @param {object} props
 * @param {string} props.title        without the site name — it is appended
 * @param {string} props.description  one sentence, under about 160 characters
 * @param {string} [props.path]       for the canonical, e.g. "/shop"
 * @param {string} [props.image]      absolute URL for the social card
 * @param {boolean} [props.noIndex]   for pages that must not be indexed
 * @param {object} [props.jsonLd]     structured data, already shaped
 */
const Seo = ({ title, description, path, image, noIndex, jsonLd }) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonical = path ? `${BASE_URL}${path}` : undefined;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            {description ? <meta name="description" content={description} /> : null}
            {canonical ? <link rel="canonical" href={canonical} /> : null}

            {/* A tokenised order page, an offer page and anything behind a
                login must never be indexed. Their URLs carry a secret. */}
            {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:type" content={jsonLd?.['@type'] === 'Product' ? 'product' : 'website'} />
            <meta property="og:title" content={fullTitle} />
            {description ? <meta property="og:description" content={description} /> : null}
            {canonical ? <meta property="og:url" content={canonical} /> : null}
            {image ? <meta property="og:image" content={image} /> : null}

            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={fullTitle} />
            {description ? <meta name="twitter:description" content={description} /> : null}
            {image ? <meta name="twitter:image" content={image} /> : null}

            {jsonLd ? (
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            ) : null}
        </Helmet>
    );
};

/**
 * Structured data for one device.
 *
 * itemCondition is the whole point of emitting this. Google shows a "Used"
 * badge on a result that declares UsedCondition, and UpCell sells nothing
 * else — a listing that does not say so competes against new stock on price
 * alone and loses.
 */
export const productJsonLd = ({ product, url, image }) => {
    if (!product) return undefined;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.productName,
        description: product.description || undefined,
        image: image || undefined,
        sku: product.slug || undefined,
        brand: { '@type': 'Brand', name: 'Apple' },
        offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'USD',
            price: String(product.price ?? ''),
            // Every unit is its own record, so availability is a fact about
            // this one device rather than a stock level.
            availability: product.outOfStock
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition',
        },
    };
};

export default Seo;

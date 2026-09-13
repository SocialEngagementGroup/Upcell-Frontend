#!/usr/bin/env node
// Writes public/sitemap.xml from the live catalogue.
//
// Runs as part of `npm run build`. It must never fail the build: a sitemap is
// worth having and is not worth a failed deploy, and the API is not reachable
// from CI at all. When it cannot reach the catalogue it writes the static
// pages on their own and says so, rather than leaving a stale file or none.
//
// Every URL here is public by definition. The tokenised order and offer pages
// are deliberately absent, and robots.txt disallows them as well — a sitemap
// entry for a URL that carries a secret is a working key in a search result.

import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.SITE_URL || 'https://www.upcellit.com';
const API_URL = (process.env.VITE_API_URL || '').replace(/\/+$/, '');
const OUT = path.join(process.cwd(), 'public', 'sitemap.xml');

// The pages that exist whether or not the catalogue answers. changefreq and
// priority are hints Google has said for years that it ignores, so they are
// left out rather than written as decoration.
const STATIC_PAGES = [
    '/', '/shop', '/trade-in', '/wholesale', '/about', '/blogs', '/support',
    '/return-policy', '/privacy-policy', '/terms-conditions', '/delivery-policy',
    '/payment-info', '/promotions',
];

const escapeXml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const urlEntry = (loc, lastmod) => [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : null,
    '  </url>',
].filter(Boolean).join('\n');

async function productPaths() {
    if (!API_URL) {
        console.log('[sitemap] VITE_API_URL is not set — static pages only.');
        return [];
    }

    try {
        // A short timeout on purpose. A slow or sleeping API must not add a
        // minute to every build.
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/all-products-single-variation`, { signal: controller.signal });
        clearTimeout(timer);

        if (!response.ok) throw new Error(`API answered ${response.status}`);

        const products = await response.json();

        return (Array.isArray(products) ? products : [])
            .filter((product) => product?.slug)
            .map((product) => ({ loc: `${BASE_URL}/product/${product.slug}`, lastmod: product.updatedAt }));
    } catch (error) {
        // Said out loud. A sitemap that quietly lost every product looks
        // identical to one that never had any.
        console.log(`[sitemap] could not reach the catalogue (${error.message}) — static pages only.`);
        return [];
    }
}

const products = await productPaths();

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_PAGES.map((page) => urlEntry(`${BASE_URL}${page}`)),
    ...products.map((product) => urlEntry(product.loc, product.lastmod)),
    '</urlset>',
].join('\n');

fs.writeFileSync(OUT, `${xml}\n`);
console.log(`[sitemap] wrote ${STATIC_PAGES.length} static pages and ${products.length} products to public/sitemap.xml`);

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import axiosInstance from '../../utilities/axiosInstance';
import { CartContext } from '../../App';
import { useAccessoriesQuery } from '../../queries/products';
import { resolveProductImage } from '../../utilities/productImages';
import { resolveImageRef } from '../../utilities/cloudinary';
import { STATIC_IMAGES, staticImageUrl } from '../../constants/staticImages';

// A module-level constant, not a literal in the destructure: a fresh [] on
// every render is a new reference and re-runs everything downstream of it.
const EMPTY_ACCESSORIES = [];

// Both accessories still point at /product-images/accessories/*.png — files
// that were never uploaded to Cloudinary and no longer exist in public/. Any
// dead URL lands here rather than showing the browser's broken-image icon,
// and it keeps working for whatever the catalogue holds next.
const showPlaceholder = (event) => {
    if (event.currentTarget.dataset.fallback) return;
    event.currentTarget.dataset.fallback = 'true';
    event.currentTarget.src = staticImageUrl(STATIC_IMAGES.NOT_AVAILABLE, 200);
};

const money = (cents) => "$" + (Number(cents || 0) / 100).toFixed(2);

// items[] is the canonical shape and the only one chunk 7 keeps. An order
// placed before that migration ran carries only the legacy line_items, so
// those are mapped across rather than rendering an empty receipt at the one
// moment a customer is looking for reassurance.
const itemsToRender = (order) => {
    if (order?.items?.length) return order.items;

    return (order?.line_items || [])
        .filter((line) => line?.price_data?.product_data?.metadata?.productId)
        .map((line) => {
            const product = line.price_data.product_data;
            return {
                productId: product.metadata.productId,
                name: product.name,
                description: product.description,
                image: product.images?.[0],
                quantity: product.metadata.quantity,
                lineTotalCents: Math.round((product.metadata.totalPaid || 0) * 100),
            };
        });
};

// The four numbers the bank was actually sent. A legacy order without them
// falls back to reading its own lines by name - still the order's own
// figures, never a fresh tax calculation.
const storedTotals = (order) => {
    if (!order) return { subtotalCents: 0, shippingCents: 0, taxCents: 0, totalCents: 0 };

    if (order.totalCents != null) {
        return {
            subtotalCents: order.subtotalCents || 0,
            shippingCents: order.shippingCents || 0,
            taxCents: order.taxCents || 0,
            totalCents: order.totalCents,
        };
    }

    const lines = order.line_items || [];
    const sumOf = (predicate) => lines
        .filter(predicate)
        .reduce((sum, line) => sum + (line?.price_data?.product_data?.metadata?.totalPaid || 0), 0);

    const isProduct = (line) => Boolean(line?.price_data?.product_data?.metadata?.productId);
    const named = (pattern) => (line) => !isProduct(line)
        && pattern.test(line?.price_data?.product_data?.name || "");

    const subtotal = sumOf(isProduct);
    const tax = sumOf(named(/tax/i));
    const shipping = sumOf(named(/shipping/i));

    return {
        subtotalCents: Math.round(subtotal * 100),
        shippingCents: Math.round(shipping * 100),
        taxCents: Math.round(tax * 100),
        totalCents: Math.round((subtotal + tax + shipping) * 100),
    };
};

const ThankYou = () => {
    const orderId = new URLSearchParams(window.location.search).get('order_id');
    const [order, setOrder] = useState(null);
    const [unavailable, setUnavailable] = useState(false);
    const { setCart } = useContext(CartContext);
    // The real accessories, from the same query the product page uses. This
    // block used to be two hardcoded entries — an AirPods Pro at $249 and a
    // MagSafe charger at $39 — with images from via.placeholder.com. Neither
    // was a UpCell listing, the prices were invented, and the placeholder
    // service is not in the site's CSP, so both pictures were blocked and the
    // section rendered as two broken images under a heading.
    const { data: accessories = EMPTY_ACCESSORIES } = useAccessoriesQuery();

    useEffect(() => {
        if (!orderId) return;
        // Reaching this page with an order id means checkout actually
        // completed (Stripe's success_url, or a redirect here after PayPal/
        // manual order creation) — this is the one place all three payment
        // paths agree the cart should be emptied.
        setCart([]);
        axiosInstance.get(`order/${orderId}`)
            .then((res) => setOrder(res.data))
            // A guest gets a 404 here, and that is correct: this page has no
            // token, and the token cannot be handed over in the bank's
            // redirect because it is minted when the receipt is sent — a
            // different request that runs whenever the bank gets round to it.
            // So the page shows the confirmation it already knows and points
            // at the email, rather than treating an expected 404 as a fault.
            .catch(() => setUnavailable(true));
    }, [orderId]);
    // Every figure here is read from the order, never recomputed.
    //
    // This block used to find "the first line without a productId" and call it
    // shipping. Checkout writes the tax line before the shipping line, so that
    // found the tax - and then added another 8% on top as an estimate. A
    // $1,099 phone with express shipping was charged $1,211.92 and the receipt
    // said $1,274.84, with shipping missing and the tax shown twice under two
    // names. A confirmation page that disagrees with the card statement is the
    // first thing a customer disputes.
    const orderItems = itemsToRender(order);
    const totals = storedTotals(order);

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 text-center sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <CheckCircleIcon className="!text-[72px] text-apple-text" />
                    <h1 className="mt-6 text-[clamp(2.2rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">Order confirmed.</h1>
                    <p className="mx-auto mt-4 max-w-[620px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        Thank you for choosing UpCell. Your order is being prepared now and will move to shipping shortly.
                    </p>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="premium-card rounded-[30px] p-6">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Order ID</div>
                        <div className="mt-3 break-all text-base font-extrabold text-apple-text sm:text-xl">{order?._id || 'Unavailable'}</div>
                    </div>
                    <div className="premium-card rounded-[30px] p-6">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Order date</div>
                        <div className="mt-3 text-xl font-extrabold text-apple-text">{order ? new Date(order.createdAt).toLocaleDateString() : 'Unavailable'}</div>
                    </div>
                    <div className="premium-card rounded-[30px] p-6">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Delivery</div>
                        <div className="mt-3 flex items-center gap-2 text-xl font-extrabold text-apple-text">
                            <LocalShippingOutlinedIcon />
                            {order ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'Pending'}
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <main className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 md:p-10">
                        <h2>Order summary</h2>
                        <div className="mt-6 space-y-4">
                            {orderItems.map((item, index) => (
                                <div key={item.productId || index} className="flex gap-4 rounded-[24px] bg-surface-alt p-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white">
                                        <img
                                            src={resolveImageRef(item.image, { width: 120 })}
                                            onError={showPlaceholder}
                                            alt={item.name}
                                            className="max-h-[80%] w-auto object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-apple-text">{item.name}</div>
                                        <div className="mt-1 text-sm text-ink-soft">{item.description}</div>
                                        <div className="mt-1 text-sm text-apple-gray">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-bold text-apple-text">{money(item.lineTotalCents)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-4 border-t border-black/[0.06] pt-6 text-sm text-ink-soft">
                            <div className="flex justify-between"><span>Subtotal</span><strong className="text-apple-text">{money(totals.subtotalCents)}</strong></div>
                            {/* "Sales tax", not "Estimated tax" - this one was charged, not guessed. */}
                            <div className="flex justify-between"><span>Sales tax</span><strong className="text-apple-text">{money(totals.taxCents)}</strong></div>
                            <div className="flex justify-between"><span>Shipping</span><strong className="text-apple-text">{totals.shippingCents === 0 ? 'Free' : money(totals.shippingCents)}</strong></div>
                            <div className="flex justify-between border-t border-black/[0.06] pt-4 text-base"><span className="font-bold text-apple-text">Total charged</span><strong className="text-2xl text-apple-text">{money(totals.totalCents)}</strong></div>
                        </div>

                        {/* A guest has no account page. The receipt email is
                            their way back to this order, so say so here rather
                            than let them find out by looking for it. */}
                        {unavailable ? (
                            <p className="mt-6 rounded-[20px] bg-surface-alt p-4 text-sm leading-6 text-ink-soft">
                                We have emailed your receipt with a link to this order — that link is how
                                you get back to it. Lost it?{' '}
                                <Link to="/track-order" className="font-bold text-apple-text underline underline-offset-2">
                                    We will send a new one
                                </Link>.
                            </p>
                        ) : null}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                            <Link to="/shop" className="premium-button w-full sm:w-auto">Continue shopping</Link>
                            <Link to="/support" className="premium-button-secondary w-full sm:w-auto">Contact support</Link>
                        </div>
                    </main>

                    <aside className="space-y-6">
                        <div className="premium-card rounded-[32px] p-6">
                            <h3 className="text-[28px]">Delivery note</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">Tracking will be available once the shipment is created. Priority orders move first when selected.</p>
                        </div>
                        <div className={`premium-card rounded-[32px] p-6 ${accessories.length ? '' : 'hidden'}`}>
                            <h3 className="text-[28px]">Complete the setup</h3>
                            <div className="mt-5 space-y-4">
                                {accessories.map((item) => (
                                    <Link
                                        key={item._id}
                                        to={`/product/${item.slug}`}
                                        className="block rounded-[24px] bg-surface-alt p-4 transition-colors hover:bg-black/[0.04]"
                                    >
                                        <div className="flex h-24 items-center justify-center rounded-[18px] bg-white">
                                            <img
                                                src={resolveProductImage(item, { width: 200 }) || staticImageUrl(STATIC_IMAGES.NOT_AVAILABLE, 200)}
                                                onError={showPlaceholder}
                                                alt={item.productName}
                                                loading="lazy"
                                                className="max-h-[75%] w-auto object-contain"
                                            />
                                        </div>
                                        <div className="mt-4 font-bold text-apple-text">{item.productName}</div>
                                        <div className="mt-1 text-sm text-ink-soft">{item.description}</div>
                                        <div className="mt-3 text-lg font-extrabold text-apple-text">${Number(item.price).toFixed(2)}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default ThankYou;

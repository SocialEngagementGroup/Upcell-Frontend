import React from 'react';
import Seo from '../../components/Seo/Seo';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useGuestOrderQuery } from '../../queries/orders';
import { resolveImageRef } from '../../utilities/cloudinary';
import RouteLoadingScreen from '../../components/RouteLoadingScreen/RouteLoadingScreen';

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;
const day = (value) => (value ? new Date(value).toLocaleDateString() : null);

// A guest's own order, opened from the link in their receipt.
//
// No sign-in. The token in the link is the authorisation and it grants exactly
// this one order — the same arrangement the returns emails use. Somebody who
// bought a phone without making an account still has to be able to see what
// they bought and where it is.
const GuestOrder = () => {
    const { id } = useParams();
    const [params] = useSearchParams();
    const token = params.get('t');

    const { data: order, isLoading, isError } = useGuestOrderQuery(id, token);

    if (isLoading) return <RouteLoadingScreen />;

    if (isError || !order) {
        // 404 covers a wrong token, an expired one and an unknown id, on
        // purpose — the API will not say which, so neither can this page.
        return (
            <div className="page-shell">
            <Seo title="Your order" noIndex />
                <section className="page-container py-20">
                    <div className="premium-card mx-auto max-w-[560px] rounded-[32px] px-8 py-14 text-center">
                        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-apple-text">
                            This link no longer works.
                        </h1>
                        <p className="mx-auto mt-3 max-w-[420px] text-base leading-7 text-ink-soft">
                            Links expire after 90 days, and asking for a new one replaces the old one.
                            Get a fresh link sent to the email address on the order.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                            <Link to="/track-order" className="premium-button w-full sm:w-auto">Email me a new link</Link>
                            <Link to="/support" className="premium-button-secondary w-full sm:w-auto">Contact support</Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <Seo title="Your order" noIndex />
            <section className="page-container py-12">
                <div className="mx-auto max-w-[760px]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-red">Your order</p>
                    <h1 className="mt-2 break-all font-mono text-xl font-extrabold text-apple-text sm:text-2xl">{order._id}</h1>
                    <p className="mt-1 text-sm text-ink-soft">
                        Placed {day(order.createdAt)} · {order.status}
                    </p>

                    {order.fulfilment?.trackingNumber ? (
                        <div className="mt-6 rounded-[28px] border border-black/[0.08] bg-white p-5">
                            <h2 className="flex items-center gap-2 text-[20px] font-extrabold text-apple-text">
                                <LocalShippingOutlinedIcon /> On its way
                            </h2>
                            <p className="mt-2 text-sm text-ink-soft">
                                {order.fulfilment.carrier} · <span className="font-mono">{order.fulfilment.trackingNumber}</span>
                                {order.shippedAt ? ` · shipped ${day(order.shippedAt)}` : ''}
                            </p>
                            {order.fulfilment.trackingUrl ? (
                                <a
                                    href={order.fulfilment.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="premium-button mt-4 inline-block px-5 py-2.5 text-sm"
                                >
                                    Track this parcel
                                </a>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="premium-card mt-6 rounded-[28px] p-6 sm:p-8">
                        <h2 className="text-[24px]">What you bought</h2>
                        <div className="mt-5 space-y-4">
                            {(order.items || []).map((item, index) => (
                                <div key={item.productId || index} className="flex gap-4 rounded-[24px] bg-surface-alt p-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white">
                                        <img src={resolveImageRef(item.image, { width: 120 })} alt={item.name} className="max-h-[80%] w-auto object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-apple-text">{item.name}</div>
                                        <div className="mt-1 text-sm text-ink-soft">{item.description}</div>
                                        {/* Their device's own identity, on the record of the order
                                            that bought it — what they need for the carrier or an
                                            insurance claim. */}
                                        {item.imei ? (
                                            <div className="mt-1 font-mono text-xs text-apple-gray">IMEI {item.imei}</div>
                                        ) : null}
                                    </div>
                                    <div className="font-bold text-apple-text">{money(item.lineTotalCents)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-3 border-t border-black/[0.06] pt-6 text-sm text-ink-soft">
                            <div className="flex justify-between"><span>Subtotal</span><strong className="text-apple-text">{money(order.subtotalCents)}</strong></div>
                            <div className="flex justify-between"><span>Sales tax</span><strong className="text-apple-text">{money(order.taxCents)}</strong></div>
                            <div className="flex justify-between"><span>Shipping</span><strong className="text-apple-text">{order.shippingCents === 0 ? 'Free' : money(order.shippingCents)}</strong></div>
                            <div className="flex justify-between border-t border-black/[0.06] pt-4 text-base">
                                <span className="font-bold text-apple-text">Total charged</span>
                                <strong className="text-2xl text-apple-text">{money(order.totalCents)}</strong>
                            </div>
                        </div>

                        {order.cardLast4 ? (
                            <p className="mt-4 text-xs text-apple-gray">
                                Paid with {order.cardBrand} ending {order.cardLast4}
                            </p>
                        ) : null}
                    </div>

                    <p className="mt-6 text-sm text-ink-soft">
                        Keep this link — it is how you get back to this order.{' '}
                        <Link to="/track-order" className="font-bold text-apple-text underline underline-offset-2">
                            Lost it?
                        </Link>{' '}
                        Or sign up with {order.email} and we will attach this order to your account.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default GuestOrder;

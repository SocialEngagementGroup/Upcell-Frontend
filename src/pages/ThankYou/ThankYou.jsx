import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import axiosInstance from '../../utilities/axiosInstance';

const accessories = [
    { name: 'AirPods Pro (2nd Gen)', desc: 'Noise cancellation and effortless pairing.', price: 249.0, image: 'https://via.placeholder.com/200x200?text=AirPods' },
    { name: 'MagSafe Charger', desc: 'Clean, fast, dependable charging.', price: 39.0, image: 'https://via.placeholder.com/200x200?text=Charger' },
];

const ThankYou = () => {
    const orderId = new URLSearchParams(window.location.search).get('order_id');
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!orderId) return;
        axiosInstance.get(`order/${orderId}`)
            .then((res) => setOrder(res.data))
            .catch((error) => console.log(error));
    }, [orderId]);
    const orderItems = order?.line_items?.filter((item) => item?.price_data?.product_data?.metadata?.productId) || [];
    const subtotal = orderItems.reduce((total, item) => total + (item?.price_data?.product_data?.metadata?.totalPaid || 0), 0);
    const shippingItem = order?.line_items?.find((item) => !item?.price_data?.product_data?.metadata?.productId);
    const shippingTotal = shippingItem?.price_data?.product_data?.metadata?.totalPaid || 0;
    const taxEstimate = subtotal * 0.08;
    const grandTotal = subtotal + shippingTotal + taxEstimate;

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 text-center md:px-12 md:py-14">
                    <CheckCircleIcon className="!text-[72px] text-apple-text" />
                    <h1 className="mt-6 text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">Order confirmed.</h1>
                    <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-ink-soft">
                        Thank you for choosing UpCell. Your order is being prepared now and will move to shipping shortly.
                    </p>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="premium-card rounded-[30px] p-6">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Order ID</div>
                        <div className="mt-3 text-xl font-extrabold text-apple-text">{order?._id || 'Unavailable'}</div>
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
                    <main className="premium-card rounded-[36px] p-8 md:p-10">
                        <h2>Order summary</h2>
                        <div className="mt-6 space-y-4">
                            {orderItems.map((item, index) => {
                                const product = item.price_data.product_data;
                                return (
                                    <div key={index} className="flex gap-4 rounded-[24px] bg-surface-alt p-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white">
                                            <img src={product.images?.[0]} alt={product.name} className="max-h-[80%] w-auto object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-apple-text">{product.name}</div>
                                            <div className="mt-1 text-sm text-ink-soft">{product.description}</div>
                                            <div className="mt-1 text-sm text-apple-gray">Qty: {product.metadata?.quantity}</div>
                                        </div>
                                        <div className="font-bold text-apple-text">${(product.metadata?.totalPaid || 0).toFixed(2)}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 space-y-4 border-t border-black/[0.06] pt-6 text-sm text-ink-soft">
                            <div className="flex justify-between"><span>Subtotal</span><strong className="text-apple-text">${subtotal.toFixed(2)}</strong></div>
                            <div className="flex justify-between"><span>Estimated tax</span><strong className="text-apple-text">${taxEstimate.toFixed(2)}</strong></div>
                            <div className="flex justify-between"><span>Shipping</span><strong className="text-apple-text">{shippingTotal === 0 ? 'Free' : `$${shippingTotal.toFixed(2)}`}</strong></div>
                            <div className="flex justify-between border-t border-black/[0.06] pt-4 text-base"><span className="font-bold text-apple-text">Total</span><strong className="text-2xl text-apple-text">${grandTotal.toFixed(2)}</strong></div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/shop" className="premium-button">Continue shopping</Link>
                            <Link to="/contactus" className="premium-button-secondary">Contact support</Link>
                        </div>
                    </main>

                    <aside className="space-y-6">
                        <div className="premium-card rounded-[32px] p-6">
                            <h3 className="text-[28px]">Delivery note</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">Tracking will be available once the shipment is created. Priority orders move first when selected.</p>
                        </div>
                        <div className="premium-card rounded-[32px] p-6">
                            <h3 className="text-[28px]">Complete the setup</h3>
                            <div className="mt-5 space-y-4">
                                {accessories.map((item) => (
                                    <div key={item.name} className="rounded-[24px] bg-surface-alt p-4">
                                        <div className="flex h-24 items-center justify-center rounded-[18px] bg-white">
                                            <img src={item.image} alt={item.name} className="max-h-[75%] w-auto object-contain" />
                                        </div>
                                        <div className="mt-4 font-bold text-apple-text">{item.name}</div>
                                        <div className="mt-1 text-sm text-ink-soft">{item.desc}</div>
                                        <div className="mt-3 text-lg font-extrabold text-apple-text">${item.price.toFixed(2)}</div>
                                    </div>
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

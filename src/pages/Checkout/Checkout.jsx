import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import axiosInstance from '../../utilities/axiosInstance';
import visa from '../../assets/visa.svg';
import mastercard from '../../assets/master.svg';
import americanExpress from '../../assets/americanExpress.svg';
import discover from '../../assets/discover.svg';
import paypal from '../../assets/paypal.svg';
import applePay from '../../assets/applePay.svg';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Checkout = () => {
    const params = useParams();
    const { cart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [shipping, setShipping] = useState('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe');

    const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    const productIds = (params.id === 'cart' ? cart : [params.id]).filter(isObjectId);

    useEffect(() => {
        if (productIds.length > 0) {
            axiosInstance.post('cart', { ids: [...new Set(productIds)] })
                .then((res) => setProducts(res.data))
                .catch((error) => console.log(error));
        }
    }, [params.id, cart]);

    const subtotal = useMemo(() => (
        productIds.reduce((acc, id) => acc + (products.find((product) => product._id === id)?.price || 0), 0)
    ), [productIds, products]);

    const estTax = subtotal * 0.08;
    const shippingCosts = {
        standard: 0,
        priority: 10.5,
        express: 25.0
    };
    const shippingCost = shippingCosts[shipping] || 0;
    const total = subtotal + estTax + shippingCost;

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const data = {
            name: event.target.name.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            city: event.target.city.value,
            postal: event.target.postalCode.value,
            street: event.target.street.value,
            country: event.target.country.value,
            orders: productIds,
        };

        try {
            axiosInstance.post('orders', {
                ...data,
                orders: data.orders,
                shipping,
                paymentMethod,
                paidWith: paymentMethod === 'paypal' ? 'Paypal' : 'Card',
            }).then((res) => {
                if (params.id === 'cart') {
                    localStorage.setItem('cart', JSON.stringify([]));
                }
                window.location = `/succeed?order_id=${res.data._id}`;
            }).catch((error) => {
                console.log(error);
                setIsLoading(false);
                alert('Something went wrong. Please check your information and try again.');
            });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            alert('Something went wrong. Please check your information and try again.');
        }
    };

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <Link to="/cart" className="kicker-link inline-flex items-center gap-2">
                    <ArrowBackIosNewIcon className="!text-sm" />
                    Return to cart
                </Link>

                <div className="mt-6 premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Checkout</span>
                    </nav>
                    <h1 className="text-[clamp(2.6rem,4.8vw,4.9rem)] leading-[0.94]">Secure your order with a calmer checkout.</h1>
                    <p className="mt-5 max-w-[620px] text-lg leading-8 text-ink-soft">
                        Your details, delivery choices, and payment methods are arranged to feel simple, quiet, and premium.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    <main className="premium-card rounded-[36px] p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <section>
                                <h3 className="text-[28px]">Contact information</h3>
                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <input className="premium-input" type="email" name="email" placeholder="Email address" required />
                                    <input className="premium-input" type="tel" name="phone" placeholder="Phone number" required />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[28px]">Shipping address</h3>
                                <div className="mt-5 grid gap-4">
                                    <input className="premium-input" type="text" name="name" placeholder="Full name" required />
                                    <input className="premium-input" type="text" name="street" placeholder="Street address" required />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <input className="premium-input" type="text" name="city" placeholder="City" required />
                                        <input className="premium-input" type="text" name="postalCode" placeholder="Postal code" required />
                                    </div>
                                    <input className="premium-input" type="text" name="country" placeholder="Country" required />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[28px]">Delivery</h3>
                                <div className="mt-5 grid gap-4">
                                    {[
                                        { id: 'standard', title: 'Standard Shipping', sub: '5-7 business days', price: 'Free' },
                                        { id: 'priority', title: 'Priority Shipping', sub: '2-3 business days', price: '$10.50' },
                                        { id: 'express', title: 'Express Shipping', sub: '1-2 business days', price: '$25.00' },
                                    ].map((option) => (
                                        <label key={option.id} className={`flex cursor-pointer items-center justify-between rounded-[24px] border p-5 ${shipping === option.id ? 'border-apple-text bg-surface-alt' : 'border-black/[0.08] bg-white'}`}>
                                            <div>
                                                <div className="font-bold text-apple-text">{option.title}</div>
                                                <div className="mt-1 text-sm text-ink-soft">{option.sub}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="font-bold text-apple-text">{option.price}</div>
                                                <input type="radio" checked={shipping === option.id} onChange={() => setShipping(option.id)} />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[28px]">Payment</h3>
                                <div className="mt-5 grid gap-4">
                                    {[
                                        { id: 'stripe', title: 'Card / Apple Pay / Google Pay', sub: 'Secure checkout via Stripe' },
                                        { id: 'paypal', title: 'PayPal', sub: 'Pay using your PayPal account' },
                                    ].map((option) => (
                                        <label key={option.id} className={`flex cursor-pointer items-center justify-between rounded-[24px] border p-5 ${paymentMethod === option.id ? 'border-apple-text bg-surface-alt' : 'border-black/[0.08] bg-white'}`}>
                                            <div>
                                                <div className="font-bold text-apple-text">{option.title}</div>
                                                <div className="mt-1 text-sm text-ink-soft">{option.sub}</div>
                                            </div>
                                            <input type="radio" checked={paymentMethod === option.id} onChange={() => setPaymentMethod(option.id)} />
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <div className="flex flex-col gap-4 border-t border-black/[0.06] pt-6 md:flex-row md:items-center md:justify-between">
                                <p className="flex items-center gap-2 text-sm text-ink-soft">
                                    <LockOutlinedIcon className="!text-[18px]" />
                                    Encrypted checkout and secure order processing.
                                </p>
                                <button type="submit" className="premium-button min-w-[220px]" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Complete Purchase'}
                                </button>
                            </div>
                        </form>
                    </main>

                    <aside className="premium-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl">Order summary</h2>
                            <span className="text-sm text-apple-gray">{productIds.length} items</span>
                        </div>

                        <div className="mt-6 space-y-4">
                            {productIds.map((id, index) => {
                                const product = products.find((item) => item._id === id);
                                if (!product) return null;
                                return (
                                    <div key={`${id}-${index}`} className="flex gap-4 rounded-[24px] bg-surface-alt p-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white">
                                            <img src={product.image} alt={product.productName} className="max-h-[80%] w-auto object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-apple-text">{product.productName}</div>
                                            <div className="mt-1 text-sm text-ink-soft">{product.color?.name}, {product.storage}</div>
                                        </div>
                                        <div className="font-bold text-apple-text">${product.price}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 space-y-4 border-t border-black/[0.06] pt-6 text-sm text-ink-soft">
                            <div className="flex justify-between"><span>Subtotal</span><strong className="text-apple-text">${subtotal.toFixed(2)}</strong></div>
                            <div className="flex justify-between"><span>Estimated tax</span><strong className="text-apple-text">${estTax.toFixed(2)}</strong></div>
                            <div className="flex justify-between"><span>Shipping</span><strong className="text-apple-text">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</strong></div>
                            <div className="flex justify-between border-t border-black/[0.06] pt-4 text-base"><span className="font-bold text-apple-text">Total</span><strong className="text-2xl text-apple-text">${total.toFixed(2)}</strong></div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {[visa, mastercard, americanExpress, discover, paypal, applePay].map((icon, index) => (
                                <div key={index} className="flex h-12 items-center justify-center rounded-[16px] border border-black/[0.06] bg-white">
                                    <img src={icon} alt="Payment method" className="max-h-7 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default Checkout;

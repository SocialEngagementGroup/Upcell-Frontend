import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../../App";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utilities/ScrollToTop";
import CartProduct from "./CartProduct";
import axiosInstance from "../../utilities/axiosInstance";

const Cart = () => {
    const [products, setProducts] = useState([]);
    const { cart, setCart } = useContext(CartContext);

    useEffect(() => {
        if (!cart?.length) {
            setProducts([]);
            return;
        }

        axiosInstance.post('cart', { ids: [...new Set(cart)] })
            .then((res) => setProducts(res.data))
            .catch((error) => console.log(error));
    }, [cart]);

    const total = useMemo(() => (
        cart.reduce((sum, id) => sum + (products.find((item) => item._id === id)?.price || 0), 0)
    ), [cart, products]);

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <span className="eyebrow mb-5">Bag</span>
                    <h1 className="text-[clamp(2.6rem,4.6vw,4.8rem)] leading-[0.94]">Your premium Apple lineup.</h1>
                    <p className="mt-5 max-w-[640px] text-lg leading-8 text-ink-soft">
                        Review your selection, adjust quantities, and continue into a cleaner checkout flow.
                    </p>
                    <Link to="/shop" className="kicker-link mt-6 inline-flex">Continue shopping</Link>
                </div>
            </section>

            <section className="page-container pb-16">
                {cart?.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-5">
                            {products.map((product) => (
                                <CartProduct key={product._id} product={product} cart={cart} setCart={setCart} />
                            ))}
                        </div>

                        <aside className="premium-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28">
                            <h2 className="text-2xl">Order summary</h2>
                            <div className="mt-6 space-y-4 text-sm text-ink-soft">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-apple-text">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold text-apple-text">Free</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Estimated tax</span>
                                    <span className="font-bold text-apple-text">${(total * 0.08).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-black/[0.06] pt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-bold text-apple-text">Estimated total</span>
                                    <span className="text-2xl font-extrabold text-apple-text">${(total * 1.08).toFixed(2)}</span>
                                </div>
                            </div>
                            <Link to="/checkout/cart" className="premium-button mt-8 w-full">
                                Proceed to checkout
                            </Link>
                        </aside>
                    </div>
                ) : (
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>Your bag is empty.</h2>
                        <p className="mt-4 text-lg text-ink-soft">Start with a curated iPhone, iPad, or MacBook from the store.</p>
                        <Link to="/shop" className="premium-button mt-6">Explore the store</Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Cart;

import { useContext, useEffect, useMemo } from "react";
import { CartContext } from "../../App";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utilities/ScrollToTop";
import CartProduct from "./CartProduct";
import { useProductsQuery } from "../../queries/products";
import { EMPTY_ARRAY } from "../../queries/keys";
import RouteLoadingScreen from "../../components/RouteLoadingScreen/RouteLoadingScreen";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Cart = () => {
    const { cart, setCart } = useContext(CartContext);
    const { data: allProducts = EMPTY_ARRAY, isLoading: productsLoading } = useProductsQuery();
    const isLoading = Boolean(cart?.length) && productsLoading;

    const products = useMemo(() => {
        const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
        const uniqueIds = new Set([...new Set(cart)].filter(isObjectId));
        return allProducts.filter((product) => uniqueIds.has(product._id));
    }, [allProducts, cart]);

    useEffect(() => {
        if (!cart?.length || productsLoading) return;
        const validIds = new Set(products.map((product) => product._id));
        const hasStaleIds = cart.some((id) => !validIds.has(id));
        if (hasStaleIds) {
            setCart((current) => current.filter((id) => validIds.has(id)));
        }
    }, [cart, products, productsLoading, setCart]);

    const total = useMemo(() => (
        cart.reduce((sum, id) => sum + (products.find((item) => item._id === id)?.price || 0), 0)
    ), [cart, products]);

    const hasDisplayableProducts = products.length > 0;

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Cart</span>
                    </nav>
                    <h1 className="text-[clamp(2.1rem,4.6vw,4.8rem)] leading-[0.96] sm:leading-[0.94]">Your Cart of Certified Premium Apple Devices</h1>
                    <p className="mt-4 max-w-[640px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        Review your selected premium iPhones, iPads, or MacBooks, confirm quantities, and proceed to secure checkout.
                    </p>

                </div>
            </section>

            <section className="page-container pb-16">
                {isLoading ? (
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>Loading your cart.</h2>
                        <p className="mt-4 text-lg text-ink-soft">We are pulling in the latest product details for your saved items.</p>
                    </div>
                ) : hasDisplayableProducts ? (
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
                        <h2>Your cart is empty.</h2>
                        <p className="mt-4 text-lg text-ink-soft">Browse certified premium iPhones, iPads, and MacBooks. Every device is inspected, graded, and backed by a 12-month warranty.</p>
                        <Link to="/shop" className="premium-button mt-6">Explore the shop</Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Cart;

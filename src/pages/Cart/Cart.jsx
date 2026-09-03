import { useContext, useEffect, useMemo } from "react";
import { CartContext } from "../../App";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utilities/ScrollToTop";
import CartProduct from "./CartProduct";
import { useProductsQuery } from "../../queries/products";
import { EMPTY_ARRAY } from "../../queries/keys";
import RouteLoadingScreen from "../../components/RouteLoadingScreen/RouteLoadingScreen";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { groupCartItems } from "../../utilities/cartGrouping";

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

    // A device can sell while it sits in someone's cart — these are single
    // units, so the second buyer can never be fulfilled. The server refuses
    // that checkout, but a refusal at the payment step tells the customer
    // nothing useful, so surface it here where they can act on it.
    const soldOutItems = useMemo(
        () => products.filter((product) => product.outOfStock),
        [products]
    );
    const hasSoldOutItems = soldOutItems.length > 0;

    // Sold items are excluded from the total. Showing a price that includes
    // something they cannot buy makes the summary wrong.
    const total = useMemo(() => (
        cart.reduce((sum, id) => {
            const product = products.find((item) => item._id === id);
            if (!product || product.outOfStock) return sum;
            return sum + (product.price || 0);
        }, 0)
    ), [cart, products]);

    // One entry per device, carrying the accessories bought to go with it.
    const groups = useMemo(() => groupCartItems(cart, products), [cart, products]);

    const removeSoldOutItems = () => {
        const soldIds = new Set(soldOutItems.map((product) => product._id));
        setCart((current) => current.filter((id) => !soldIds.has(id)));
    };

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
                            {hasSoldOutItems ? (
                                <div className="rounded-[28px] border-2 border-brand-red/40 bg-brand-red/[0.04] p-5 sm:p-6">
                                    <h2 className="text-xl text-apple-text">
                                        {soldOutItems.length === 1
                                            ? 'One item in your cart has sold'
                                            : `${soldOutItems.length} items in your cart have sold`}
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                                        Every device we sell is a single unit, so once one is bought it is gone.
                                        Remove {soldOutItems.length === 1 ? 'it' : 'them'} to continue to checkout.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={removeSoldOutItems}
                                        className="premium-button mt-5"
                                    >
                                        {soldOutItems.length === 1 ? 'Remove sold item' : 'Remove sold items'}
                                    </button>
                                </div>
                            ) : null}

                            {groups.map((group) => (
                                <CartProduct key={group.key} group={group} setCart={setCart} />
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
                            {hasSoldOutItems ? (
                                <>
                                    <button
                                        type="button"
                                        disabled
                                        className="premium-button mt-8 w-full cursor-not-allowed opacity-40"
                                    >
                                        Proceed to checkout
                                    </button>
                                    <p className="mt-3 text-center text-xs font-bold text-brand-red">
                                        Remove the sold {soldOutItems.length === 1 ? 'item' : 'items'} above to continue
                                    </p>
                                </>
                            ) : (
                                <Link to="/checkout/cart" className="premium-button mt-8 w-full">
                                    Proceed to checkout
                                </Link>
                            )}
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

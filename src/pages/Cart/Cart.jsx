import { useContext, useEffect, useMemo } from "react";
import { CartContext } from "../../App";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utilities/ScrollToTop";
import CartProduct from "./CartProduct";
import { useProductsQuery } from "../../queries/products";
import { EMPTY_ARRAY } from "../../queries/keys";
import RouteLoadingScreen from "../../components/RouteLoadingScreen/RouteLoadingScreen";

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

    // TODO(redesign): build the new cart page UI here.
    return (
        <div>
            <ScrollToTop />

            <nav>
                <Link to="/">Home</Link>
                <span>Cart</span>
            </nav>
            <h1>Your Cart of Certified Premium Apple Devices</h1>

            {isLoading ? (
                <RouteLoadingScreen compact />
            ) : hasDisplayableProducts ? (
                <>
                    <div>
                        {products.map((product) => (
                            <CartProduct key={product._id} product={product} cart={cart} setCart={setCart} />
                        ))}
                    </div>

                    <aside>
                        <h2>Order summary</h2>
                        <div>Subtotal: ${total.toFixed(2)}</div>
                        <div>Shipping: Free</div>
                        <div>Estimated tax: ${(total * 0.08).toFixed(2)}</div>
                        <div>Estimated total: ${(total * 1.08).toFixed(2)} USD</div>
                        <Link to="/checkout/cart">Proceed to checkout</Link>
                    </aside>
                </>
            ) : (
                <div>
                    <h2>Your cart is empty.</h2>
                    <p>
                        Browse certified premium iPhones, iPads, and MacBooks. Every device is
                        inspected, graded, and backed by a 12-month warranty.
                    </p>
                    <Link to="/shop">Explore the shop</Link>
                </div>
            )}
        </div>
    );
};

export default Cart;

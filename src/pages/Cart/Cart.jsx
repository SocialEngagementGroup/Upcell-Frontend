import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../App";
import "./Cart.css"
import { Link } from "react-router-dom";
import ScrollToTop from "../../utilities/ScrollToTop";
import axiosInstance from "../../utilities/axiosInstance";
import CartProduct from "./CartProduct";

const Cart = () => {
    const [products, setProducts] = useState([])
    const { cart, setCart } = useContext(CartContext)

    useEffect(() => {
        if (cart && cart.length) {
            axiosInstance.post("cart", { ids: cart })
                .then(res => setProducts(res.data))
                .catch(err => console.log(err))
        } else {
            setProducts([])
        }
    }, [cart])

    let total = 0
    for(const id of cart){
        total += products.find(item => item._id === id)?.price || 0 
    }

    return (
        <div className="cart-page">
            <ScrollToTop />
            
            <header className="cart-hero">
                <div className="container-max">
                    <h1>My Cart <span>({cart?.length})</span></h1>
                    <Link to="/preowned" className="btn-continue-shopping">
                        ← Continue shopping
                    </Link>
                </div>
            </header>

            <main className="container-max">
                {cart?.length > 0 ? (
                    <div className="cart-grid">
                        <div className="cart-items-section">
                            {products.length > 0 && products.map((product) => (
                                <CartProduct 
                                    key={product._id} 
                                    product={product} 
                                    cart={cart} 
                                    setCart={setCart} 
                                />
                            ))}
                        </div>

                        <aside className="cart-summary-sidebar">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>$ {total}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>$ 0</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>$ {total}</span>
                            </div>
                            
                            <Link 
                                to="/checkout/cart"
                                className="btn-checkout"
                            >
                                Proceed To Checkout
                            </Link>
                        </aside>
                    </div>
                ) : (
                    <div className="empty-cart-view">
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/preowned" className="btn-shop-now">
                            Shop Latest Phones
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
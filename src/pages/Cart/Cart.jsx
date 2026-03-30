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
        <main className="cart">
            <ScrollToTop></ScrollToTop>

            <div className="cart-title">
                <h3>My Cart ({cart?.length})</h3>
                <Link to="/preowned">Continue shopping</Link>
            </div>

            <div className="cartItems">
                <div className="cartHeader">
                    <p>PRODUCT</p>
                    <p>QUANTITY</p>
                    <p>UNIT PRICE</p>
                    <p>SUBTOTAL</p>
                </div>

                {products.length ? products.map((product, ind) =>
                    <CartProduct key={product._id} product={product} cart={cart} setCart={setCart}></CartProduct>) : ""}
            </div>

            <div className="total-section">
                <p>Total</p>
                <p></p>
                <p></p>
                <p>$ {total}</p>
            </div>

            <div className="ckeckout">
                <Link to={cart?.length ? "/checkout/cart": ""}> PROCEED TO CHECKOUT</Link>
            </div>
        </main>
    );
};

export default Cart;
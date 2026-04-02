import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../App";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utilities/ScrollToTop";
import axiosInstance from "../../utilities/axiosInstance";
import CartProduct from "./CartProduct";

const Cart = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { cart, setCart } = useContext(CartContext)

    useEffect(() => {
        if (cart && cart.length) {
            setIsLoading(true)
            axiosInstance.post("cart", { ids: cart })
                .then(res => { setProducts(res.data); setIsLoading(false); })
                .catch(err => { console.log(err); setIsLoading(false); })
        } else { setProducts([]); }
    }, [cart])

    let total = 0
    for(const id of cart){ total += products.find(item => item._id === id)?.price || 0 }

    return (
        <div className="bg-white min-h-screen pb-24">
            <ScrollToTop />
            
            <header className="bg-surface-alt px-5 py-24 text-center rounded-b-6xl mb-[60px]">
                <div className="max-w-site mx-auto px-[100px] lg:px-10">
                    <h1 className="text-5xl font-black mb-4">My Cart <span>({cart?.length})</span></h1>
                    <Link to="/shop" className="inline-flex items-center gap-2 text-brand-red font-bold text-sm mt-5 transition-all duration-300 ease-smooth hover:-translate-x-1">
                        ← Continue shopping
                    </Link>
                </div>
            </header>

            <main className="max-w-site mx-auto px-[100px] lg:px-10">
                {cart?.length > 0 ? (
                    <div className="grid grid-cols-[1fr_380px] gap-[60px] items-start max-lg:grid-cols-1">
                        <div className="flex flex-col gap-6">
                            {products.length > 0 && products.map((product) => (
                                <CartProduct key={product._id} product={product} cart={cart} setCart={setCart} />
                            ))}
                        </div>

                        <aside className="sticky top-[110px] bg-white p-10 rounded-[20px] border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.04)] max-lg:static max-lg:mt-10">
                            <h2 className="text-2xl font-extrabold mb-8">Order Summary</h2>
                            <div className="flex justify-between mb-5 text-[15px] text-apple-gray"><span>Subtotal</span><span>$ {total}</span></div>
                            <div className="flex justify-between mb-5 text-[15px] text-apple-gray"><span>Shipping</span><span>Free</span></div>
                            <div className="flex justify-between mb-5 text-[15px] text-apple-gray"><span>Tax</span><span>$ 0</span></div>
                            <div className="flex justify-between border-t border-border-light pt-6 mt-6 text-xl font-extrabold text-apple-text"><span>Total</span><span>$ {total}</span></div>
                            
                            <Link to="/checkout/cart" className="block w-full bg-brand-red !text-white py-[18px] rounded-full text-center font-bold text-base mt-8 transition-all duration-300 ease-smooth hover:bg-brand-red-hover hover:-translate-y-0.5">
                                Proceed To Checkout
                            </Link>
                        </aside>
                    </div>
                ) : (
                    <div className="text-center py-[120px]">
                        <h2 className="text-[32px] font-extrabold mb-4">Your cart is empty</h2>
                        <p className="text-apple-gray text-lg mb-10">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/shop" className="inline-block px-12 py-4 bg-brand-red !text-white rounded-full font-bold transition-all duration-300 ease-smooth hover:-translate-y-0.5">
                            Shop Latest Phones
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
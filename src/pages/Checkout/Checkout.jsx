import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../../App';
import axiosInstance from '../../utilities/axiosInstance';
import CheckoutSingleProduct from './CheckoutSingleProduct';
import "./Checkout.css"
import ScrollToTop from '../../utilities/ScrollToTop';

const Checkout = () => {
    const params = useParams()
    const { cart } = useContext(CartContext)
    const [products, setProducts] = useState([])
    const [shipping, setShipping] = useState("first-class")
    const [totla, setTotal] = useState(0)

    useEffect(() => {
        if (params.id == "cart") {
            axiosInstance.post("cart", { ids: cart })
                .then(res => setProducts(res.data))
                .catch(err => console.log(err))
        } else {
            axiosInstance.post("cart", { ids: params.id })
                .then(res => setProducts(res.data))
                .catch(err => console.log(err))
        }


    }, [])

    let total = 0
    for (const id of cart) {
        total += products.find(item => item._id === id)?.price || 0
    }

    let totalWithShipping = total

    if(shipping === "first-class"){
        totalWithShipping = total + 0
    }else if(shipping === "priority"){
        totalWithShipping = total + 10.50
    }else if (shipping === "express"){
        totalWithShipping = total + 30.00
    }

    const handlePayment = (e) =>{
        e.preventDefault()
        const data ={name: e.target.name.value,
                    email: e.target.email.value,
                    phone: e.target.phone.value,
                    city: e.target.city.value,
                    postal: e.target.postalCode.value,
                    street: e.target.street.value,
                    country: e.target.country.value,
                    orders: params.id === "cart" ? cart : [params.id],
                    shipping: shipping,
                    }

        axiosInstance.post("checkout-customer", data)
        .then(res => {
            window.location = res.data
            console.log(res.data)
        })
        .catch(error => console.log(error))
    }

    return (
        <main className='checkout'>
            <ScrollToTop></ScrollToTop>
            <div className='order-info'>
                <h4>YOUR ORDER</h4>

                <div className='order-products'>
                    <p className='sub-header'><span>Product</span> <span>Subtotal</span></p>

                    {products.map(product => <CheckoutSingleProduct key={product._id} product={product} cart={cart}>
                    </CheckoutSingleProduct>)}

                    <p className='p-info'><span>Subtotal</span><span>$ {total}</span></p>

                    <div className='shipping'>
                        <p>Shipping</p>
                        <div>
                            <div>
                                <input onChange={()=>setShipping("first-class")} type="radio" name='shipping' id='first-class' value="first-class" />
                                <label  htmlFor='first-class'>First Class | 5-7 business days</label>
                            </div>

                            <div>
                                <input onChange={()=>setShipping("priority")} type="radio" name='shipping' id='priority' value="priority" />
                                <label htmlFor='priority'> Priority | 2-3 business days: $10.50 </label>
                            </div>

                            <div>
                                <input onChange={()=>setShipping("express")} type="radio" name='shipping' id='express' value="express" />
                                <label htmlFor='express'>Express | 1-2 business days: $30.00</label>
                            </div>
                        </div>

                    </div>

                    <p className='all-total'><span>Total</span> <span>{totalWithShipping}</span></p>
                </div>
            </div>

            <div className='customer-info'>
                <h4>YOUR INFORMATION</h4>
                <form onSubmit={handlePayment}>
                    <input type="text" name="name" id="" placeholder='Name' required/>
                    <input type="text" name="email" id="" placeholder='Email' required/>
                    <input type="text" name="phone" id="" placeholder='Phone Number' required/>
                    <input type="text" className='inline' name="city" id="" placeholder='City' required/>
                    <input type="text" className='inline' name="postalCode" id="" placeholder='Postal Code' required/>
                    <input type="text" name="street" id="" placeholder='Street Address' required/>
                    <input type="text" name="country" id="" placeholder='Country' required/>
                    <button type="submit">Continue to Payment</button>
                </form>
            </div>
        </main>
    );
};

export default Checkout;
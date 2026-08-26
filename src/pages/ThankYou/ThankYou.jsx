import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import axiosInstance from '../../utilities/axiosInstance';
import { CartContext } from '../../App';

// Upsell copy kept as content. The previous `image` field on each entry pointed
// at via.placeholder.com, which no longer resolves, so it was dropped rather
// than carried into the redesign as a broken image.
const accessories = [
    { name: 'AirPods Pro (2nd Gen)', desc: 'Noise cancellation and effortless pairing.', price: 249.0 },
    { name: 'MagSafe Charger', desc: 'Clean, fast, dependable charging.', price: 39.0 },
];

const ThankYou = () => {
    const orderId = new URLSearchParams(window.location.search).get('order_id');
    const [order, setOrder] = useState(null);
    const { setCart } = useContext(CartContext);

    useEffect(() => {
        if (!orderId) return;
        // Reaching this page with an order id means checkout actually
        // completed (Stripe's success_url, or a redirect here after PayPal/
        // manual order creation) — this is the one place all three payment
        // paths agree the cart should be emptied.
        setCart([]);
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

    // TODO(redesign): build the new order confirmation UI here.
    return (
        <div>
            <ScrollToTop />

            <h1>Order confirmed.</h1>
            <p>
                Thank you for choosing UpCell. Your order is being prepared now and will move to
                shipping shortly.
            </p>

            <dl>
                <dt>Order ID</dt>
                <dd>{order?._id || 'Unavailable'}</dd>

                <dt>Order date</dt>
                <dd>{order ? new Date(order.createdAt).toLocaleDateString() : 'Unavailable'}</dd>

                <dt>Delivery</dt>
                <dd>{order ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'Pending'}</dd>
            </dl>

            <h2>Order summary</h2>
            {orderItems.map((item, index) => {
                const product = item.price_data.product_data;
                return (
                    <div key={index}>
                        <img src={product.images?.[0]} alt={product.name} />
                        <div>{product.name}</div>
                        <div>{product.description}</div>
                        <div>Qty: {product.metadata?.quantity}</div>
                        <div>${(product.metadata?.totalPaid || 0).toFixed(2)}</div>
                    </div>
                );
            })}

            <div>
                <div>Subtotal: ${subtotal.toFixed(2)}</div>
                <div>Estimated tax: ${taxEstimate.toFixed(2)}</div>
                <div>Shipping: {shippingTotal === 0 ? 'Free' : `$${shippingTotal.toFixed(2)}`}</div>
                <div>Total: ${grandTotal.toFixed(2)}</div>
            </div>

            <Link to="/shop">Continue shopping</Link>
            <Link to="/support">Contact support</Link>

            <aside>
                <h3>Delivery note</h3>
                <p>
                    Tracking will be available once the shipment is created. Priority orders move
                    first when selected.
                </p>

                <h3>Complete the setup</h3>
                {accessories.map((item) => (
                    <div key={item.name}>
                        <div>{item.name}</div>
                        <div>{item.desc}</div>
                        <div>${item.price.toFixed(2)}</div>
                    </div>
                ))}
            </aside>
        </div>
    );
};

export default ThankYou;

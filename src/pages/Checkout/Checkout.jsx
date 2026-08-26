import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import axiosInstance from '../../utilities/axiosInstance';
import visa from '../../assets/visa.svg';
import mastercard from '../../assets/master.svg';
import americanExpress from '../../assets/americanExpress.svg';
import { toast } from 'react-toastify';
import { extractApiError, validateEmailAddress, validatePhoneNumber, validateRequiredText } from '../../utilities/formValidation';
import useFormAnalytics from '../../utilities/useFormAnalytics';

const CARD_NETWORKS = [
    { src: visa, label: 'Visa accepted' },
    { src: mastercard, label: 'Mastercard accepted' },
    { src: americanExpress, label: 'American Express accepted' },
];

const SHIPPING_OPTIONS = [
    { value: 'standard', label: 'Standard', cost: 0 },
    { value: 'priority', label: 'Priority', cost: 10.5 },
    { value: 'express', label: 'Express', cost: 25.0 },
];

const Checkout = () => {
    const params = useParams();
    const { cart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [shipping, setShipping] = useState('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('manual');
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics('checkout');

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
        if (isLoading) return;

        if (!productIds.length) {
            toast.error('Your cart is empty.');
            trackFailure('Your cart is empty.', { phase: 'validation' });
            return;
        }

        const form = event.target;
        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            city: form.city.value,
            postal: form.postalCode.value,
            street: form.street.value,
            country: form.country.value,
            orders: productIds,
        };

        const validationMessage =
            validateRequiredText('Full name', data.name, { min: 2, max: 120 }) ||
            validateEmailAddress(data.email) ||
            validatePhoneNumber(data.phone) ||
            validateRequiredText('Street address', data.street, { min: 5, max: 200 }) ||
            validateRequiredText('City', data.city, { min: 2, max: 120 }) ||
            validateRequiredText('Postal code', data.postal, { min: 3, max: 20 }) ||
            validateRequiredText('Country', data.country, { min: 2, max: 120 });

        if (validationMessage) {
            toast.error(validationMessage);
            trackFailure(validationMessage, { phase: 'validation' });
            return;
        }

        setIsLoading(true);
        markInteraction();

        const clearCartIfNeeded = () => {
            if (params.id === 'cart') {
                localStorage.setItem('cart', JSON.stringify([]));
            }
        };

        const handleFailure = (error) => {
            console.log(error);
            setIsLoading(false);
            const failureMessage = extractApiError(error, 'Something went wrong. Please check your information and try again.');
            toast.error(failureMessage);
            trackFailure(failureMessage, { phase: 'request', shipping, paymentMethod, itemCount: productIds.length });
        };

        try {
            axiosInstance.post('orders', {
                ...data,
                orders: data.orders,
                shipping,
                paymentMethod,
                paidWith: 'Manual',
            }).then((res) => {
                trackSuccess({ phase: 'request', shipping, paymentMethod, itemCount: productIds.length });
                clearCartIfNeeded();
                window.location = `/succeed?order_id=${res.data._id}`;
            }).catch(handleFailure);
        } catch (error) {
            handleFailure(error);
        }
    };

    // TODO(redesign): build the new checkout UI here. Field names below are
    // load-bearing — handleSubmit reads them off the form by name.
    return (
        <div>
            <ScrollToTop />

            <Link to="/cart">Return to cart</Link>

            <nav>
                <Link to="/">Home</Link>
                <span>Checkout</span>
            </nav>
            <h1>Complete your order.</h1>
            <p>Submit your details and our team will contact you to complete secure payment.</p>

            <form onSubmit={handleSubmit} onChangeCapture={markInteraction}>
                <fieldset>
                    <legend>Contact information</legend>
                    <input type="email" name="email" placeholder="Email address" required />
                    <input type="tel" name="phone" placeholder="Phone number" required />
                </fieldset>

                <fieldset>
                    <legend>Shipping address</legend>
                    <input type="text" name="name" placeholder="Full name" required />
                    <input type="text" name="street" placeholder="Street address" required />
                    <input type="text" name="city" placeholder="City" required />
                    <input type="text" name="postalCode" placeholder="Postal code" required />
                    <input type="text" name="country" placeholder="Country" required />
                </fieldset>

                <fieldset>
                    <legend>Shipping method</legend>
                    {SHIPPING_OPTIONS.map((option) => (
                        <label key={option.value}>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value={option.value}
                                checked={shipping === option.value}
                                onChange={() => setShipping(option.value)}
                            />
                            {option.label} &mdash; {option.cost === 0 ? 'Free' : `$${option.cost.toFixed(2)}`}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Payment method</legend>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="manual"
                            checked={paymentMethod === 'manual'}
                            onChange={() => setPaymentMethod('manual')}
                        />
                        Manual &mdash; our team contacts you to complete payment
                    </label>
                    <div>
                        {CARD_NETWORKS.map((card) => (
                            <img key={card.label} src={card.src} alt={card.label} />
                        ))}
                    </div>
                </fieldset>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Place order'}
                </button>
            </form>

            <aside>
                <h2>Order summary</h2>
                <div>Subtotal: ${subtotal.toFixed(2)}</div>
                <div>Estimated tax: ${estTax.toFixed(2)}</div>
                <div>Shipping: ${shippingCost.toFixed(2)}</div>
                <div>Total: ${total.toFixed(2)} USD</div>
            </aside>
        </div>
    );
};

export default Checkout;

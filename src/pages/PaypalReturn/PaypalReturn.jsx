import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import axiosInstance from '../../utilities/axiosInstance';
import { extractApiError } from '../../utilities/formValidation';

const PaypalReturn = () => {
    const [status, setStatus] = useState('capturing');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const orderID = new URLSearchParams(window.location.search).get('token');

        if (!orderID) {
            setStatus('error');
            setErrorMessage('Missing PayPal order reference.');
            return;
        }

        axiosInstance.post('checkout-customer/capture', { orderID })
            .then((res) => {
                if (res.data?.orderId) {
                    localStorage.setItem('cart', JSON.stringify([]));
                    window.location = `/succeed?order_id=${res.data.orderId}`;
                } else {
                    setStatus('error');
                    setErrorMessage('PayPal did not confirm this payment. Please try again or contact support.');
                }
            })
            .catch((error) => {
                setStatus('error');
                setErrorMessage(extractApiError(error, 'We could not confirm your PayPal payment.'));
            });
    }, []);

    // TODO(redesign): build the new PayPal return UI here.
    return (
        <div>
            <ScrollToTop />
            {status === 'capturing' ? (
                <>
                    <h1>Confirming your PayPal payment.</h1>
                    <p>Please wait, this only takes a moment.</p>
                </>
            ) : (
                <>
                    <h1>We could not confirm this payment.</h1>
                    <p>{errorMessage}</p>
                    <Link to="/cart">Return to cart</Link>
                </>
            )}
        </div>
    );
};

export default PaypalReturn;

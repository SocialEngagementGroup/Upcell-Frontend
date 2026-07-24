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

    return (
        <div className="page-shell">
            <ScrollToTop />
            <section className="page-container pb-16 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-16 text-center sm:rounded-[40px]">
                    {status === 'capturing' ? (
                        <>
                            <h1 className="text-[clamp(1.8rem,4vw,3rem)]">Confirming your PayPal payment.</h1>
                            <p className="mt-4 text-lg text-ink-soft">Please wait, this only takes a moment.</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-[clamp(1.8rem,4vw,3rem)]">We couldn't confirm this payment.</h1>
                            <p className="mt-4 text-lg text-ink-soft">{errorMessage}</p>
                            <Link to="/cart" className="premium-button mt-6 inline-flex">Return to cart</Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PaypalReturn;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { useRequestOrderLinkMutation } from '../../queries/orders';
import { extractApiError } from '../../utilities/formValidation';

// Getting back to an order after deleting the receipt.
//
// The server answers the same way whether or not anything matched, so this
// page does too. A "no such order" here would let anyone test whether an
// address ever bought something, and an order id plus an email is a pair
// somebody might be guessing at.
const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [asked, setAsked] = useState(false);

    const request = useRequestOrderLinkMutation();

    const submit = (event) => {
        event.preventDefault();
        setError('');

        request.mutate(
            { orderId: orderId.trim(), email: email.trim() },
            {
                onSuccess: () => setAsked(true),
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    if (asked) {
        return (
            <div className="page-shell">
                <section className="page-container py-20">
                    <div className="premium-card mx-auto max-w-[560px] rounded-[32px] px-8 py-14 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-text/[0.06] text-apple-text">
                            <MarkEmailReadOutlinedIcon className="!text-[32px]" />
                        </div>
                        <h1 className="mt-6 text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold text-apple-text">Check your email.</h1>
                        <p className="mx-auto mt-3 max-w-[420px] text-base leading-7 text-ink-soft">
                            If that matches an order, we have sent a link to the address on it.
                            Any link we sent before this one has stopped working.
                        </p>
                        <Link to="/shop" className="premium-button mt-8 inline-block">Continue shopping</Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="page-container py-16">
                <form onSubmit={submit} className="premium-card mx-auto max-w-[560px] rounded-[32px] px-6 py-12 sm:px-10">
                    <h1 className="text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold text-apple-text">Find your order</h1>
                    <p className="mt-3 text-base leading-7 text-ink-soft">
                        Enter the order ID from your confirmation email and the address you used.
                        We will send you a fresh link.
                    </p>

                    <label className="mt-8 block text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">Order ID</label>
                    <input
                        type="text"
                        value={orderId}
                        onChange={(event) => setOrderId(event.target.value)}
                        placeholder="From your confirmation email"
                        className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white p-3 font-mono text-sm outline-none focus:border-apple-text/25"
                    />

                    <label className="mt-5 block text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="The one you used at checkout"
                        className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white p-3 text-sm outline-none focus:border-apple-text/25"
                    />
                    <p className="mt-2 text-xs text-ink-soft">
                        The link only ever goes to the address already on the order.
                    </p>

                    {error ? <p className="mt-4 text-sm font-semibold text-brand-red">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={request.isPending || !orderId.trim() || !email.trim()}
                        className="premium-button mt-8 w-full disabled:opacity-50"
                    >
                        {request.isPending ? 'Sending…' : 'Email me the link'}
                    </button>

                    <p className="mt-6 text-center text-sm text-ink-soft">
                        Have an account? <Link to="/myaccount" className="font-bold text-apple-text underline underline-offset-2">Your orders are in there</Link>.
                    </p>
                </form>
            </section>
        </div>
    );
};

export default TrackOrder;

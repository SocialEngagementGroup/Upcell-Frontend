import React, { useState } from 'react';
import Seo from '../../components/Seo/Seo';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axiosInstance from '../../utilities/axiosInstance';
import ScrollToTop from '../../utilities/ScrollToTop';
import { extractApiError, validateEmailAddress } from '../../utilities/formValidation';
import { trackWholesaleInquiry } from '../../utilities/gtm';

// Why somebody with a pallet of phones would call UpCell rather than list them
// one at a time. Kept to four, because a list of nine benefits reads as a list
// of nine things nobody checked.
const BENEFITS = [
    {
        title: 'One quote for the whole lot',
        body: 'Send the make, model and rough condition. We price the batch, not each handset.',
    },
    {
        title: 'Paid on inspection',
        body: 'We check the devices on arrival and pay within one business day of agreeing the figure.',
    },
    {
        title: 'Any condition',
        body: 'Working, broken, locked or missing parts. A device we cannot resell still has a value to us.',
    },
    {
        title: 'Data wiped and certified',
        body: 'Every unit is erased to standard before it is resold, and we confirm it in writing.',
    },
];

// Roboto is loaded at 400, 500 and 700 only, so font-bold is the heaviest real
// weight — font-extrabold renders as a browser-synthesised fake. Brand colours
// come from the tokens: brand-red is the accent on the one action, never a
// background.
const Wholesale = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', devices: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [failure, setFailure] = useState('');
    const [sent, setSent] = useState(false);

    const set = (field) => (event) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    // Checked here so a mistake is caught before a round trip, and again by
    // the server, which is the one that decides.
    const validate = () => {
        const next = {};
        if (form.name.trim().length < 2) next.name = 'Please enter your name.';
        if (!validateEmailAddress(form.email.trim())) next.email = 'Please enter a valid email address.';
        if (form.phone.trim().length < 7) next.phone = 'Please enter a phone number we can reach you on.';
        if (form.devices.trim().length < 3) next.devices = 'Tell us roughly what you have.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = async (event) => {
        event.preventDefault();
        setFailure('');
        if (!validate()) return;

        setSubmitting(true);
        try {
            await axiosInstance.post('add-run-form-submit', {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                devices: form.devices.trim(),
            });
            trackWholesaleInquiry();
            setSent(true);
        } catch (error) {
            setFailure(extractApiError(error, 'Something went wrong sending that. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (sent) {
        return (
            <div className="page-shell">
                <Seo
                title="Sell devices in volume"
                description="We buy Apple and Android handsets, tablets and laptops by the batch, in any condition. One quote for the whole lot."
                path="/wholesale"
            />
            <ScrollToTop />
                <section className="page-container py-20">
                    <div className="premium-card mx-auto max-w-[560px] rounded-[32px] px-8 py-14 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-text/[0.06] text-apple-text">
                            <CheckCircleIcon className="!text-[32px]" />
                        </div>
                        <h1 className="mt-6 text-apple-text">Thanks — we have it.</h1>
                        <p className="mx-auto mt-3 max-w-[420px] text-base leading-7 text-ink-soft">
                            One of us will come back to you within one business day with a figure or a
                            question. If it is urgent, the support page has our number.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                            <Link to="/shop" className="premium-button w-full sm:w-auto">Browse the shop</Link>
                            <Link to="/support" className="premium-button-secondary w-full sm:w-auto">Contact support</Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-10">
                <div className="mx-auto max-w-[760px] text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-red">Wholesale</p>
                    <h1 className="mt-3 text-apple-text">Selling devices in volume?</h1>
                    <p className="mx-auto mt-5 max-w-[620px] text-base leading-8 text-ink-soft sm:text-lg">
                        We buy Apple and Android handsets, tablets and laptops by the batch — from ten
                        units to a few hundred. Tell us what you have and we will come back with a
                        figure, usually the same day.
                    </p>
                </div>
            </section>

            <section className="page-container pb-12">
                <div className="grid gap-5 sm:grid-cols-2">
                    {BENEFITS.map((benefit) => (
                        <div key={benefit.title} className="premium-card rounded-[28px] p-6">
                            <h3 className="text-xl font-bold text-apple-text">{benefit.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-ink-soft">{benefit.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container pb-20">
                <form onSubmit={submit} className="premium-card mx-auto max-w-[620px] rounded-[32px] p-6 sm:p-10">
                    <h2 className="text-apple-text">Tell us what you have</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                        No obligation, and we will not add you to a mailing list.
                    </p>

                    <div className="mt-8 space-y-5">
                        {[
                            { id: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
                            { id: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
                            { id: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel' },
                        ].map((field) => (
                            <div key={field.id}>
                                <label htmlFor={`wholesale-${field.id}`} className="block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                                    {field.label}
                                </label>
                                <input
                                    id={`wholesale-${field.id}`}
                                    type={field.type}
                                    autoComplete={field.autoComplete}
                                    value={form[field.id]}
                                    onChange={set(field.id)}
                                    className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white p-3 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25"
                                />
                                {errors[field.id] ? (
                                    <p className="mt-1.5 text-xs font-medium text-brand-red">{errors[field.id]}</p>
                                ) : null}
                            </div>
                        ))}

                        <div>
                            <label htmlFor="wholesale-devices" className="block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                                What are you selling?
                            </label>
                            <textarea
                                id="wholesale-devices"
                                rows={4}
                                value={form.devices}
                                onChange={set('devices')}
                                placeholder="e.g. 40 x iPhone 13, mixed storage, most working, some cracked screens"
                                className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white p-3 text-sm text-apple-text outline-none transition-all focus:border-apple-text/25"
                            />
                            {errors.devices ? (
                                <p className="mt-1.5 text-xs font-medium text-brand-red">{errors.devices}</p>
                            ) : (
                                <p className="mt-1.5 text-xs text-ink-soft">
                                    A rough count and condition is enough — we will ask for the detail later.
                                </p>
                            )}
                        </div>
                    </div>

                    {failure ? <p className="mt-5 text-sm font-medium text-brand-red">{failure}</p> : null}

                    {/* The one red action on the page. */}
                    <button type="submit" disabled={submitting} className="premium-button mt-8 w-full disabled:opacity-50">
                        {submitting ? 'Sending…' : 'Get a quote'}
                    </button>

                    <p className="mt-5 text-center text-sm text-ink-soft">
                        Selling a single device instead?{' '}
                        <Link to="/trade-in" className="font-bold text-apple-text underline underline-offset-2">
                            Use the trade-in form
                        </Link>.
                    </p>
                </form>
            </section>
        </div>
    );
};

export default Wholesale;

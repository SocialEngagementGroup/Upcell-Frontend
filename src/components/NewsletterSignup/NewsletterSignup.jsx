import React, { useState } from 'react';
import axiosInstance from '../../utilities/axiosInstance';
import { extractApiError, validateEmailAddress } from '../../utilities/formValidation';
import useFormAnalytics from '../../utilities/useFormAnalytics';

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics('newsletter_section');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        const emailError = validateEmailAddress(email);
        if (emailError) {
            setMessage(emailError);
            trackFailure(emailError, { source: 'newsletter-section', phase: 'validation' });
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            await axiosInstance.post('newsletter-subscribers', {
                email: email.trim(),
                source: 'newsletter-section',
            });
            setMessage('Subscribed successfully.');
            trackSuccess({ source: 'newsletter-section' });
            setEmail('');
        } catch (error) {
            const failureMessage = extractApiError(error, 'Unable to subscribe right now.');
            setMessage(failureMessage);
            trackFailure(failureMessage, { source: 'newsletter-section', phase: 'request' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="px-4 py-14 md:px-6 md:py-20">
            <div className="page-container">
                <div className="premium-card mx-auto max-w-[760px] rounded-[40px] bg-white/80 px-8 py-10 text-center md:px-12 md:py-14">
                    <span className="eyebrow mb-5">Newsletter</span>
                    <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] text-apple-text">Get Notified When New Refurbished Apple Devices Arrive</h2>
                    <p className="mx-auto mb-8 max-w-[540px] text-base leading-8 text-ink-soft">Be first to know about fresh certified refurbished iPhone, iPad, and MacBook inventory, trade-in value boosts, and limited-stock finds.</p>
                    
                    <form className="mb-6 flex gap-3 max-sm:flex-col" onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="premium-input flex-1"
                            value={email}
                            onChange={(event) => {
                                markInteraction();
                                setEmail(event.target.value);
                            }}
                            required
                        />
                        <button type="submit" className="premium-button max-sm:w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                    {message && <p className="mb-4 text-sm text-apple-gray">{message}</p>}
                    <p className="!text-[13px] opacity-80 text-apple-gray">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;

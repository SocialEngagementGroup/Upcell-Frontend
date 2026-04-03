import { Link } from 'react-router-dom'
import { useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { extractApiError, validateEmailAddress } from '../../../utilities/formValidation';
import useFormAnalytics from '../../../utilities/useFormAnalytics';

// Modern Icons
const SocialIcons = {
    Instagram: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    Facebook: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    Twitter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
};

const MyFooter = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterMessage, setNewsletterMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics('newsletter_footer');

    const handleNewsletterSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        const emailError = validateEmailAddress(newsletterEmail);
        if (emailError) {
            setNewsletterMessage(emailError);
            trackFailure(emailError, { source: 'footer', phase: 'validation' });
            return;
        }

        setIsSubmitting(true);
        setNewsletterMessage('');

        try {
            await axiosInstance.post('newsletter-subscribers', {
                email: newsletterEmail.trim(),
                source: 'footer',
            });
            setNewsletterMessage('Subscribed successfully.');
            trackSuccess({ source: 'footer' });
            setNewsletterEmail('');
        } catch (error) {
            const failureMessage = extractApiError(error, 'Unable to subscribe right now.');
            setNewsletterMessage(failureMessage);
            trackFailure(failureMessage, { source: 'footer', phase: 'request' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-black">
            <div className="page-container py-10">
                <div className="overflow-hidden rounded-[36px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:px-12 md:py-10">
                    <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1.6fr]">
                        <div className="space-y-5">
                            <Link to="/" className="flex items-center">
                                <img src="/staticImages/upcellLogo.png" alt="Upcell Logo" className="h-[138px] w-auto object-contain" />
                            </Link>
                            <p className="max-w-[320px] text-sm leading-7 text-ink-soft">
                                Certified refurbished iPhones, iPads, and MacBooks — professionally inspected, honestly graded, and backed by a 12-month warranty. Save up to 40% vs. new.
                            </p>
                            <div className="flex gap-3 pt-2">
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] text-apple-gray hover:-translate-y-0.5 hover:bg-surface-alt hover:text-apple-text"><SocialIcons.Instagram /></a>
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] text-apple-gray hover:-translate-y-0.5 hover:bg-surface-alt hover:text-apple-text"><SocialIcons.Facebook /></a>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] text-apple-gray hover:-translate-y-0.5 hover:bg-surface-alt hover:text-apple-text"><SocialIcons.Twitter /></a>
                            </div>
                        </div>

                        <div className="space-y-4 lg:pt-8">
                            <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-apple-text">Shop</h4>
                            <div className="flex flex-col gap-3 text-[15px] text-ink-soft">
                                <Link to="/shop">All Products</Link>
                                <Link to="/shop?category=iPhone">iPhone</Link>
                                <Link to="/shop?category=iPad">iPad</Link>
                                <Link to="/shop?category=MacBook">MacBook</Link>
                                <Link to="/trade-in">Trade In</Link>
                            </div>
                        </div>

                        <div className="space-y-4 lg:pt-8">
                            <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-apple-text">Company</h4>
                            <div className="flex flex-col gap-3 text-[15px] text-ink-soft">
                                <Link to="/about">About Us</Link>
                                <Link to="/blogs">Blogs</Link>
                                <Link to="/myaccount">My Account</Link>
                            </div>
                        </div>

                        <div className="space-y-4 lg:pt-8">
                            <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-apple-text">Assistance</h4>
                            <div className="flex flex-col gap-3 text-[15px] text-ink-soft">
                                <Link to="/return-policy">Warranty & Returns</Link>
                                <Link to="/privacy-policy">Privacy Policy</Link>
                                <Link to="/support">Support</Link>
                            </div>
                        </div>
                        <div className="space-y-6 lg:pt-8">
                            <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-apple-text">Stay Updated</h4>
                            <p className="text-[13px] leading-6 text-apple-gray">Get notified about new certified refurbished products and exclusive trade-in offers.</p>
                            <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={newsletterEmail}
                                    onChange={(event) => {
                                        markInteraction();
                                        setNewsletterEmail(event.target.value);
                                    }}
                                    className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white px-5 text-sm font-medium text-apple-text outline-none transition-all placeholder:text-apple-gray focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)]"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-apple-text px-6 text-sm font-bold text-white shadow-none ring-0 transition-all duration-300 hover:bg-black"
                                >
                                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>
                            {newsletterMessage && (
                                <p className="text-[12px] text-apple-gray">{newsletterMessage}</p>
                            )}
                        </div>

                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-black/[0.06] pt-6 text-[13px] text-apple-gray md:flex-row md:items-center md:justify-between">
                        <p>&copy; {new Date().getFullYear()} UpCell. All rights reserved.</p>
                        <p>Certified refurbished Apple devices. Trusted trade-ins. Transparent pricing.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default MyFooter

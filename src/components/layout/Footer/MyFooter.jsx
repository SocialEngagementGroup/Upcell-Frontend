import { useState } from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';

import axiosInstance from '../../../utilities/axiosInstance';
import useFormAnalytics from '../../../utilities/useFormAnalytics';
import { extractApiError, validateEmailAddress } from '../../../utilities/formValidation';
import { STATIC_IMAGES, staticImageUrl } from '../../../constants/staticImages';
import { FOOTER_COLUMNS, FOOTER_PHONE, FOOTER_SOCIALS, PAYMENT_METHODS } from './footerNav';

const SOCIAL_ICONS = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    twitter: TwitterIcon,
};

// Site footer. Newsletter row on top, link columns beneath, legal strip last —
// the reference's arrangement.
//
// The newsletter posts to the same `newsletter-subscribers` endpoint the live
// footer uses, with the same validation and analytics, so subscriptions keep
// landing in the admin inbox that already exists.
const MyFooter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics('newsletter_footer');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        const emailError = validateEmailAddress(email);
        if (emailError) {
            setMessage(emailError);
            setIsError(true);
            trackFailure(emailError, { source: 'footer', phase: 'validation' });
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            await axiosInstance.post('newsletter-subscribers', { email: email.trim(), source: 'footer' });
            setMessage('Subscribed. Look out for the first one.');
            setIsError(false);
            trackSuccess({ source: 'footer' });
            setEmail('');
        } catch (error) {
            const failure = extractApiError(error, 'Unable to subscribe right now.');
            setMessage(failure);
            setIsError(true);
            trackFailure(failure, { source: 'footer', phase: 'request' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const linkClass = 'text-[0.875rem] font-normal text-ink-soft underline-offset-4 outline-none transition-colors duration-200 ease-smooth hover:text-brand-red hover:underline focus-visible:ring-2 focus-visible:ring-brand-red';

    return (
        <footer className="border-t border-solid border-black/[0.08] bg-white">
            <div className="site-shell py-12 md:py-14">

                {/* Newsletter */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
                    <div className="md:max-w-[42ch]">
                        <h2 className="text-[1.25rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.5rem]">
                            Stay in the loop with new arrivals
                        </h2>
                        <p className="mt-2 text-[0.9375rem] font-normal leading-snug text-apple-gray">
                            Be the first to hear about fresh stock, price drops, and trade-in offers.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full md:max-w-[520px]">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
                            <div className="relative flex-1">
                                <MailOutlineIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray"
                                />
                                <input
                                    id="footer-newsletter-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => { markInteraction(); setEmail(event.target.value); }}
                                    aria-invalid={isError || undefined}
                                    aria-describedby={message ? 'footer-newsletter-message' : undefined}
                                    className="h-12 w-full rounded-lg border border-solid border-black/[0.16] bg-white pl-4 pr-10 text-[0.9375rem] font-medium text-apple-text outline-none transition-colors placeholder:font-normal placeholder:text-apple-gray focus:border-apple-text"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 shrink-0 rounded-lg bg-apple-text px-7 text-[0.9375rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-black focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-apple-gray"
                            >
                                {isSubmitting ? 'Signing up…' : 'Sign up'}
                            </button>
                        </div>

                        {message && (
                            <p
                                id="footer-newsletter-message"
                                role={isError ? 'alert' : 'status'}
                                className={`mt-2 text-[0.8125rem] font-medium ${isError ? 'text-brand-red' : 'text-ink-soft'}`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* Link columns. Socials sit under About and the payment
                    methods under Services, in the columns themselves rather
                    than in a separate strip — the reference's arrangement. */}
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-5">
                    {FOOTER_COLUMNS.map((column) => (
                        <nav key={column.id} aria-labelledby={`footer-${column.id}`}>
                            <h3 id={`footer-${column.id}`} className="text-[1rem] font-bold tracking-[-0.01em] text-apple-text">
                                {column.title}
                            </h3>

                            <ul className="mt-4 flex list-none flex-col gap-3">
                                {column.links.map((link) => (
                                    <li key={`${column.id}-${link.label}`}>
                                        <Link to={link.to} className={linkClass}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>

                            {column.withSocials && (
                                <ul className="mt-5 flex list-none flex-wrap items-center gap-2">
                                    {FOOTER_SOCIALS.map((social) => {
                                        const Icon = SOCIAL_ICONS[social.id];

                                        return (
                                            <li key={social.id}>
                                                <a
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    aria-label={social.label}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-apple-bg text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-apple-text hover:text-white focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[18px]"
                                                >
                                                    <Icon aria-hidden="true" />
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {column.withPayments && (
                                <>
                                    <p className="mt-5 text-[0.875rem] font-normal text-ink-soft">
                                        Payments 100% secured
                                    </p>
                                    <ul className="mt-3 flex list-none flex-wrap gap-1.5">
                                        {PAYMENT_METHODS.map((method) => (
                                            <li
                                                key={method}
                                                className="rounded-md border border-solid border-black/[0.12] bg-white px-2 py-1 text-[0.6875rem] font-bold text-ink-soft"
                                            >
                                                {method}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </nav>
                    ))}
                </div>

                {/* Phone sits on its own now that the socials have moved into
                    the About column. */}
                <div className="mt-10 border-t border-solid border-black/[0.08] pt-8">
                    <a
                        href={FOOTER_PHONE.href}
                        className="inline-flex items-center gap-2 text-[0.9375rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red [&_svg]:!text-[20px]"
                    >
                        <CallOutlinedIcon aria-hidden="true" />
                        {FOOTER_PHONE.label}
                    </a>
                </div>

                {/* Legal strip */}
                <div className="mt-8 flex flex-col items-center gap-4 border-t border-solid border-black/[0.08] pt-8 md:flex-row md:justify-between">
                    <Link to="/" aria-label="UpCell home" className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                        <img
                            src={staticImageUrl(STATIC_IMAGES.LOGO, 240)}
                            alt="UpCell"
                            width="240"
                            height="64"
                            loading="lazy"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    <p className="text-[0.8125rem] font-normal text-apple-gray">
                        © {new Date().getFullYear()} UpCell IT. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default MyFooter;

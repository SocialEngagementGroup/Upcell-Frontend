import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const ContactThankYou = () => {
    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-10 text-center sm:rounded-[40px] sm:px-8 sm:py-14 md:px-12 md:py-20">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-apple-text text-white sm:h-24 sm:w-24">
                        <MarkEmailReadOutlinedIcon className="!text-[40px] sm:!text-[48px]" />
                    </div>
                    <h1 className="mt-7 text-[clamp(2.1rem,5vw,4.6rem)] leading-[0.96] sm:leading-[0.92]">Thank you — message received.</h1>
                    <p className="mx-auto mt-4 max-w-[620px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        Thanks for reaching out to UpCell. Our team has your message and typically replies within 24 hours. Keep an eye on your inbox for our response.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <Link to="/shop" className="premium-button w-full sm:w-auto">Continue shopping</Link>
                        <Link to="/" className="premium-button-secondary w-full sm:w-auto">Back to home</Link>
                    </div>
                </div>
            </section>

            <section className="page-container pb-16 sm:pb-24">
                <div className="mx-auto grid max-w-[820px] gap-4 sm:grid-cols-3">
                    <div className="premium-card rounded-[28px] p-6 text-center">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Response time</div>
                        <div className="mt-2 text-lg font-extrabold text-apple-text">Within 24 hours</div>
                    </div>
                    <div className="premium-card rounded-[28px] p-6 text-center">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Need it faster?</div>
                        <a href="https://www.facebook.com/usa.Upcells" target="_blank" rel="noreferrer" className="mt-2 inline-block text-lg font-extrabold text-apple-text hover:text-brand-red transition-colors">Message us on Facebook</a>
                    </div>
                    <div className="premium-card rounded-[28px] p-6 text-center">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Track an order?</div>
                        <Link to="/myaccount" className="mt-2 inline-block text-lg font-extrabold text-apple-text hover:text-brand-red transition-colors">Go to my account</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactThankYou;

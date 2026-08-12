import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ReturnPolicy = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Returns</span>
                    </nav>
                    <h1 className="text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">30-Day Return Policy on All Certified Premium Apple Devices</h1>
                    <p className="mt-4 max-w-[640px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        Every certified premium iPhone, iPad, and MacBook purchased from UpCell is covered by a 30-day return window and a 12-month limited warranty. If something isn’t right, we’ll guide you through the process clearly.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[28px] px-6 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <p>You have 30 days from delivery to request a return. The fastest route is to email support with your order information and reason for the request.</p>
                    <h2>How to start a return</h2>
                    <ol>
                        <li>Email <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>.</li>
                        <li>Use a subject line like: <strong>Product Return Request - [Your Order ID]</strong>.</li>
                        <li>Include your name, address, order date, return date, and preferred return carrier if applicable.</li>
                        <li>Attach any supporting photos or notes that help explain the request.</li>
                    </ol>
                    <h2>After you contact us</h2>
                    <p>Our team reviews the request and replies with the next steps, including packaging and shipping guidance when needed.</p>
                    <p>If you have questions or concerns, include them in your email and we’ll help you through the process.</p>
                </article>
            </section>
        </div>
    );
};

export default ReturnPolicy;

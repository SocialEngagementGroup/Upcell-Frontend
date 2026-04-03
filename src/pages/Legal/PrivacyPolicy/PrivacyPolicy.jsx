import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const PrivacyPolicy = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Privacy</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">Privacy policy</h1>
                    <p className="mt-5 max-w-[620px] text-lg leading-8 text-ink-soft">
                        Last updated: March 2024. We collect and use information only as needed to operate the UpCell experience and support our customers.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[36px] px-8 py-10 md:px-12 md:py-14">
                    <h2>Introduction</h2>
                    <p>UpCell is committed to protecting the privacy of our customers and site visitors. This policy explains how we collect, use, retain, and share information connected to our services.</p>
                    <h2>About us</h2>
                    <p>UpCell operates in the United States and provides online commerce and device resale services focused on premium technology products.</p>
                    <h2>Information we collect</h2>
                    <p>We may collect information you provide directly, along with technical and usage information that helps us operate the site, process purchases, and improve the customer experience.</p>
                    <h2>How we use your information</h2>
                    <p>Information is used to fulfill orders, communicate with customers, support transactions, improve service quality, and meet legal or operational obligations.</p>
                    <h2>How we retain and share information</h2>
                    <p>We retain information only as long as necessary for the purposes above and may share it with service providers or partners involved in payments, logistics, fraud prevention, and required compliance work.</p>
                    <h2>Your rights</h2>
                    <p>You may contact us to request access, correction, updates, or deletion of personal information where applicable.</p>
                    <h2>Cookies and related technologies</h2>
                    <p>We use cookies and similar technologies to understand usage patterns, improve the website, and support essential functionality.</p>
                </article>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

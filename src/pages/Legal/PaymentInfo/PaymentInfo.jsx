import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import visa from '../../../assets/visa.svg';
import mastercard from '../../../assets/master.svg';
import americanExpress from '../../../assets/americanExpress.svg';

const CARDS = [
    { src: visa, label: 'Visa accepted' },
    { src: mastercard, label: 'Mastercard accepted' },
    { src: americanExpress, label: 'American Express accepted' },
];

const PaymentInfo = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Payment &amp; Security</span>
                    </nav>
                    <h1 className="text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">Payment &amp; Security</h1>
                    <p className="mt-4 max-w-[680px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        How payment works at UpCell IT Inc. — the cards we accept, the currency we charge in, where we ship, and how your payment details are protected.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8">
                        <h2 className="text-2xl">Cards we accept</h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                            {CARDS.map((card) => (
                                <span key={card.label} className="flex h-12 w-20 items-center justify-center rounded-[16px] border border-black/[0.06] bg-white">
                                    <img src={card.src} alt={card.label} className="max-h-7 w-auto object-contain" />
                                </span>
                            ))}
                        </div>
                        <p className="mt-4 text-sm leading-6 text-ink-soft">
                            We also accept bank transfer and cash at pickup. Full payment terms are in our{' '}
                            <Link to="/terms-conditions" className="font-bold text-brand-red">Terms &amp; Conditions</Link>.
                        </p>
                    </div>

                    <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8">
                        <h2 className="text-2xl">Currency &amp; destinations</h2>
                        <dl className="mt-5 divide-y divide-black/[0.06] border-t border-black/[0.06]">
                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-sm font-semibold text-apple-gray">Currency</dt>
                                <dd className="text-sm font-bold text-apple-text text-right">US Dollars (USD)</dd>
                            </div>
                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-sm font-semibold text-apple-gray">We ship to</dt>
                                <dd className="text-sm font-bold text-apple-text text-right">United States only</dd>
                            </div>
                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-sm font-semibold text-apple-gray">Business location</dt>
                                <dd className="text-sm font-bold text-apple-text text-right">Columbus, OH, United States</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 lg:col-span-2">
                        <h2 className="flex items-center gap-2 text-2xl">
                            <LockOutlinedIcon className="!text-[22px]" />
                            Secure payments
                        </h2>
                        <ul className="mt-5 space-y-3 text-sm leading-6 text-ink-soft">
                            <li>Our Site is served over an encrypted <strong>HTTPS</strong> connection.</li>
                            <li>Card payments are handled by a <strong>PCI DSS compliant</strong> payment processor.</li>
                            <li>UpCell IT Inc. <strong>does not store your full card number or card security code</strong> on our systems.</li>
                        </ul>
                    </div>

                    <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 lg:col-span-2">
                        <h2 className="text-2xl">Policies &amp; support</h2>
                        <div className="mt-5 grid gap-3 text-[15px] text-ink-soft sm:grid-cols-2">
                            <Link to="/return-policy" className="font-bold text-brand-red">Return &amp; Refund Policy</Link>
                            <Link to="/delivery-policy" className="font-bold text-brand-red">Delivery Policy</Link>
                            <Link to="/promotions" className="font-bold text-brand-red">Promotions &amp; Offer Terms</Link>
                            <Link to="/terms-conditions" className="font-bold text-brand-red">Terms &amp; Conditions</Link>
                            <Link to="/privacy-policy" className="font-bold text-brand-red">Privacy Policy</Link>
                            <Link to="/support" className="font-bold text-brand-red">Contact Support</Link>
                        </div>
                        <p className="mt-6 text-sm leading-6 text-ink-soft">
                            UpCell IT Inc.<br />
                            973 Harrisburg Pike, Columbus, OH 43223, United States<br />
                            Phone: <a href="tel:+13802663942" className="font-bold text-brand-red">+1 (380) 266-3942</a><br />
                            Email: <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PaymentInfo;

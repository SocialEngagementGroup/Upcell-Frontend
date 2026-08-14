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
                        Every certified premium iPhone, iPad, and MacBook purchased from UpCell IT Inc. is covered by a 30-day return window and a 12-month limited warranty. If something isn’t right, we’ll guide you through the process clearly.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[28px] px-6 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <p>This is a summary of our return and refund rules. The full, governing version is in Section 6 of our{' '}
                        <Link to="/terms-conditions#returns-refunds" className="font-bold text-brand-red">Terms &amp; Conditions</Link>. If anything here conflicts with the Terms, the Terms apply.</p>

                    <h2>30-day return window</h2>
                    <p>Eligible products may be returned within <strong>30 calendar days</strong> of delivery or in-store purchase. A return based on preference or a change of mind must be requested within this 30-day period.</p>

                    <h2>Ask us before sending anything back</h2>
                    <p>Before mailing a product back, contact us to request <strong>return authorization</strong> and shipping instructions. Returns sent without authorization may be delayed or refused. Unless the return resulted from our error or a confirmed defect, you are responsible for return shipping, and original shipping charges are non-refundable. We recommend a trackable, insured service — UpCell IT is not responsible for merchandise lost or damaged during return shipping.</p>

                    <h2>Return eligibility</h2>
                    <ul>
                        <li>The device must be returned in the same condition in which it was sold.</li>
                        <li>Its IMEI or serial number must match our sales records.</li>
                        <li>All included accessories, chargers, boxes, and promotional items must be returned.</li>
                        <li>No cracks, liquid damage, physical damage, missing parts, or unauthorized repairs.</li>
                        <li>All personal information, passcodes, SIM cards, Apple IDs, and activation locks must be removed.</li>
                        <li>Proof of purchase is required.</li>
                    </ul>

                    <h2>15% restocking fee</h2>
                    <p>Opened, used, or activated devices may be subject to a <strong>15% restocking fee</strong> unless the device is confirmed to be defective. The restocking fee is waived when the device was damaged during shipping, you received the wrong product, or our inspection confirms an undisclosed hardware defect at the time of sale.</p>

                    <h2>What cannot be returned</h2>
                    <p>The following are final sale and cannot be returned unless required by law or confirmed defective:</p>
                    <ul>
                        <li>Clearance or specially marked final-sale merchandise</li>
                        <li>SIM cards, prepaid airtime, activation fees, and service payments</li>
                        <li>Screen protectors that have been installed</li>
                        <li>Opened earbuds, headphones, and other personal-use accessories</li>
                        <li>Labor, repair, unlocking, data-transfer, and diagnostic charges</li>
                        <li>Special-order or custom-ordered merchandise</li>
                        <li>Products damaged after purchase</li>
                    </ul>

                    <h2>Inspection &amp; refunds</h2>
                    <p>All returns are inspected before approval. Approval normally requires confirmation of the device&rsquo;s IMEI or serial number, physical and cosmetic condition, account and activation-lock status, functionality, and included accessories and packaging. Approved refunds are issued to the original payment method; processing times vary by your bank or payment provider. Cash purchases are refunded by bank transfer. Devices that do not satisfy this policy may be returned to you at your expense.</p>

                    <h2>How to start a return</h2>
                    <ol>
                        <li>Email <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a> to request return authorization.</li>
                        <li>Use a subject line like: <strong>Product Return Request - [Your Order ID]</strong>.</li>
                        <li>Include your name, address, order date, device model, IMEI or serial number, and reason for the request.</li>
                        <li>Attach any supporting photos or notes that help explain the request.</li>
                    </ol>
                    <p>Our team reviews the request and replies with the next steps, including packaging and shipping guidance. Hardware problems reported after the 30-day return period are handled under the{' '}
                        <Link to="/terms-conditions" className="font-bold text-brand-red">12-month limited warranty</Link>.</p>
                </article>
            </section>
        </div>
    );
};

export default ReturnPolicy;

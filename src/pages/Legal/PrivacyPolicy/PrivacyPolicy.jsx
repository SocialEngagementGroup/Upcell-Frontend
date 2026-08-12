import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const PrivacyPolicy = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Privacy</span>
                    </nav>
                    <h1 className="text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">Privacy Policy</h1>
                    <p className="mt-4 max-w-[640px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        UpCell IT Inc. — upcellit.com. Last updated: Aug 1, 2026.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[28px] px-6 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <p>
                        This Privacy Policy explains what personal information UpCell IT Inc. (&ldquo;UpCell IT,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects when you use upcellit.com (the &ldquo;Site&rdquo;), why we collect it, how we protect it, and the choices you have. By using the site, placing an order, or submitting a trade-in request, you agree to the practices described here.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p><strong>Information you provide directly:</strong></p>
                    <ul>
                        <li><strong>Account information</strong> — when you sign in, we receive your name, email address, and profile details from your Google account via our authentication provider.</li>
                        <li><strong>Order information</strong> — name, email, phone number, and shipping or pickup details when you place an order.</li>
                        <li><strong>Device records</strong> — for fraud prevention and warranty purposes, we record the IMEI, serial number, and condition of devices sold, returned, and traded in.</li>
                        <li><strong>Trade-in information</strong> — your device details and condition answers (including any disclosed blacklist or finance status), contact details, and the bank account information you provide so we can pay you after verification.</li>
                        <li><strong>Return requests</strong> — your order number, device details, and reason for return.</li>
                        <li><strong>Wholesale inquiries</strong> — business name, contact details, and the contents of your inquiry.</li>
                        <li><strong>Correspondence</strong> — anything you send us by email.</li>
                    </ul>
                    <p><strong>Information collected automatically:</strong></p>
                    <ul>
                        <li><strong>Usage and device data</strong> — IP address, browser type, pages visited, and similar technical data collected through standard web logs and analytics.</li>
                        <li><strong>Cookies and tracking technologies</strong> — see Section 6.</li>
                    </ul>
                    <p>We do not knowingly collect information from anyone under 18. The Site is not directed at children.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Process, ship, and deliver your orders, and keep you updated on order status</li>
                        <li>Evaluate trade-in requests, verify devices, and issue payouts</li>
                        <li>Process returns, exchanges, refunds, and warranty claims</li>
                        <li>Create and manage your account and let you track orders</li>
                        <li>Respond to inquiries, including wholesale and warranty requests</li>
                        <li>Send transactional emails (order confirmations, trade-in status updates, payment receipts)</li>
                        <li>Detect and prevent fraud — including verifying device IMEI/serial numbers against our sales records and checking that trade-in devices are not lost, stolen, or fraudulently obtained</li>
                        <li>Measure how visitors find and use the Site, including which advertising campaigns lead to orders and calls (see Section 6)</li>
                        <li>Comply with legal obligations, including record-keeping requirements for device purchases where applicable</li>
                    </ul>
                    <p>We do not sell your personal information to third parties.</p>

                    <h2>3. Marketing Communications</h2>
                    <p>If you opt in to marketing emails, you can unsubscribe at any time using the link in any marketing email or by contacting us. Transactional emails about your orders and trade-ins are sent regardless of marketing preferences, as they are part of providing the service.</p>

                    <h2>4. Who We Share Information With</h2>
                    <p>We share personal information only with service providers who help us operate the Site, and only as needed for them to do their job:</p>
                    <div className="legal-table-wrap">
                        <table className="min-w-[560px]">
                            <thead>
                                <tr>
                                    <th>Provider type</th>
                                    <th>Purpose</th>
                                    <th>Data involved</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Authentication (Clerk, with Google sign-in)</td>
                                    <td>Account creation and login</td>
                                    <td>Name, email, profile data</td>
                                </tr>
                                <tr>
                                    <td>Hosting and infrastructure (Vercel, Render, MongoDB Atlas)</td>
                                    <td>Running the Site and storing data</td>
                                    <td>All data described above</td>
                                </tr>
                                <tr>
                                    <td>Email delivery (Resend)</td>
                                    <td>Sending transactional emails</td>
                                    <td>Name, email, order/trade-in details</td>
                                </tr>
                                <tr>
                                    <td>Shipping carriers</td>
                                    <td>Delivering orders and processing trade-in/return shipments</td>
                                    <td>Name, address, phone, shipment details</td>
                                </tr>
                                <tr>
                                    <td>Analytics and advertising platforms</td>
                                    <td>Conversion and call tracking (Section 6)</td>
                                    <td>Usage data, ad-click identifiers</td>
                                </tr>
                                <tr>
                                    <td>Payment processing (our bank&rsquo;s merchant services)</td>
                                    <td>Processing card payments</td>
                                    <td>Card payment details (handled by the bank&rsquo;s payment processor, not stored by UpCell IT)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>We may also disclose information where required by law, to respond to lawful requests from authorities, or to protect the rights, safety, or property of UpCell IT or others. Suspected fraudulent transactions or returns, including devices reported lost or stolen, or returned with mismatched identifying information, may be reported to the appropriate payment provider or authorities.</p>
                    <p>If Upcell IT Inc. is ever involved in a merger, acquisition, or sale of assets, customer information may be transferred as part of that transaction; this Policy would continue to apply to it.</p>

                    <h2>5. Bank Details &amp; Payment Information</h2>
                    <ul>
                        <li><strong>Trade-in payouts:</strong> the bank account details you provide are used solely to issue your payout and are accessible only to authorized staff.</li>
                        <li><strong>Purchases by bank transfer:</strong> we receive standard remittance information from our bank; we do not collect your online banking credentials.</li>
                        <li><strong>Card payments:</strong> processed securely through our bank&rsquo;s merchant services; UpCell IT never sees or stores your full card number.</li>
                        <li><strong>Cash payments at pickup:</strong> no payment data is collected.</li>
                    </ul>

                    <h2>6. Cookies, Analytics &amp; Advertising</h2>
                    <p>We use cookies and similar technologies to keep you signed in, remember your session, and understand how the Site is used.</p>
                    <p>We also use conversion tracking to measure which channels and campaigns bring visitors to Upcell IT Inc.. This includes:</p>
                    <ul>
                        <li><strong>Advertising pixels/tags,</strong> such as the Google Ads tag and Meta Pixel, that record when a visitor arriving from an ad completes an action such as a purchase, trade-in request, or inquiry</li>
                        <li><strong>Call tracking,</strong> which uses trackable phone numbers to attribute calls to the campaign that generated them; calls may be logged for attribution purposes</li>
                    </ul>
                    <p>You can control cookies through your browser settings. Blocking cookies may affect Site features such as staying signed in.</p>

                    <h2>7. How We Protect Your Information</h2>
                    <p>We use commercially reasonable safeguards to protect your information, including encrypted connections (HTTPS) across the Site, access controls limiting who can view customer data, and authentication handled by a dedicated identity provider rather than passwords stored by us.</p>
                    <p>No method of transmission or storage is completely secure, so we cannot guarantee absolute security but we review our security practices on an ongoing basis. If a breach affecting your personal information occurs, we will notify you as required by applicable law.</p>

                    <h2>8. How Long We Keep Information</h2>
                    <p>We keep personal information only as long as needed for the purposes above:</p>
                    <ul>
                        <li><strong>Order, return, and trade-in records</strong> (including IMEI/serial records): retained for as long as needed to support warranty claims (at least 12 months), returns, fraud prevention, accounting, and legal requirements</li>
                        <li><strong>Account information:</strong> retained while your account is active; deleted upon verified account deletion request</li>
                        <li><strong>Bank payout details:</strong> retained only as long as needed to complete your payout and satisfy record-keeping requirements, then removed</li>
                        <li><strong>Inquiries and correspondence:</strong> retained for as long as needed to handle your inquiry and for a reasonable period afterward</li>
                    </ul>

                    <h2>9. Your Rights &amp; Choices</h2>
                    <p>You may:</p>
                    <ul>
                        <li>Access or correct the personal information we hold about you</li>
                        <li>Request deletion of your account and personal information, subject to records we must keep by law (e.g., transaction and device records)</li>
                        <li>Opt out of marketing at any time (Section 3)</li>
                        <li>Control cookies through your browser (Section 6)</li>
                    </ul>
                    <p>
                        If you have questions about this Privacy Policy, your rights, or how we handle your data, contact us at <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>.
                        We will verify your identity before acting on a request and respond within a reasonable timeframe. Depending on where you live, you may have additional rights under state law; we honor applicable rights for all customers.
                    </p>

                    <h2>10. Third-Party Links</h2>
                    <p>The Site may link to third-party websites or services. This Policy does not cover those sites, and we are not responsible for their privacy practices.</p>

                    <h2>11. Changes to This Policy</h2>
                    <p>We may update this Policy from time to time. The current version will always be posted on the Site with its &ldquo;Last updated&rdquo; date. Material changes will be highlighted on the Site or communicated by email where appropriate.</p>

                    <h2>12. Contact Us</h2>
                    <p>Questions or requests about your personal information:</p>
                    <p>
                        UpCell IT Inc.<br />
                        973 Harrisburg Pike, Columbus, OH 43223, United States<br />
                        Email: <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>
                    </p>
                </article>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

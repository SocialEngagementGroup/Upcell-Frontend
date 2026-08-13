import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const TermsConditions = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Terms</span>
                    </nav>
                    <h1 className="text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">Terms &amp; Conditions</h1>
                    <p className="mt-4 max-w-[640px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        UpCell IT Inc. — upcellit.com. Last updated: Aug 1, 2026.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[28px] px-6 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <p>
                        Welcome to UpCell IT. These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of upcellit.com (the &ldquo;Site&rdquo;) and your purchase of products or use of services offered by UpCell IT Inc. (&ldquo;UpCell IT,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), located at 973 Harrisburg Pike, Columbus, OH 43223, United States. By using the Site, placing an order, or submitting a trade-in request, you agree to these Terms. If you do not agree, please do not use the site.
                    </p>

                    <h2>1. About Our Products</h2>
                    <p>UpCell IT Inc. sells certified premium Apple devices, including iPhone, iPad, and MacBook models. Every device is professionally inspected and graded for condition before it is listed, and the condition grade is shown on each product page. Devices are covered by a 12-month limited warranty.</p>
                    <p>Product images are for illustration. Minor variations in packaging or included accessories may occur where noted on the listing.</p>

                    <h2>2. Eligibility &amp; Accounts</h2>
                    <p>You must be at least 18 years old (or the age of majority in your state) to place an order or submit a trade-in request.</p>
                    <p>We accept orders for delivery to addresses within the United States only. We do not accept orders for export outside the United States. We reserve the right to cancel any order we reasonably believe is intended for export, and to issue a full refund before the order is dispatched.</p>
                    <p>
                        You are responsible for keeping your account information secure. Contact us immediately at{' '}
                        <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a> if you suspect unauthorized use of your account.
                    </p>

                    <h2>3. Orders &amp; Payment</h2>
                    <p><strong>Accepted payment methods:</strong> card payment (processed securely through our bank&rsquo;s merchant services), bank transfer, or cash at pickup.</p>
                    <p><strong>Order confirmation.</strong> Placing an order through the Site is an offer to purchase. An order is not confirmed until payment has been received and verified by UpCell IT. For card payments, this means the transaction has been authorized and settled through our bank&rsquo;s merchant services. For bank transfers, this means funds have cleared into our account. For cash at pickup, the sale is completed when payment is made in full at handover. We reserve the right to cancel any order prior to payment verification.</p>
                    <p><strong>Pricing.</strong> All prices are listed in US dollars. We make every effort to keep pricing accurate, but if a product is listed at an incorrect price due to an error, we reserve the right to cancel the order and issue a full refund of any amount paid.</p>
                    <p><strong>Availability.</strong> All orders are subject to stock availability. If an item becomes unavailable after you order, we will contact you to offer an alternative or a full refund.</p>
                    <p>
                        <strong>Shipping.</strong> Orders are shipped as described in our{' '}
                        <Link to="/delivery-policy" className="font-bold text-brand-red">Delivery Policy</Link>. Standard shipping (3–7 business days) is free; priority and priority overnight options are available at an additional cost shown at checkout.
                    </p>

                    <h2>4. Trade-In / Buyback Program</h2>
                    <p><strong>How it works.</strong> You answer a condition questionnaire about your device and receive an instant quote. You then ship the device to us (or arrange drop-off where available).</p>
                    <p>Our team inspects and verifies the device&rsquo;s condition, and payment is issued once verification is complete.</p>
                    <p><strong>Quotes are estimates.</strong> The instant quote is based entirely on the information you provide and is not a final offer. The final payout is determined by our inspection of the actual device.</p>
                    <p><strong>Revised offers.</strong> If the device&rsquo;s verified condition differs from what was described — for example, undisclosed damage, a different model or storage capacity, an activation lock still enabled, or non-functional components — we will issue a revised offer. You may accept the revised offer or decline it, in which case we will return the device to you.</p>
                    <p><strong>Your responsibilities before sending a device:</strong></p>
                    <ul>
                        <li>Back up your data — UpCell IT is not responsible for any data left on a device</li>
                        <li>Sign out of iCloud / disable Find My and remove any activation lock</li>
                        <li>Remove SIM cards and any personal accessories</li>
                        <li>Disclose the device&rsquo;s full condition and status honestly in the questionnaire, including any carrier blacklist status or outstanding finance balance</li>
                    </ul>
                    <p><strong>Devices we do not buy.</strong> We do not purchase lost, stolen, or fraudulently obtained devices. Devices reported lost or stolen, or that fail our fraud checks, will be refused and may, where required by law, be surrendered to authorities.</p>
                    <p><strong>Blacklisted and financed devices.</strong> We may accept devices that are carrier-blacklisted or subject to an outstanding finance balance, provided this status is disclosed in the questionnaire and you are the device&rsquo;s legal owner with the full right to sell it. Quotes for such devices are adjusted to reflect their status. Undisclosed blacklist or finance status discovered during verification will result in a revised offer or refusal of the device.</p>
                    <p><strong>Ownership.</strong> By submitting a device, you confirm you are its legal owner with full right to sell it, and that selling it does not breach any agreement with a carrier, finance provider, or other party. Ownership transfers to UpCell IT when the final offer is accepted and payout is issued.</p>
                    <p><strong>Risk in transit.</strong> UpCell IT Inc. is not responsible for trade-in devices lost or damaged in transit before they reach our facility. We recommend using a trackable and insured shipping service.</p>
                    <p><strong>Payout timing.</strong> We inspect your device and issue payment by bank transfer within 2 business days of receiving it at our facility. You are responsible for providing accurate bank details; UpCell IT Inc. is not liable for delays caused by incorrect account information.</p>

                    <h2>5. 12-Month Limited Warranty</h2>
                    <p>Every device purchased from UpCell IT includes a 12-month limited warranty from the date of delivery or pickup, covering defects in workmanship and hardware.</p>
                    <p><strong>What&rsquo;s covered:</strong> hardware and workmanship defects not caused by the customer — for example, component faults, battery defects beyond normal wear thresholds, or manufacturing issues. Diagnosis is free.</p>
                    <p><strong>What&rsquo;s not covered:</strong></p>
                    <ul>
                        <li>Accidental damage (drops, cracks, dents) after delivery</li>
                        <li>Liquid damage</li>
                        <li>Damage from misuse or unauthorized repair or modification</li>
                        <li>Cosmetic wear from normal use</li>
                        <li>Software issues caused by third-party apps, jailbreaking, or user modification</li>
                        <li>Lost or stolen devices</li>
                    </ul>
                    <p>
                        <strong>Making a claim.</strong> Contact us at{' '}
                        <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>{' '}
                        with your order number, a description of the problem, and photos/video if applicable. We will provide troubleshooting steps or return instructions.
                    </p>
                    <p><strong>Shipping for warranty service.</strong> You pay shipping to send the device to us; UpCell IT pays return shipping on approved claims. Average turnaround is 3–7 business days after we receive the device.</p>
                    <p>Hardware problems reported after the 30-day return period (Section 6) are handled under this warranty.</p>

                    <h2 id="returns-refunds">6. Returns &amp; Refunds</h2>
                    <p>We want you to be satisfied with your purchase. Eligible products may be returned within 30 calendar days of delivery or in-store purchase, subject to the requirements below. A return based on preference or a change of mind must be made within this 30-day period.</p>
                    <p><strong>Return eligibility.</strong> To qualify for a return:</p>
                    <ul>
                        <li>The device must be returned in the same condition in which it was sold</li>
                        <li>The device&rsquo;s IMEI or serial number must match our sales records</li>
                        <li>All included accessories, chargers, boxes, and promotional items must be returned</li>
                        <li>The device must not have any cracks, liquid damage, physical damage, missing parts, or unauthorized repairs</li>
                        <li>All personal information, passcodes, SIM cards, Apple IDs, Google accounts, Samsung accounts, and activation locks must be removed</li>
                        <li>Proof of purchase is required</li>
                    </ul>
                    <p>Devices returned with an active Apple ID, Google account, Samsung account, Find My activation lock, lost or stolen status, financing balance, or carrier account restriction will not be accepted.</p>
                    <p><strong>Opened or activated devices.</strong> Opened, used, or activated devices may be subject to a 15% restocking fee unless the device is confirmed to be defective. The restocking fee is waived when the device was damaged during shipping, you received the wrong product, or our inspection confirms an undisclosed hardware defect at the time of sale.</p>
                    <p><strong>Nonreturnable items.</strong> The following are final sale and cannot be returned unless required by law or confirmed defective:</p>
                    <ul>
                        <li>Clearance or specially marked final-sale merchandise</li>
                        <li>SIM cards, prepaid airtime, activation fees, and service payments</li>
                        <li>Screen protectors that have been installed</li>
                        <li>Opened earbuds, headphones, and other personal-use accessories</li>
                        <li>Labor, repair, unlocking, data-transfer, and diagnostic charges</li>
                        <li>Special-order or custom-ordered merchandise</li>
                        <li>Products damaged after purchase</li>
                    </ul>
                    <p><strong>Online returns.</strong> Before mailing a product back, contact UpCell IT Inc. to request return authorization and shipping instructions. Returns sent without authorization may be delayed or refused. Unless the return resulted from our error or a confirmed defect, you are responsible for return shipping, and original shipping charges are nonrefundable. We recommend using a trackable and insured shipping service — UpCell IT is not responsible for merchandise lost or damaged during return shipping.</p>
                    <p><strong>Inspection and refunds.</strong> All returns are inspected before approval. Approval normally requires confirmation of the device&rsquo;s IMEI or serial number, physical and cosmetic condition, account and activation-lock status, functionality, and included accessories and packaging. Approved refunds are issued to the original payment method; processing times may vary depending on your bank or payment provider. Cash purchases are refunded by bank transfer. Devices that do not satisfy this policy may be returned to you at your expense.</p>
                    <p><strong>Exchanges.</strong> Approved exchanges are subject to product availability. If the requested replacement is unavailable, UpCell IT may issue a refund or store credit in line with this policy.</p>
                    <p><strong>Defective devices.</strong> Accidental damage, cracked screens, liquid damage, misuse, unauthorized repairs, and normal cosmetic wear are not manufacturing defects. Hardware problems reported after the return period are handled under the 12-month limited warranty (Section 5).</p>
                    <p><strong>Fraud prevention.</strong> UpCell IT records the IMEI, serial number, condition, and identifying information of devices sold and returned. Devices that have been altered, swapped, reported lost or stolen, or returned with mismatched identifying information will be refused. Suspected fraudulent returns may be reported to the appropriate payment provider or authorities.</p>

                    <h2>7. Wholesale</h2>
                    <p>Wholesale inquiries submitted through the Site are requests for a quote, not orders. Wholesale transactions are governed by separate terms agreed in writing between UpCell IT and the buyer.</p>

                    <h2>8. Acceptable Use</h2>
                    <p>You agree not to use the Site to submit false or fraudulent orders, returns, or trade-in requests, attempt to access accounts or data that are not yours, interfere with the Site&rsquo;s operation, or violate any applicable law. We reserve the right to refuse service, cancel orders, and suspend accounts where we reasonably suspect fraud or abuse.</p>

                    <h2>9. Intellectual Property</h2>
                    <p>All content on the Site — including the UpCell IT name, logo, product descriptions, images, and design — is the property of UpCell IT Inc. or its licensors and may not be copied or reused without written permission. Apple, iPhone, iPad, and MacBook are trademarks of Apple Inc.; Samsung and Google are trademarks of their respective owners. UpCell IT Inc. is an independent retailer and is not affiliated with or endorsed by these companies.</p>

                    <h2>10. Limitation of Liability</h2>
                    <p>To the maximum extent permitted by law, UpCell IT Inc.&rsquo;s total liability arising from any order or trade-in is limited to the amount you paid for the product (or the payout value of the trade-in) giving rise to the claim. UpCell IT Inc. is not liable for indirect, incidental, or consequential damages, including loss of data stored on any device. Nothing in these Terms limits liability that cannot be limited under applicable law, including your statutory consumer rights.</p>

                    <h2>11. Privacy</h2>
                    <p>
                        Your personal information is handled in accordance with our{' '}
                        <Link to="/privacy-policy" className="font-bold text-brand-red">Privacy Policy</Link>. By using the Site you consent to that handling.
                    </p>

                    <h2>12. Changes to These Terms</h2>
                    <p>We may update these Terms from time to time. The version posted on the Site at the time of your order or trade-in submission is the version that applies to that transaction.</p>

                    <h2>13. Governing Law</h2>
                    <p>These Terms are governed by the laws of the State of Ohio, without regard to conflict-of-law principles. Any dispute will be resolved in the state or federal courts located in Franklin County, Ohio.</p>

                    <h2>14. Contact</h2>
                    <p>
                        UpCell IT Inc.<br />
                        973 Harrisburg Pike, Columbus, OH 43223, United States<br />
                        Email: <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>
                    </p>
                    <p>To request a return, provide your name, order number, device model, IMEI or serial number, and reason for the return.</p>
                </article>
            </section>
        </div>
    );
};

export default TermsConditions;

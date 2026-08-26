import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
    return (
        <div>
            <section>
                <div>
                    <nav>
                        <Link to="/">Home</Link>
                        
                        <span>Returns</span>
                    </nav>
                    <h1>30-Day Return Policy on All Certified Premium Apple Devices</h1>
                    <p>
                        Every certified premium iPhone, iPad, and MacBook purchased from UpCell IT Inc. is covered by a 30-day return window and a 12-month limited warranty. If something isn’t right, we’ll guide you through the process clearly.
                    </p>
                </div>
            </section>

            <section>
                <article className="legal-prose">
                    <p>This is a summary of our return and refund rules. The full, governing version is in Section 6 of our{' '}
                        <Link to="/terms-conditions#returns-refunds">Terms &amp; Conditions</Link>. If anything here conflicts with the Terms, the Terms apply.</p>

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
                        <li>Email <a href="mailto:usa.Upcells@gmail.com">usa.Upcells@gmail.com</a> to request return authorization.</li>
                        <li>Use a subject line like: <strong>Product Return Request - [Your Order ID]</strong>.</li>
                        <li>Include your name, address, order date, device model, IMEI or serial number, and reason for the request.</li>
                        <li>Attach any supporting photos or notes that help explain the request.</li>
                    </ol>
                    <p>Our team reviews the request and replies with the next steps, including packaging and shipping guidance. Hardware problems reported after the 30-day return period are handled under the{' '}
                        <Link to="/terms-conditions">12-month limited warranty</Link>.</p>
                </article>
            </section>
        </div>
    );
};

export default ReturnPolicy;

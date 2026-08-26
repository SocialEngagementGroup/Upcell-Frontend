import { Link } from 'react-router-dom';

const Promotions = () => {
    return (
        <div>
            <section>
                <div>
                    <nav>
                        <Link to="/">Home</Link>
                        
                        <span>Promotions</span>
                    </nav>
                    <h1>Promotions &amp; Offer Terms</h1>
                    <p>
                        UpCell IT Inc. — upcellit.com. Last updated: Aug 15, 2026. These terms explain the conditions of the promotional claims shown across our site. Where a specific offer term conflicts with our general{' '}
                        <Link to="/terms-conditions">Terms &amp; Conditions</Link>, the general Terms govern.
                    </p>
                </div>
            </section>

            <section>
                <article className="legal-prose">
                    <p>All offers apply to orders placed and shipped within the United States only, are subject to stock availability, and may be changed or withdrawn at any time without notice. Offers cannot be exchanged for cash and, unless stated otherwise, cannot be combined with other promotions.</p>

                    <h2 id="save-40">1. &ldquo;Save up to 40% vs. new&rdquo;</h2>
                    <p>The &ldquo;up to 40%&rdquo; saving compares the UpCell IT price of a certified pre-owned device to the recent typical retail price of the same model bought new (same or nearest-equivalent storage and finish) from a mainstream US retailer.</p>
                    <ul>
                        <li>&ldquo;Up to 40%&rdquo; is a maximum, not a guaranteed saving on every device. The actual saving depends on the model, storage capacity, and cosmetic condition grade, and varies from item to item.</li>
                        <li>Comparison prices move over time; the saving is an estimate at the time of listing and is not a price-match commitment.</li>
                        <li>Certified pre-owned devices are not new. Every device is professionally inspected, graded for condition, and backed by our 12-month limited warranty as described in our Terms.</li>
                    </ul>

                    <h2 id="free-shipping">2. Free standard shipping</h2>
                    <ul>
                        <li>Standard shipping is free on all orders delivered to addresses within the United States. Estimated delivery is 3–7 business days after dispatch.</li>
                        <li>We do not ship internationally, and we do not ship to freight forwarders or package-forwarding services (see our{' '}
                            <Link to="/delivery-policy">Delivery Policy</Link>).</li>
                        <li>Priority and priority overnight shipping are available at an additional cost shown at checkout.</li>
                        <li>Original shipping charges are non-refundable on returns unless the return resulted from our error or a confirmed defect.</li>
                    </ul>

                    <h2 id="next-day">3. Next-day delivery (orders before 3 PM)</h2>
                    <ul>
                        <li>Next-day delivery is an optional paid upgrade (priority overnight), not the default shipping method, and is selected and priced at checkout.</li>
                        <li>To be eligible for next-business-day delivery, an order must be placed and payment verified before 3:00 PM ET on a business day. Orders placed after the cut-off, or on weekends or public holidays, are processed the next business day.</li>
                        <li>Next-day delivery is available on eligible in-stock items to eligible US destinations only, where the carrier offers overnight service. It is not available for pickup orders or for orders awaiting bank-transfer clearance.</li>
                        <li>Delivery timeframes are carrier estimates, not guarantees, and begin once the order is dispatched.</li>
                    </ul>

                    <h2 id="protection">4. Extended protection plans</h2>
                    <ul>
                        <li>Every device already includes a 12-month limited warranty covering hardware and workmanship defects, at no extra cost, as described in our{' '}
                            <Link to="/terms-conditions#returns-refunds">Terms &amp; Conditions</Link>.</li>
                        <li>Extended protection is an optional paid add-on that may cover accidental damage (such as drops or cracks) not covered by the standard warranty. Price, length of cover, claim limits, and exclusions are shown before purchase and apply from the date of purchase.</li>
                        <li>Accessory add-ons offered at checkout (for example cases and screen protectors) are separate products and are not protection plans.</li>
                        <li>Protection plans do not cover loss, theft, or intentional damage, and are subject to the plan&rsquo;s own terms provided at the time of purchase.</li>
                    </ul>

                    <h2 id="general">5. General conditions</h2>
                    <ul>
                        <li>UpCell IT Inc. reserves the right to correct pricing or promotional errors and to cancel and fully refund any affected order before dispatch.</li>
                        <li>Promotions have no cash value and are void where prohibited.</li>
                        <li>These terms are governed by the laws of the State of Ohio, consistent with our Terms &amp; Conditions.</li>
                    </ul>

                    <h2>Contact</h2>
                    <p>
                        UpCell IT Inc.<br />
                        973 Harrisburg Pike, Columbus, OH 43223, United States<br />
                        Email: <a href="mailto:usa.Upcells@gmail.com">usa.Upcells@gmail.com</a>
                    </p>
                </article>
            </section>
        </div>
    );
};

export default Promotions;

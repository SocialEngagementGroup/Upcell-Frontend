import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const DeliveryPolicy = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Delivery</span>
                    </nav>
                    <h1 className="text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">Delivery Policy</h1>
                    <p className="mt-4 max-w-[640px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        UpCell IT Inc. — upcellit.com. Last updated: Aug 1, 2026.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[28px] px-6 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <p>This policy explains how UpCell IT ships devices you purchase, how pickup works, and how shipping works for trade-in and return devices you send to us.</p>

                    <h2>1. Delivery Options</h2>
                    <p>We currently offer two ways to receive your device:</p>
                    <p><strong>Shipped orders</strong> — we ship within the United States via tracked carrier delivery:</p>
                    <ul>
                        <li>Standard shipping (3–7 business days) — free</li>
                        <li>Priority shipping — available at an additional cost shown at checkout</li>
                        <li>Priority overnight shipping — available at an additional cost shown at checkout</li>
                    </ul>
                    <p><strong>Pickup</strong> — collect your device from our location at 973 Harrisburg Pike, Columbus, OH 43223. Pay by bank transfer in advance, or cash at pickup.</p>

                    <h2>2. Processing Times</h2>
                    <p>Bank transfer orders are processed once payment has cleared into our account. Bank transfers typically take 1–3 business days to clear. Your order ships (or is prepared for pickup) after funds are verified — we will confirm by email when your order status changes.</p>
                    <p>Cash at pickup orders are scheduled after the order is placed. We will contact you to confirm a pickup time.</p>
                    <p>Orders are processed on business days, excluding public holidays.</p>

                    <h2>3. Delivery Timeframes</h2>
                    <div className="legal-table-wrap">
                        <table className="min-w-[480px]">
                            <thead>
                                <tr>
                                    <th>Option</th>
                                    <th>Estimated timeframe</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Standard shipping</td>
                                    <td>3–7 business days after dispatch</td>
                                </tr>
                                <tr>
                                    <td>Priority shipping</td>
                                    <td>2–3 business days</td>
                                </tr>
                                <tr>
                                    <td>Priority overnight</td>
                                    <td>Next business day, where available</td>
                                </tr>
                                <tr>
                                    <td>Pickup</td>
                                    <td>Same or next business day, once we confirm your order is ready</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>Timeframes are estimates, not guarantees, and begin once payment is verified and the order is dispatched. We will keep you updated by email, and you can check your order status any time through your account on the Site. A tracking number is provided for every shipped order.</p>

                    <h2>4. Shipping Fees</h2>
                    <ul>
                        <li>Standard shipping: free on all orders</li>
                        <li>Priority and priority overnight: rates are shown at checkout before you complete your order</li>
                        <li>Pickup: free</li>
                    </ul>
                    <p>
                        Original shipping charges are nonrefundable on returns, unless the return resulted from our error or a confirmed defect (see the{' '}
                        <Link to="/terms-conditions#returns-refunds" className="font-bold text-brand-red">Return &amp; Refund Policy</Link>{' '}
                        in our Terms &amp; Conditions).
                    </p>

                    <h2>5. Cash at Pickup</h2>
                    <p>Payment must be made in full, in cash, at handover. Please prepare the exact amount where possible, as we may not be able to provide change for large denominations.</p>
                    <p>The device remains the property of UpCell IT until payment is received in full.</p>
                    <p>You may inspect the sealed device packaging at handover before completing payment.</p>

                    <h2>6. Receiving Your Order</h2>
                    <p>Please check your order at delivery or pickup:</p>
                    <ul>
                        <li>Confirm the sealed packaging is intact and undamaged</li>
                        <li>Confirm the model, storage, and color match your order</li>
                    </ul>
                    <p>
                        If anything is wrong — damaged packaging or a wrong item — contact us at{' '}
                        <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>{' '}
                        within 48 hours of receipt. Devices damaged during shipping, or that do not function on first use, are covered under our Return &amp; Refund Policy without a restocking fee.
                    </p>

                    <h2>7. Failed &amp; Unclaimed Deliveries</h2>
                    <p>If a shipment cannot be delivered (wrong address provided, repeated failed carrier attempts, or refusal at the door), the carrier will return it to us. We will contact you to arrange reshipment or cancel the order with a refund of the product price.</p>
                    <p>Unclaimed pickup orders may be cancelled and refunded after 14 days.</p>

                    <h2>8. Trade-In Shipping (Sending Your Device to Us)</h2>
                    <p>When you accept an instant trade-in quote, you will receive instructions for getting your device to us.</p>
                    <p><strong>Shipping instructions.</strong> Full shipping instructions for sending us your device are provided by email when you accept your quote.</p>
                    <p><strong>Packaging guidance.</strong> You are responsible for packaging the device securely:</p>
                    <ul>
                        <li>Use a rigid box with padding on all sides — do not ship in an envelope</li>
                        <li>Power the device off before shipping</li>
                        <li>Do not include chargers, cases, or accessories unless requested</li>
                        <li>Remove SIM cards and sign out of iCloud / disable Find My before shipping</li>
                    </ul>
                    <p><strong>Risk in transit.</strong> Upcell IT Inc. is not responsible for trade-in devices lost or damaged in transit before they reach our facility. We strongly recommend using a trackable and insured shipping service and keeping your shipping receipt.</p>
                    <p><strong>After we receive it.</strong> We will confirm receipt by email and inspect your device. Your quote is confirmed or a revised offer sent, and payment is issued by bank transfer within 2 business days of receiving your device. If you decline a revised offer, your device will be returned to you.</p>

                    <h2>9. Return Shipping (Sending a Purchase Back)</h2>
                    <p>
                        Before mailing anything back, contact us for return authorization and shipping instructions — unauthorized returns may be delayed or refused. Unless the return resulted from our error or a confirmed defect, you are responsible for return shipping costs. Use a trackable and insured service; Upcell IT Inc. is not responsible for merchandise lost or damaged during return shipping. Full details are in the{' '}
                        <Link to="/terms-conditions#returns-refunds" className="font-bold text-brand-red">Return &amp; Refund Policy</Link>{' '}
                        in our Terms &amp; Conditions.
                    </p>
                    <p>For approved warranty claims, you pay shipping to us and UpCell IT pays the return shipping, with an average turnaround of 3–7 business days after we receive the device.</p>

                    <h2>10. Contact</h2>
                    <p>Questions about shipping, pickup, a return, or a trade-in shipment:</p>
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

export default DeliveryPolicy;

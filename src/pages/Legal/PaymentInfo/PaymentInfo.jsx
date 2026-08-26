import { Link } from 'react-router-dom';
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
        <div>
            <section>
                <div>
                    <nav>
                        <Link to="/">Home</Link>
                        
                        <span>Payment &amp; Security</span>
                    </nav>
                    <h1>Payment &amp; Security</h1>
                    <p>
                        How payment works at UpCell IT Inc. — the cards we accept, the currency we charge in, where we ship, and how your payment details are protected.
                    </p>
                </div>
            </section>

            <section>
                <div>
                    <div>
                        <h2>Cards we accept</h2>
                        <div>
                            {CARDS.map((card) => (
                                <span key={card.label}>
                                    <img src={card.src} alt={card.label} />
                                </span>
                            ))}
                        </div>
                        <p>
                            We also accept bank transfer and cash at pickup. Full payment terms are in our{' '}
                            <Link to="/terms-conditions">Terms &amp; Conditions</Link>.
                        </p>
                    </div>

                    <div>
                        <h2>Currency &amp; destinations</h2>
                        <dl>
                            <div>
                                <dt>Currency</dt>
                                <dd>US Dollars (USD)</dd>
                            </div>
                            <div>
                                <dt>We ship to</dt>
                                <dd>United States only</dd>
                            </div>
                            <div>
                                <dt>Business location</dt>
                                <dd>Columbus, OH, United States</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h2>
                            
                            Secure payments
                        </h2>
                        <ul>
                            <li>Our Site is served over an encrypted <strong>HTTPS</strong> connection.</li>
                            <li>Card payments are handled by a <strong>PCI DSS compliant</strong> payment processor.</li>
                            <li>UpCell IT Inc. <strong>does not store your full card number or card security code</strong> on our systems.</li>
                        </ul>
                    </div>

                    <div>
                        <h2>Policies &amp; support</h2>
                        <div>
                            <Link to="/return-policy">Return &amp; Refund Policy</Link>
                            <Link to="/delivery-policy">Delivery Policy</Link>
                            <Link to="/promotions">Promotions &amp; Offer Terms</Link>
                            <Link to="/terms-conditions">Terms &amp; Conditions</Link>
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <Link to="/support">Contact Support</Link>
                        </div>
                        <p>
                            UpCell IT Inc.<br />
                            973 Harrisburg Pike, Columbus, OH 43223, United States<br />
                            Phone: <a href="tel:+13802663942">+1 (380) 266-3942</a><br />
                            Email: <a href="mailto:usa.Upcells@gmail.com">usa.Upcells@gmail.com</a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PaymentInfo;

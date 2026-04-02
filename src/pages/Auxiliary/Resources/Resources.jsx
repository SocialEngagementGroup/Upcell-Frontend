import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./Resources.css";

import unlockedPhoneImg from "../../../assets/notificationInfoImages/americanExpress.svg"
import phoneconditon from "../../../assets/notificationInfoImages/phoneCondition.svg"
import warranty from "../../../assets/notificationInfoImages/warranty-modal.svg"
import rrate from "../../../assets/r-rate.svg"
import { Accordion } from 'react-bootstrap';
import { Handshake } from '@mui/icons-material';

const Resources = () => {
    return (
        <section className='resource-page'>
            <div className="resource-hero">
                <div className="container-max">
                    <h1>Resources & Blog</h1>
                    <p>Stay informed with the latest tech tips, sustainability guides, and news from the refurbished electronics world.</p>
                </div>
            </div>

            <div className='container-max'>
                <h2 className="section-title">Latest Articles</h2>
                <div className='resource-blogs'>
                    <div className="blog-card">
                        <img className="blog-image" src={unlockedPhoneImg} alt="Study apps" />
                        <div className="blog-content">
                            <h3>Enhance Your Study Experience with these 14 Smartphone Apps</h3>
                            <p>In today’s fast-paced digital era, smartphones have become an essential part of our daily lives, and made studying easier...</p>
                            <a href="#" className="blog-link">Read full article →</a>
                        </div>
                    </div>

                    <div className="blog-card">
                        <img className="blog-image" src={rrate} alt="Content creation" />
                        <div className="blog-content">
                            <h3>Boost Your Content Creation with These 11 Powerful Apps</h3>
                            <p>In today’s digital age, content creation has become an integral part of personal branding, marketing, and online presence...</p>
                            <a href="#" className="blog-link">Read full article →</a>
                        </div>
                    </div>

                    <div className="blog-card">
                        <img className="blog-image" src={warranty} alt="Battery optimization" />
                        <div className="blog-content">
                            <h3>Tips to Optimize Your Smartphone’s Battery in 2023</h3>
                            <p>In today’s fast-paced digital world, our smartphones have become an indispensable part of our lives...</p>
                            <a href="#" className="blog-link">Read full article →</a>
                        </div>
                    </div>

                    <div className="blog-card">
                        <img className="blog-image" src={phoneconditon} alt="Monetize old phones" />
                        <div className="blog-content">
                            <h3>Reasons Why You Should Monetize Your Old Smartphone in 2023</h3>
                            <p>Wondering what to do with your old smartphone? As newer, and more innovative smartphones hit the market...</p>
                            <a href="#" className="blog-link">Read full article →</a>
                        </div>
                    </div>
                </div>

                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className='accordion-container'>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>How do I contact Upcells?</Accordion.Header>
                            <Accordion.Body>
                                <p>You can contact Upcells via Facebook, Instagram, or email. For critical issues, we recommend contacting us at <a href="mailto:usa.Upcells@gmail.com">usa.Upcells@gmail.com</a>.</p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>How do I cancel an order?</Accordion.Header>
                            <Accordion.Body>
                                <p>To cancel an order, email us at <a href="mailto:usa.Upcells@gmail.com">usa.Upcells@gmail.com</a> with your Order ID. If the order hasn't shipped, we will process a full refund.</p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Where can I find my order details?</Accordion.Header>
                            <Accordion.Body>
                                <p>The "My Account" section on the top right allows you to view all past orders, tracking IDs, and shipping status once you are logged in.</p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                            <Accordion.Header>How do I get a refund?</Accordion.Header>
                            <Accordion.Body>
                                <p>Refunds are processed automatically once a return is received and inspected. The funds will be returned to your original payment method.</p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Which payment methods do you accept?</Accordion.Header>
                            <Accordion.Body>
                                <p>We accept all major credit cards including Visa, MasterCard, Discover, and American Express, as well as Klarna and PayPal for flexible payments.</p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="5">
                            <Accordion.Header>What does the warranty cover?</Accordion.Header>
                            <Accordion.Body>
                                <p>Our 30-day warranty covers technical defects and hardware failure. It does not cover accidental damage, water damage, or software modifications.</p>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>

            <div className='advices container-max' id='why-better'>
                <div className="vision-grid">
                    <div className="vision-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="vision-icon" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5c0 .501-.164.396-.415.235C6.42 6.629 6.218 6.5 6 6.5c-.218 0-.42.13-.585.235C5.164 6.896 5 7 5 6.5 5 5.672 5.448 5 6 5s1 .672 1 1.5m5.331 3a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5m-1.746-2.765C10.42 6.629 10.218 6.5 10 6.5c-.218 0-.42.13-.585.235C9.164 6.896 9 7 9 6.5c0-.828.448-1.5 1-1.5s1 .672 1 1.5c0 .501-.164.396-.415.235z" />
                        </svg>
                        <h4 className="vision-header">Customers First</h4>
                        <p className="vision-text">We are customer-focused and continuously measure our success by your satisfaction.</p>
                    </div>

                    <div className="vision-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="vision-icon" viewBox="0 0 16 16">
                            <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z" />
                        </svg>
                        <h4 className="vision-header">Eco-Conscious</h4>
                        <p className="vision-text">Reducing electronic waste by giving high-quality technology a second life.</p>
                    </div>

                    <div className="vision-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="vision-icon" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                        </svg>
                        <h4 className="vision-header">Built on Trust</h4>
                        <p className="vision-text">Total transparency through every interaction with our customers and partners.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resources;
import "./ContactUs.css";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Accordion } from "react-bootstrap";

const Contactus = () => {
    const handleContact = (e) => {
        e.preventDefault();
        // Handle form submission logic
    };

    return (
        <section className="contact-page">
            <div className="contact-hero">
                <div className="container-max">
                    <h1>Support Center</h1>
                    <p>We're here to help. Reach out to us through any of our channels or send us a message directly.</p>
                </div>
            </div>

            <div className="container-max">
                <div className="contact-grid">
                    <div className="contact-details-side">
                        <h2>Get in Touch</h2>
                        <div className="support-channels">
                            <a href="mailto:usa.Upcells@gmail.com" className="channel-card">
                                <div className="channel-icon">
                                    <EmailOutlinedIcon />
                                </div>
                                <div className="channel-info">
                                    <h4>Email Support</h4>
                                    <p>usa.Upcells@gmail.com</p>
                                </div>
                            </a>
                            <a href="https://www.facebook.com/usa.Upcells" target="_blank" className="channel-card">
                                <div className="channel-icon">
                                    <FacebookOutlinedIcon />
                                </div>
                                <div className="channel-info">
                                    <h4>Facebook Messenger</h4>
                                    <p>facebook.com/usa.Upcells</p>
                                </div>
                            </a>
                            <a href="https://www.instagram.com/Upcells_usa/" target="_blank" className="channel-card">
                                <div className="channel-icon">
                                    <InstagramIcon />
                                </div>
                                <div className="channel-info">
                                    <h4>Instagram Direct</h4>
                                    <p>@Upcells_usa</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <h2>Send us a Message</h2>
                        <form onSubmit={handleContact} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input id="name" type="text" placeholder="Your name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input id="email" type="email" placeholder="name@email.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input id="subject" type="text" placeholder="How can we help?" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="5" placeholder="Tell us more about your inquiry..." required />
                            </div>
                            <button type="submit" className="btn-contact-submit">Send Message</button>
                        </form>
                    </div>
                </div>

                <div className="contact-faq">
                    <h2>Frequently Asked Questions</h2>
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
                                    <p>The "My Account" section allows you to view all past orders, tracking IDs, and shipping status once you are logged in.</p>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contactus;
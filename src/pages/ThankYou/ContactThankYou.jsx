import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';

const ContactThankYou = () => {
    // TODO(redesign): build the new contact thank-you page here.
    return (
        <div>
            <ScrollToTop />

            <h1>Thank you &mdash; message received.</h1>
            <p>
                Thanks for reaching out to UpCell. Our team has your message and typically replies
                within 24 hours. Keep an eye on your inbox for our response.
            </p>
            <Link to="/shop">Continue shopping</Link>
            <Link to="/">Back to home</Link>

            <dl>
                <dt>Response time</dt>
                <dd>Within 24 hours</dd>

                <dt>Need it faster?</dt>
                <dd>
                    <a href="https://www.facebook.com/usa.Upcells" target="_blank" rel="noreferrer">
                        Message us on Facebook
                    </a>
                </dd>

                <dt>Track an order?</dt>
                <dd><Link to="/myaccount">Go to my account</Link></dd>
            </dl>
        </div>
    );
};

export default ContactThankYou;

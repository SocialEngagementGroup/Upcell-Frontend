import React from 'react';
import './NewsletterSignup.css';

const NewsletterSignup = () => {
    return (
        <section className="newsletter-signup">
            <div className="container-max">
                <div className="signup-content">
                    <h2>Stay ahead of the curve.</h2>
                    <p>Get the latest Apple updates, device drops, and exclusive offers delivered to your inbox.</p>
                    
                    <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="email-input"
                            required
                        />
                        <button type="submit" className="subscribe-btn">Subscribe</button>
                    </form>
                    
                    <p className="privacy-text">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;

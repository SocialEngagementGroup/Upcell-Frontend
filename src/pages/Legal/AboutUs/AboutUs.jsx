import { Handshake } from "@mui/icons-material";
import "./AboutUs.css"

const AboutUs = () => {
    return (
        <div className="about-us-page">
            <section className="about-hero">
                <div className="container-max">
                    <h1>Tech with a <span>Conscience</span></h1>
                    <p>We are a team of technicians and entrepreneurs specializing in sourcing quality electronics at competitive prices, with over 15 years of industry experience.</p>
                </div>
            </section>

            <section className="mission-section">
                <div className="container-max">
                    <div className="mission-grid">
                        <div className="mission-content">
                            <h2>Our Mission</h2>
                            <p>
                                Welcome to UpCell. We specialize in sourcing quality pre-owned products at competitive prices, aiming to make premium technology accessible to everyone.
                                We pride ourselves on honesty, quality, and a commitment to longevity. Our products are fairly priced and accurately represented, because we believe in quality over quantity.
                            </p>
                        </div>
                        <div className="mission-image">
                            {/* Placeholder for a mission-related image or illustration */}
                            <img src="/staticImages/bgAboutUs.png" alt="About UpCell" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-medium)' }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="values-section">
                <div className="container-max">
                    <div className="values-header">
                        <h2>Our Core Values</h2>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                            </div>
                            <h4>Customer First</h4>
                            <p>Treat customers great and great customers will treat you well. We are customer-focused and measure ourselves against their success.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            </div>
                            <h4>Earn Trust</h4>
                            <p>Be honest and transparent through every interaction with customers, employees, and partners. Trust is our most valuable asset.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                            </div>
                            <h4>Simplify</h4>
                            <p>Never settle for what has been done. Be creative and innovative using first-principle thinking while reducing complexity.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <h4>Responsible Growth</h4>
                            <p>Make environmentally sustainable decisions that last for generations through recycling, reusing, or trading.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Handshake />
                            </div>
                            <h4>True Collaboration</h4>
                            <p>We build positive culture and family spirit. Inclusive environments where all ideas are heard and valued.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                            </div>
                            <h4>Do Good</h4>
                            <p>Be kind and take care of your neighbor. Do what is right, do what is good, and find balance in all things.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
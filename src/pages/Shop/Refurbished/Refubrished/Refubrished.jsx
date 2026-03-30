import React from 'react';
import "./Refubrished.css"

const Refubrished = () => {
    return (
        <div className="refurbished-page">
            <section className="refurb-hero">
                <div className="container-max">
                    <h1>Refurbished <span>iPhones</span></h1>
                    <p>Exceptional quality, unbeatable prices. Restored to a higher standard.</p>
                </div>
            </section>

            <main className="container-max">
                <section className="coming-soon-section">
                    <div className="coming-soon-card">
                        <h2>Selection Arriving Soon</h2>
                        <p>
                            Our team is currently refurbishing a fresh batch of premium iPhones. 
                            Every device undergoes a 50+ point inspection before being certified for sale.
                        </p>
                        <form className="notify-form" onSubmit={(e) => { e.preventDefault(); alert("We'll notify you!"); }}>
                            <input type="email" placeholder="Enter your email for early access" required />
                            <button type="submit">Notify Me</button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Refubrished;
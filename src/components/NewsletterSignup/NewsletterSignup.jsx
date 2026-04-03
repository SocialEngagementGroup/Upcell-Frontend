import React from 'react';

const NewsletterSignup = () => {
    return (
        <section className="px-4 py-14 md:px-6 md:py-20">
            <div className="page-container">
                <div className="premium-card mx-auto max-w-[760px] rounded-[40px] bg-white/80 px-8 py-10 text-center md:px-12 md:py-14">
                    <span className="eyebrow mb-5">Newsletter</span>
                    <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] text-apple-text">Get Notified When New Refurbished Apple Devices Arrive</h2>
                    <p className="mx-auto mb-8 max-w-[540px] text-base leading-8 text-ink-soft">Be first to know about fresh certified refurbished iPhone, iPad, and MacBook inventory, trade-in value boosts, and limited-stock finds.</p>
                    
                    <form className="flex gap-3 mb-6 max-sm:flex-col" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="premium-input flex-1"
                            required
                        />
                        <button type="submit" className="premium-button max-sm:w-full">Subscribe</button>
                    </form>
                    
                    <p className="!text-[13px] opacity-80 text-apple-gray">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;

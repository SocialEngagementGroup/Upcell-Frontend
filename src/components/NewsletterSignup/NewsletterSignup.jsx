import React from 'react';

const NewsletterSignup = () => {
    return (
        <section className="py-[120px] bg-white">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="text-center max-w-[600px] mx-auto">
                    <h2 className="text-4xl font-extrabold text-apple-text mb-4 tracking-[-0.02em]">Stay ahead of the curve.</h2>
                    <p className="text-base leading-relaxed text-apple-gray mb-8">Get the latest Apple updates, device drops, and exclusive offers delivered to your inbox.</p>
                    
                    <form className="flex gap-3 mb-6 max-sm:flex-col" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 bg-surface-alt border-none rounded-xl px-6 py-[18px] text-base text-apple-text outline-none transition-colors duration-200 focus:bg-border-faint"
                            required
                        />
                        <button type="submit" className="bg-apple-text text-white px-8 py-[18px] rounded-xl text-base font-bold transition-all duration-200 hover:bg-black max-sm:w-full">Subscribe</button>
                    </form>
                    
                    <p className="!text-[13px] opacity-80 text-apple-gray">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;

const ReturnPolicy = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <span className="eyebrow mb-5">Returns</span>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">Returns and refunds with a simple 30-day window.</h1>
                    <p className="mt-5 max-w-[640px] text-lg leading-8 text-ink-soft">
                        If something is not right, reach out and we’ll guide the next steps clearly.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <article className="legal-prose premium-card rounded-[36px] px-8 py-10 md:px-12 md:py-14">
                    <p>You have 30 days from delivery to request a return. The fastest route is to email support with your order information and reason for the request.</p>
                    <h2>How to start a return</h2>
                    <ol>
                        <li>Email <a href="mailto:usa.Upcells@gmail.com" className="font-bold text-brand-red">usa.Upcells@gmail.com</a>.</li>
                        <li>Use a subject line like: <strong>Product Return Request - [Your Order ID]</strong>.</li>
                        <li>Include your name, address, order date, return date, and preferred return carrier if applicable.</li>
                        <li>Attach any supporting photos or notes that help explain the request.</li>
                    </ol>
                    <h2>After you contact us</h2>
                    <p>Our team reviews the request and replies with the next steps, including packaging and shipping guidance when needed.</p>
                    <p>If you have questions or concerns, include them in your email and we’ll help you through the process.</p>
                </article>
            </section>
        </div>
    );
};

export default ReturnPolicy;

import React from 'react';

const HomeTrustFeatures = () => {
    const features = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="12" fill="#F5F5F7"/>
                    <path d="M24 16L26.45 21.45L32 22.27L28 26.12L28.94 31.73L24 29.13L19.06 31.73L20 26.12L16 22.27L21.55 21.45L24 16Z" fill="#1D1D1F" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            title: "100-Point Quality Check",
            description: "Every device is inspected by our certified technicians for peak performance."
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="12" fill="#F5F5F7"/>
                    <path d="M16 20H28L32 24V32H28M16 20V32H20M16 20H12V28H16M20 32C20 33.1 20.9 34 22 34C23.1 34 24 33.1 24 32M20 32H24M28 32C28 33.1 28.9 34 30 34C31.1 34 32 33.1 32 32M28 32H32M32 24H36V28H32" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            title: "Fast, Secure Shipping",
            description: "Fully insured next-day delivery on all orders placed before 3 PM."
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="12" fill="#F5F5F7"/>
                    <path d="M18 18L30 30M18 30L30 18M24 12V36M12 24H36" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            title: "Competitive Pricing",
            description: "We offer the best value in the secondary market, guaranteed."
        }
    ];

    return (
        <section className="px-4 py-14 md:px-6 md:py-24">
            <div className="page-container">
                <div className="mb-10 text-center">
                    <h2>Confidence built into every order.</h2>
                </div>
                <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
                    {features.map((feature, index) => (
                        <div key={index} className="premium-card flex flex-col items-center rounded-[32px] p-8 text-center">
                            <div className="mb-6 flex justify-center items-center">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-apple-text mb-3">{feature.title}</h3>
                            <p className="max-w-[280px] text-[15px] leading-7 text-ink-soft">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeTrustFeatures;

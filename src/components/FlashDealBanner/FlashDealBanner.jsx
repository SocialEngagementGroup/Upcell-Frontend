import React from 'react';

const FlashDealBanner = () => {
    return (
        <section className="px-4 py-12 md:px-6 md:py-16">
            <div className="page-container">
                <div className="premium-card relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#ffffff_0%,#f1f3f6_56%,#e7ebf0_100%)] px-8 py-10 md:px-12 md:py-14">
                    <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
                        <div className="relative z-[2]">
                            <span className="eyebrow mb-5">Limited Offer</span>
                            <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95]">Premium devices. Smarter seasonal pricing.</h2>
                            <p className="mt-5 max-w-[560px] text-lg leading-8 text-ink-soft">
                                Use <span className="rounded-full bg-apple-text px-3 py-1 text-sm font-bold tracking-[0.08em] text-white">UPCELL15</span> for an additional 15% off selected Apple products.
                            </p>
                            <button className="premium-button mt-8">Shop the Offer</button>
                        </div>
                        <div className="relative flex items-center justify-center">
                            <div className="flex h-[260px] w-[260px] items-center justify-center rounded-full border border-white/80 bg-white/75 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                                <div className="text-center">
                                    <div className="text-[62px] font-extrabold tracking-[-0.08em] text-apple-text">15%</div>
                                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-apple-gray">Seasonal saving</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashDealBanner;

import React from 'react';
import { Link } from 'react-router-dom';

const TradeInAction = () => {
    const popularTradeIns = [
        { model: "iPhone 14 Pro Max", value: "$750" },
        { model: "iPhone 13 Pro", value: "$520" },
        { model: "Samsung S23 Ultra", value: "$640" }
    ];

    return (
        <section className="px-4 py-12 md:px-6 md:py-16">
            <div className="page-container overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#111214_0%,#1f2126_45%,#2d3138_100%)] px-8 py-10 text-white shadow-medium md:px-12 md:py-14">
                <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">Trade In</span>
                        <h2 className="mt-6 text-[clamp(2.4rem,4.7vw,4.8rem)] leading-[0.95] text-white">Your next Apple device can cost less.</h2>
                        <p className="mt-6 max-w-[580px] text-lg leading-8 text-white/72">
                            Exchange your current phone, tablet, or laptop in a cleaner, more transparent flow. Instant estimates, prepaid shipping, and faster payouts.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/sell-device" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-apple-text transition-all duration-300 hover:-translate-y-0.5">
                                Get Your Estimate
                            </Link>
                            <Link to="/shop" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                                Upgrade the Premium Way
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
                        <h4 className="text-lg font-bold text-white">Popular Trade-ins</h4>
                        <p className="mt-2 text-sm leading-7 text-white/60">Indicative values for devices in strong condition.</p>
                        <div className="mt-8 flex flex-col gap-5">
                            {popularTradeIns.map((item, index) => (
                                <div key={index} className="flex items-center justify-between rounded-[24px] border border-white/8 bg-black/10 px-5 py-4">
                                    <span className="text-base font-medium text-white">{item.model}</span>
                                    <span className="text-base font-bold text-white">Up to {item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
                            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">What’s included</div>
                            <div className="mt-3 text-sm leading-7 text-white/72">Free prepaid label, secure wipe guidance, and payment within 24 hours of inspection.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeInAction;

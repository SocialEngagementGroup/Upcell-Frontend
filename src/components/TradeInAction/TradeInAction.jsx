import React from 'react';
import { Link } from 'react-router-dom';

const TradeInAction = () => {
    const popularTradeIns = [
        { model: "iPhone 14 Pro Max", value: "$750" },
        { model: "iPhone 13 Pro", value: "$520" },
        { model: "Samsung S23 Ultra", value: "$640" }
    ];

    return (
        <section className="px-4 py-14 md:px-6 md:py-24">
            <div className="page-container relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#111214_0%,#1f2126_45%,#2d3138_100%)] px-8 py-14 text-center text-white shadow-medium md:px-16 md:py-24">
                <div className="mx-auto flex max-w-[940px] flex-col items-center">
                    <h2 className="text-[clamp(2.3rem,4.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-tight text-white">
                        Trade In Your Apple Device
                        <br />
                        Upgrade for Less
                    </h2>
                    <p className="mt-8 text-lg leading-8 text-white/60 md:text-xl md:leading-9 max-w-[700px] mx-auto">
                        Get an instant trade-in quote for your used iPhone, iPad, or MacBook. Free prepaid shipping, fully insured transit, and payout within 24 hours of inspection.
                    </p>
                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Link to="/trade-in" className="inline-flex h-[56px] items-center justify-center rounded-full bg-white px-10 text-[15px] font-black text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] min-w-[220px]">
                            Get Your Trade-In Quote
                        </Link>
                        <Link to="/shop" className="inline-flex h-[56px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-[15px] font-black text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 min-w-[220px]">
                            Shop Premium Apple
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeInAction;

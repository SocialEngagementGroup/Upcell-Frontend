import React from 'react';
import { Link } from 'react-router-dom';

const TradeInAction = () => {
    const popularTradeIns = [
        { model: "iPhone 14 Pro Max", value: "$750" },
        { model: "iPhone 13 Pro", value: "$520" },
        { model: "Samsung S23 Ultra", value: "$640" }
    ];

    return (
        <section className="px-4 py-16 md:px-6 md:py-20">
            <div className="page-container relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#111214_0%,#1f2126_45%,#2d3138_100%)] px-8 py-14 text-center text-white shadow-medium md:px-16 md:py-24">
                <div className="mx-auto flex max-w-[840px] flex-col items-center">
                    <h2 className="text-[clamp(2.6rem,5.4vw,5.6rem)] font-extrabold leading-[1.02] tracking-tight text-white">Your next Apple device <br className="hidden md:block" /> can cost less.</h2>
                    <p className="mt-8 text-lg leading-8 text-white/60 md:text-xl md:leading-9">
                        Exchange your current phone, tablet, or laptop in a cleaner, more transparent flow. 
                        Instant estimates, prepaid shipping, and faster payouts.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-5">
                        <Link to="/sell-device" className="premium-button min-w-[220px]">
                            Get Your Estimate
                        </Link>
                        <Link to="/shop" className="premium-button min-w-[220px]">
                            Upgrade the Premium Way
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeInAction;

import React from 'react';
import { Link } from 'react-router-dom';

const TradeInAction = () => {
    const popularTradeIns = [
        { model: "iPhone 14 Pro Max", value: "$750" },
        { model: "iPhone 13 Pro", value: "$520" },
        { model: "Samsung S23 Ultra", value: "$640" }
    ];

    return (
        <section className="py-[120px] bg-black text-white overflow-hidden">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="flex justify-between items-center gap-20 max-lg:flex-col max-lg:text-center max-lg:gap-[60px]">
                    {/* Left Content */}
                    <div className="flex-[1.5]">
                        <h2 className="text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.1] mb-8 tracking-[-0.03em]">Trade-In and Save. <br />Up to $800 back.</h2>
                        <p className="text-xl leading-relaxed text-apple-gray max-w-[540px] mb-12 max-lg:mx-auto">
                            Turn your current device into credit toward your next upgrade.
                            It's better for the planet and your wallet. Get an instant valuation in seconds.
                        </p>
                        <button className="bg-white text-black px-12 py-[18px] rounded-xl text-lg font-bold transition-all duration-300 ease-smooth hover:bg-surface-alt hover:-translate-y-0.5">Get Valuation</button>
                    </div>

                    {/* Right Sidebar */}
                    <div className="flex-1 max-w-[450px] max-lg:max-w-full max-lg:w-full">
                        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-3xl p-10">
                            <h4 className="text-lg font-bold mb-8 text-white">Popular Trade-ins</h4>
                            <div className="flex flex-col gap-6">
                                {popularTradeIns.map((item, index) => (
                                    <div key={index} className={`flex justify-between items-center ${index < popularTradeIns.length - 1 ? 'border-b border-white/10 pb-4' : ''}`}>
                                        <span className="text-base font-medium text-white">{item.model}</span>
                                        <span className="text-base font-bold text-brand-red">Up to {item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeInAction;

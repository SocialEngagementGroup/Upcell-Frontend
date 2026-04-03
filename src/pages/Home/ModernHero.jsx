import React from 'react';
import { Link } from 'react-router-dom';

const ModernHero = () => {
    return (
        <section className="relative h-[calc(100vh-72px)] min-h-[720px] w-full overflow-hidden bg-[#000000] text-white md:h-[calc(100vh-72px)]">
            <div className="relative flex h-full w-full items-center overflow-hidden px-8 py-12 md:px-14 md:py-16">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="page-container grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.82fr]">
                    <div className="animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
                        <h1 className="section-heading max-w-[720px] text-white">
                            Certified Refurbished iPhone, iPad & MacBook
                            <span className="block text-white/40">Inspected. Graded. Ready to ship.</span>
                        </h1>
                        <p className="mt-6 max-w-[540px] text-lg leading-8 text-white/60">
                            Shop certified pre-owned Apple devices with transparent condition grading, a 12-month warranty, and save up to 40% vs. new. Plus, get an instant trade-in quote for your current device.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link to="/shop" className="inline-flex h-[56px] items-center justify-center rounded-full bg-white px-10 text-[15px] font-black text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] min-w-[220px]">
                                Shop Refurbished Apple
                            </Link>
                            <Link to="/trade-in" className="inline-flex h-[56px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-[15px] font-black text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 min-w-[220px]">
                                Get Trade-In Value
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex min-h-[520px] items-center justify-center animate-[fadeInRight_1s_cubic-bezier(0.16,1,0.3,1)]">
                        <div className="absolute inset-x-0 aspect-square w-full rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_transparent_72%)] blur-3xl" />
                        <div className="relative flex w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[44px] border border-white/10 bg-white/[0.02] px-8 py-10 backdrop-blur-3xl">
                            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <img
                                src="/staticImages/hero-iphone15.png"
                                alt="Certified refurbished iPhone — UpCell pre-owned Apple devices"
                                className="relative z-[2] w-full max-w-[420px] animate-[floatSoft_5.5s_ease-in-out_infinite] object-contain drop-shadow-[0_45px_100px_rgba(255,255,255,0.08)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModernHero;

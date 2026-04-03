import React from 'react';
import { Link } from 'react-router-dom';

const ModernHero = () => {
    return (
        <section className="relative overflow-hidden px-4 pb-12 pt-6 md:px-6 md:pb-16">
            <div className="page-container premium-card relative overflow-hidden rounded-[44px] border-white/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(245,246,248,0.82)_42%,_rgba(233,236,240,0.9)_100%)] px-8 py-12 md:px-14 md:py-16">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
                    <div className="animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
                        <span className="eyebrow mb-6">Curated Apple Collection</span>
                        <h1 className="section-heading max-w-[720px]">
                            Premium Apple devices,
                            <span className="block text-black/50">restored to feel timeless.</span>
                        </h1>
                        <p className="mt-6 max-w-[560px] text-lg leading-8 text-ink-soft">
                            Discover certified iPhone, iPad, and MacBook models presented with quiet luxury, transparent condition grading, and a smoother path to upgrade.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link to="/shop" className="premium-button">
                                Explore the Store
                            </Link>
                            <Link to="/sell-device" className="premium-button-secondary">
                                Start a Trade-In
                            </Link>
                        </div>
                        <div className="mt-12 grid gap-4 sm:grid-cols-3">
                            {[
                                { value: '100+', label: 'Checks before dispatch' },
                                { value: '1 Year', label: 'Warranty included' },
                                { value: 'Fast', label: 'Insured delivery' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-[28px] border border-white/70 bg-white/70 px-5 py-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
                                    <div className="text-2xl font-extrabold text-apple-text">{item.value}</div>
                                    <div className="mt-1 text-sm text-apple-gray">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex min-h-[520px] items-center justify-center animate-[fadeInRight_1s_cubic-bezier(0.16,1,0.3,1)]">
                        <div className="absolute inset-x-[8%] top-[10%] h-[76%] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.95),_rgba(213,216,221,0.3)_55%,_transparent_75%)] blur-2xl" />
                        <div className="glass-panel relative flex w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[38px] px-8 py-10">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(255,255,255,0.18))]" />
                            <img
                                src="/staticImages/hero-iphone15.png"
                                alt="Featured Apple device"
                                className="relative z-[2] w-full max-w-[420px] animate-[floatSoft_5.5s_ease-in-out_infinite] object-contain drop-shadow-[0_35px_80px_rgba(15,23,42,0.18)]"
                            />
                        </div>
                        <div className="absolute left-0 top-8 hidden max-w-[180px] rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-soft md:block">
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-apple-gray">Condition</div>
                            <div className="mt-2 text-2xl font-extrabold text-apple-text">Excellent</div>
                            <p className="mt-1 text-sm text-ink-soft">Precision inspected exterior and battery health checked.</p>
                        </div>
                        <div className="absolute bottom-8 right-0 hidden max-w-[190px] rounded-[28px] bg-apple-text p-5 text-white shadow-[0_24px_80px_rgba(29,29,31,0.24)] md:block">
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">UpCell Care</div>
                            <div className="mt-2 text-2xl font-extrabold">365 days</div>
                            <p className="mt-1 text-sm leading-6 text-white/72">Warranty coverage and priority support included.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModernHero;

import React from 'react';
import { Link } from 'react-router-dom';

const CategoryShelf = () => {
    return (
        <section className="px-4 py-8 md:px-6 md:py-10">
            <div className="page-container">
                <div className="mb-8 flex items-end justify-between gap-5">
                    <div>
                        <span className="eyebrow mb-4">Collections</span>
                        <h2 className="text-[clamp(2.1rem,4vw,4rem)] leading-[0.96]">Apple products, arranged like a gallery.</h2>
                    </div>
                    <Link to="/shop" className="kicker-link hidden md:inline-flex">Browse every device</Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="premium-card relative overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f4f5f7_100%)] p-8 md:p-10">
                        <div className="relative z-[2] max-w-[320px]">
                            <span className="eyebrow mb-5">Signature</span>
                            <h3 className="mb-3">iPhone</h3>
                            <p className="mb-8 text-base leading-7 text-ink-soft">Beautifully graded iPhone models with battery transparency, secure setup, and trade-in ready pricing.</p>
                            <Link to="/shop?category=iPhone" className="premium-button-secondary">
                                Explore iPhone
                            </Link>
                        </div>
                        <img src="/staticImages/category-iphone.png" alt="iPhone" className="pointer-events-none absolute bottom-0 right-0 w-[58%] max-w-[360px] object-contain drop-shadow-[0_35px_60px_rgba(15,23,42,0.16)]" />
                    </div>

                    <div className="grid gap-6">
                        <div className="premium-card relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f8f8fa_0%,#ffffff_100%)] p-8 md:p-10">
                            <div className="relative z-[2] max-w-[320px]">
                                <span className="eyebrow mb-5">Portable Power</span>
                                <h3 className="mb-3">iPad</h3>
                                <p className="mb-8 text-base leading-7 text-ink-soft">From creative work to everyday flow, our iPad selection balances portability with long-term value.</p>
                                <Link to="/shop?category=iPad" className="premium-button-secondary">
                                    Shop iPad
                                </Link>
                            </div>
                            <img src="/staticImages/category-ipad.png" alt="iPad" className="pointer-events-none absolute bottom-0 right-6 w-[42%] max-w-[250px] object-contain drop-shadow-[0_35px_60px_rgba(15,23,42,0.14)]" />
                        </div>

                        <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#0f1012_0%,#1f2227_100%)] p-8 text-white shadow-medium md:p-10">
                            <div className="relative z-[2] max-w-[320px]">
                                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">Performance</span>
                                <h3 className="mb-3 mt-5 text-white">MacBook</h3>
                                <p className="mb-8 text-base leading-7 text-white/70">Quietly powerful MacBook configurations, chosen for speed, battery life, and impeccable daily use.</p>
                                <Link to="/shop?category=MacBook" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-apple-text transition-all duration-300 hover:-translate-y-0.5">
                                    Shop MacBook
                                </Link>
                            </div>
                            <img src="/staticImages/category-macbook.png" alt="MacBook" className="pointer-events-none absolute bottom-0 right-0 w-[56%] max-w-[330px] object-contain opacity-95 drop-shadow-[0_45px_80px_rgba(0,0,0,0.45)]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShelf;

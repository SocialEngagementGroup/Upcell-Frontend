import React from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CategoryShelf = () => {
    return (
        <section className="px-4 py-14 md:px-6 md:py-24">
            <div className="page-container">
                <div className="mb-8 flex items-end justify-between gap-5">
                    <div>
                        <h2 className="text-[clamp(2.1rem,4vw,4rem)] leading-[0.96]">Certified Refurbished Apple <br className="hidden md:block" /> Shop by Device</h2>
                    </div>
                    <Link
                        to="/shop"
                        className="hidden items-center gap-2 text-sm font-bold tracking-[0.02em] text-apple-gray transition-colors duration-200 hover:text-apple-text md:inline-flex"
                    >
                        <span>Browse every device</span>
                        <ArrowForwardIcon className="!text-[18px]" />
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Link 
                        to="/shop?category=iPhone" 
                        className="premium-card group relative flex min-h-[440px] items-center overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f4f5f7_100%)] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-medium"
                    >
                        <div className="relative z-[2] max-w-[340px]">
                            <h3 className="mb-4 text-[42px]">iPhone</h3>
                            <p className="mb-8 text-lg leading-8 text-ink-soft">Certified refurbished iPhones from iPhone 11 through iPhone 16 Pro Max — battery health disclosed, unlocked options available, and trade-in pricing included.</p>
                            <span className="text-[15px] font-bold tracking-tight text-apple-text underline-offset-8 group-hover:underline">Shop Refurbished iPhone →</span>
                        </div>
                        <img src="/staticImages/category-iphone.png" alt="iPhone" className="pointer-events-none absolute -bottom-4 -right-10 w-[64%] max-w-[420px] object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_35px_60px_rgba(15,23,42,0.16)]" />
                    </Link>

                    <div className="grid gap-6">
                        <Link 
                            to="/shop?category=iPad" 
                            className="premium-card group relative flex min-h-[220px] items-center overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#f8f8fa_0%,#ffffff_100%)] p-10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-medium"
                        >
                            <div className="relative z-[2] max-w-[280px]">
                                <h3 className="mb-3">iPad</h3>
                                <p className="mb-6 text-sm leading-7 text-ink-soft">Pre-owned iPad Air, iPad mini, and iPad Pro — inspected and graded, with Wi-Fi and cellular options at honest prices.</p>
                                <span className="text-sm font-bold text-apple-text underline-offset-4 group-hover:underline">Shop Refurbished iPad →</span>
                            </div>
                            <img src="/staticImages/category-ipad.png" alt="iPad" className="pointer-events-none absolute -bottom-6 -right-4 w-[42%] max-w-[220px] object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_35px_60px_rgba(15,23,42,0.14)]" />
                        </Link>

                        <Link 
                            to="/shop?category=MacBook" 
                            className="premium-card group relative flex min-h-[220px] items-center overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#0f1012_0%,#1f2227_100%)] p-10 text-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-medium"
                        >
                            <div className="relative z-[2] max-w-[280px]">
                                <h3 className="mb-3 text-white">MacBook</h3>
                                <p className="mb-6 text-sm leading-7 text-white/70">Refurbished MacBook Air and MacBook Pro with M1, M2, and M3 chips — professionally tested and ready to ship at a fraction of retail.</p>
                                <span className="text-sm font-bold text-white underline-offset-4 group-hover:underline">Shop Refurbished MacBook →</span>
                            </div>
                            <img src="/staticImages/category-macbook.png" alt="MacBook" className="pointer-events-none absolute -bottom-4 -right-2 w-[54%] max-w-[300px] object-contain opacity-95 transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_45px_80px_rgba(0,0,0,0.45)]" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShelf;

import React from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import JournalCard from '../../../components/JournalCard/JournalCard';
import { blogData } from '../../../data/blogData';

const Resources = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Blogs</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">Premium Apple Buying Guides, Trade-In Tips & Device Care Resources</h1>
                    <p className="mt-5 max-w-[700px] text-lg leading-8 text-ink-soft">
                        Practical guides on buying certified premium iPhones, iPads, and MacBooks — plus trade-in advice, condition grading explained, and tips to get the most from your premium Apple device.
                    </p>
                </div>
            </section>

            <section className="page-container pb-24">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogData.map((article, index) => (
                        <JournalCard key={index} article={article} />
                    ))}
                </div>

                {blogData.length > 9 && (
                    <div className="mt-20 flex items-center justify-center gap-2">
                        <button className="h-12 w-12 rounded-xl border border-apple-gray/10 flex items-center justify-center hover:bg-apple-gray/5 transition-colors">
                            <KeyboardArrowRightIcon className="rotate-180 !text-lg" />
                        </button>
                        {[1, 2, 3].map((num) => (
                            <button 
                                key={num}
                                className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${num === 1 ? 'bg-apple-text text-white' : 'border border-apple-gray/10 text-apple-gray hover:bg-apple-gray/5'}`}
                            >
                                {num}
                            </button>
                        ))}
                        <button className="h-12 w-12 rounded-xl border border-apple-gray/10 flex items-center justify-center hover:bg-apple-gray/5 transition-colors">
                            <KeyboardArrowRightIcon className="!text-lg" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Resources;

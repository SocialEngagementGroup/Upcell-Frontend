import React from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import JournalCard from '../JournalCard/JournalCard';
import { blogData } from '../../data/blogData';

const JournalInsights = () => {
    // Show only the first 3 blogs on the home page
    const featuredBlogs = blogData.slice(0, 3);

    return (
        <section className="px-4 py-14 md:px-6 md:py-24 bg-transparent overflow-hidden">
            <div className="page-container">
                <div className="mb-14 flex items-center justify-between border-b border-apple-gray/5 pb-6">
                    <h2 className="text-[clamp(2rem,3.2vw,3.2rem)] leading-none tracking-tight font-black">Latest from the blog</h2>
                    <Link 
                        to="/blogs" 
                        className="group flex items-center gap-2 text-sm font-bold text-apple-gray hover:text-apple-text transition-colors"
                    >
                        View All Blogs
                        <ArrowForwardIcon className="!text-sm transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {featuredBlogs.map((article, index) => (
                        <JournalCard key={index} article={article} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JournalInsights;

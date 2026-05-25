import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { blogData } from '../../../data/blogData';
import ScrollToTop from '../../../utilities/ScrollToTop';

const JournalPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const article = blogData.find(post => post.slug === slug);

    useEffect(() => {
        if (!article) {
            navigate('/blogs');
        }
    }, [article, navigate]);

    if (!article) return null;

    return (
        <div className="page-shell">
            <ScrollToTop />
            
            <section className="page-container pb-10 pt-6">
                <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                    <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                    <KeyboardArrowRightIcon className="!text-sm" />
                    <Link to="/blogs" className="hover:text-apple-text transition-colors">Blogs</Link>
                    <KeyboardArrowRightIcon className="!text-sm" />
                    <span className="text-apple-text truncate max-w-[200px] md:max-w-none">{article.title}</span>
                </nav>

                <div className="relative h-[260px] sm:h-[400px] md:h-[600px] w-full overflow-hidden rounded-[24px] sm:rounded-[40px] bg-apple-gray/5 shadow-medium">
                    <img 
                        src={article.image} 
                        alt={article.title} 
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            </section>

            <section className="page-container pb-16 sm:pb-24">
                <div className="mx-auto max-w-[800px]">
                    <div className="mb-8 border-b border-apple-gray/5 pb-8 sm:mb-12 sm:pb-12">
                        <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">
                            Posted on {article.date}
                        </div>
                        <h1 className="text-[clamp(2rem,5vw,4.4rem)] leading-[1.1] tracking-tight sm:leading-[1.05]">{article.title}</h1>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        {article.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6 text-lg leading-relaxed text-ink-soft last:mb-0 sm:mb-8 sm:text-xl">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="mt-12 border-t border-apple-gray/5 pt-8 sm:mt-20 sm:pt-12">
                        <Link 
                            to="/blogs" 
                            className="group flex items-center gap-3 text-lg font-bold text-apple-text"
                        >
                            <ArrowBackIcon className="transition-transform group-hover:-translate-x-1" />
                            Back to Blogs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JournalPost;

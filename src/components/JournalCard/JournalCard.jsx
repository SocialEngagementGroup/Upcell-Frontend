import React from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const JournalCard = ({ article }) => {
    return (
        <Link 
            to={`/journal/${article.slug}`}
            className="premium-card group flex flex-col overflow-hidden rounded-[40px] bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-medium h-full"
        >
            <div className="h-[240px] w-full overflow-hidden rounded-[32px] bg-apple-gray/5 shrink-0">
                <img 
                    src={article.image} 
                    alt={article.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
            </div>
            <div className="mt-8 flex flex-1 flex-col items-start">
                <div className="space-y-4 mb-6">
                    <h3 className="text-[22px] font-black leading-[1.3] text-apple-text line-clamp-2">{article.title}</h3>
                    <p className="line-clamp-3 text-sm leading-7 text-ink-soft opacity-70">
                        {article.body || article.excerpt}
                    </p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[15px] font-black text-apple-text transition-opacity group-hover:opacity-80">
                    Read More
                    <ArrowForwardIcon className="!text-sm transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

export default JournalCard;

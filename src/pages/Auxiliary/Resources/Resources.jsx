import React from 'react';
import { Link } from 'react-router-dom';
import { blogData } from '../../../data/blogData';

const Resources = () => {
    // TODO(redesign): build the new blog index UI here.
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <span>Blogs</span>
            </nav>

            <h1>Premium Apple Buying Guides, Trade-In Tips &amp; Device Care Resources</h1>
            <p>
                Practical guides on buying certified premium iPhones, iPads, and MacBooks, plus
                trade-in advice, condition grading explained, and tips to get the most from your
                premium Apple device.
            </p>

            {/* TODO(redesign): the JournalCard component was deleted with the old
                design. Rebuild it under src/components/ and map over blogData here. */}
            <ul>
                {blogData.map((article, index) => (
                    <li key={index}>
                        <Link to={`/blogs/${article.slug}`}>{article.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Resources;

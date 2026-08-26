import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

    // TODO(redesign): build the new blog post UI here.
    return (
        <div>
            <ScrollToTop />

            <nav>
                <Link to="/">Home</Link>
                <Link to="/blogs">Blogs</Link>
                <span>{article.title}</span>
            </nav>

            <img src={article.image} alt={article.title} />

            <p>Posted on {article.date}</p>
            <h1>{article.title}</h1>

            {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}

            <Link to="/blogs">Back to Blogs</Link>
        </div>
    );
};

export default JournalPost;

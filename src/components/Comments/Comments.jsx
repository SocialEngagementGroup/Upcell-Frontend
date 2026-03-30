import React from 'react'
import "./Comments.css"

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const Comments = () => {
    const reviews = [
        {
            name: "Tawhid Rifat",
            date: "03/05/2023",
            text: "I got one phone, and then decided that I wanted a different one so - I have ordered, returned, gotten refunded and ordered anew with these people. And I have to say it was all seamless. I love the goal of creating less electronica waste by reusing it, and the phone that I have now works great.",
            rating: 4
        },
        {
            name: "Pat OBrien",
            date: "03/05/2023",
            text: "This was my second phone that I got from trade. The phone was described accurate and arrived quickly. No issues at all.",
            rating: 5
        },
        {
            name: "Antik",
            date: "03/05/2023",
            text: "As always the iphone does not disappoint. It is a bit expensive, but the user experience is really to notch. It feels very well made, and I have enjoyed using it so far. Battery life is excellent, the screen is beautiful, and while I haven't taken many photos yet, the cameras seem great, especially the selfie camera.",
            rating: 4
        },
        {
            name: "Shayekh",
            date: "03/05/2023",
            text: "Loving my phone! At the moment I'm needing to take photos and videos for a project and the quality is superb. It looks as if I'm still standing in the scene. Battery can sometimes last me two days even if I've been steaming video.",
            rating: 5
        }
    ];

    return (
        <section className="comments-section">
            <div className="container-max">
                <h3>CLIENTS <span>LOVED</span> IT</h3>

                <div className="comments-grid">
                    {reviews.map((review, index) => (
                        <div key={index} className="comment-card">
                            <div className="comment-author">
                                <img className="author-avatar" src="/logos/avatar.png" alt={review.name} />
                                <div className="author-info">
                                    <span className="author-name">{review.name}</span>
                                    <span className="comment-date">{review.date}</span>
                                </div>
                            </div>
                            <div className="comment-stars">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} />
                                ))}
                            </div>
                            <p className="comment-text">{review.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Comments
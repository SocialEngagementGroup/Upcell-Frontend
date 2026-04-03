import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleNewsletterSubscriber from './SingleNewsletterSubscriber';

const filters = ["all", "Active", "Unsubscribed"];

const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [email, setEmail] = useState('');

    useEffect(() => {
        axiosInstance.get(`admin-newsletter-subscribers/${activeFilter}`)
            .then((res) => setSubscribers(res.data))
            .catch((error) => console.log(error));
        setEmail('');
    }, [activeFilter]);

    const handleSearch = (event) => {
        event.preventDefault();
        setActiveFilter(`byEmail:${email}`);
    };

    const handleUpdated = (updatedSubscriber) => {
        setSubscribers((prev) => prev.map((subscriber) => subscriber._id === updatedSubscriber._id ? updatedSubscriber : subscriber));
    };

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Newsletter</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Manage newsletter subscribers.</h1>
            </div>

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={activeFilter === filter ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-[28px] bg-surface-alt p-4">
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                        <form className="flex gap-3" onSubmit={handleSearch}>
                            <input className="admin-input" type="email" placeholder="Subscriber email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className="premium-button px-5" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {subscribers.length ? (
                <div className="space-y-5">
                    {subscribers.map((subscriber) => (
                        <SingleNewsletterSubscriber key={subscriber._id} subscriber={subscriber} onUpdated={handleUpdated} />
                    ))}
                </div>
            ) : (
                <div className="admin-panel rounded-[30px] p-12 text-center">
                    <h2 className="text-[28px]">No subscribers found.</h2>
                    <p className="mt-3 text-sm text-ink-soft">Try another filter or search email.</p>
                </div>
            )}
        </section>
    );
};

export default AdminNewsletter;

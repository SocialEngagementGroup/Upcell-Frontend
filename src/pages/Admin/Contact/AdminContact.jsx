import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleContactSubmission from './SingleContactSubmission';

const filters = ["all", "New", "Resolved"];

const AdminContact = () => {
    const [submissions, setSubmissions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [email, setEmail] = useState('');

    useEffect(() => {
        axiosInstance.get(`admin-contact-submissions/${activeFilter}`)
            .then((res) => setSubmissions(res.data))
            .catch((error) => console.log(error));
        setEmail('');
    }, [activeFilter]);

    const handleUpdated = (updatedSubmission) => {
        setSubmissions((prev) => prev.map((submission) => submission._id === updatedSubmission._id ? updatedSubmission : submission));
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setActiveFilter(`byEmail:${email}`);
    };

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Contact</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Manage contact submissions.</h1>
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
                            <input className="admin-input" type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className="premium-button px-5" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {submissions.length ? (
                <div className="space-y-5">
                    {submissions.map((submission) => (
                        <SingleContactSubmission key={submission._id} submission={submission} onUpdated={handleUpdated} />
                    ))}
                </div>
            ) : (
                <div className="admin-panel rounded-[30px] p-12 text-center">
                    <h2 className="text-[28px]">No contact submissions found.</h2>
                    <p className="mt-3 text-sm text-ink-soft">Try another filter or search email.</p>
                </div>
            )}
        </section>
    );
};

export default AdminContact;

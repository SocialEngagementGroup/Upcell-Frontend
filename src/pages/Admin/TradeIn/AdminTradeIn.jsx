import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleTradeInRequest from './SingleTradeInRequest';

const tradeInStatuses = ["New", "Contacted", "Received", "Quoted", "Paid", "Closed"];

const AdminTradeIn = () => {
    const [requests, setRequests] = useState([]);
    const [activeFilter, setActiveFilter] = useState('New');
    const [email, setEmail] = useState('');
    const [requestId, setRequestId] = useState('');

    useEffect(() => {
        axiosInstance.get(`admin-trade-in-requests/${activeFilter}`)
            .then((res) => setRequests(res.data))
            .catch((error) => console.log(error));
        setEmail('');
        setRequestId('');
    }, [activeFilter]);

    const handleRequestIdSearch = (event) => {
        event.preventDefault();
        setActiveFilter(`byRequestId:${requestId}`);
    };

    const handleEmailSearch = (event) => {
        event.preventDefault();
        setActiveFilter(`byEmail:${email}`);
    };

    const handleRequestUpdated = (updatedRequest) => {
        setRequests((prev) => prev.map((request) => request._id === updatedRequest._id ? updatedRequest : request));
    };

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Trade In</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Manage trade-in requests.</h1>
            </div>

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {tradeInStatuses.map((status) => (
                            <button
                                key={status}
                                className={activeFilter === status ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => setActiveFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by request ID</div>
                            <form className="flex gap-3" onSubmit={handleRequestIdSearch}>
                                <input className="admin-input" type="text" placeholder="Trade-in request ID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
                                <button className="premium-button px-5" type="submit">Search</button>
                            </form>
                        </div>
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                            <form className="flex gap-3" onSubmit={handleEmailSearch}>
                                <input className="admin-input" type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button className="premium-button px-5" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {requests.length ? (
                <div className="space-y-5">
                    {requests.map((request) => (
                        <SingleTradeInRequest key={request._id} request={request} onStatusUpdated={handleRequestUpdated} />
                    ))}
                </div>
            ) : (
                <div className="admin-panel rounded-[30px] p-12 text-center">
                    <h2 className="text-[28px]">No trade-in requests found.</h2>
                    <p className="mt-3 text-sm text-ink-soft">Try another status or search filter.</p>
                </div>
            )}
        </section>
    );
};

export default AdminTradeIn;

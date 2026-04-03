import React, { useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';

const statuses = ["Active", "Unsubscribed"];

const SingleNewsletterSubscriber = ({ subscriber, onUpdated }) => {
    const [status, setStatus] = useState(subscriber.status);

    const handleStatusChange = async (event) => {
        const nextStatus = event.target.value;
        setStatus(nextStatus);

        try {
            const response = await axiosInstance.patch(`newsletter-subscribers/${subscriber._id}/status`, { status: nextStatus });
            onUpdated?.(response.data);
        } catch (error) {
            setStatus(subscriber.status);
            console.log(error);
        }
    };

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Email: <strong className="text-apple-text">{subscriber.email}</strong></p>
                    <p>Source: <strong className="text-apple-text">{subscriber.source || 'Unknown'}</strong></p>
                    <p>Subscribed: <strong className="text-apple-text">{new Date(subscriber.createdAt).toLocaleString()}</strong></p>
                </div>
                <div className="space-y-3">
                    <select className="admin-select" value={status} onChange={handleStatusChange}>
                        {statuses.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SingleNewsletterSubscriber;

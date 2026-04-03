import React, { useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminConfirmModal from '../../../components/AdminConfirmModal/AdminConfirmModal';

const statuses = ["Active", "Unsubscribed"];

const SingleNewsletterSubscriber = ({ subscriber, onUpdated, onDeleted }) => {
    const [status, setStatus] = useState(subscriber.status);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleStatusChange = async (event) => {
        const nextStatus = event.target.value;
        setStatus(nextStatus);

        try {
            const response = await axiosInstance.patch(`newsletter-subscribers/${subscriber._id}/status`, { status: nextStatus });
            onUpdated?.(response.data);
            toast.success(`Subscriber marked as ${nextStatus}`);
        } catch (error) {
            setStatus(subscriber.status);
            console.log(error);
            toast.error('Subscriber status update failed');
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`newsletter-subscribers/${subscriber._id}`);
            onDeleted?.(subscriber._id);
            toast.success('Subscriber deleted');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete subscriber');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
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
                    <button
                        className="w-full rounded-2xl border border-red-500/15 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            <AdminConfirmModal
                open={isDeleteModalOpen}
                title="Delete this subscriber?"
                description="This permanently removes the newsletter subscriber from your admin list."
                confirmLabel="Delete subscriber"
                isLoading={isDeleting}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default SingleNewsletterSubscriber;

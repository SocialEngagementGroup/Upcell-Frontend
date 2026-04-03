import React, { useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminConfirmModal from '../../../components/AdminConfirmModal/AdminConfirmModal';

const statuses = ["New", "Resolved"];

const SingleContactSubmission = ({ submission, onUpdated, onDeleted }) => {
    const [status, setStatus] = useState(submission.status);
    const [showMessage, setShowMessage] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleStatusChange = async (event) => {
        const nextStatus = event.target.value;
        setStatus(nextStatus);

        try {
            const response = await axiosInstance.patch(`contact-submissions/${submission._id}/status`, { status: nextStatus });
            onUpdated?.(response.data);
            toast.success(`Contact submission marked as ${nextStatus}`);
        } catch (error) {
            setStatus(submission.status);
            console.log(error);
            toast.error('Contact status update failed');
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`contact-submissions/${submission._id}`);
            onDeleted?.(submission._id);
            toast.success('Contact submission deleted');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete contact submission');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Name: <strong className="text-apple-text">{submission.name}</strong></p>
                    <p>Email: <strong className="text-apple-text">{submission.email}</strong></p>
                    <p>Subject: <strong className="text-apple-text">{submission.subject}</strong></p>
                    <p>Received: <strong className="text-apple-text">{new Date(submission.createdAt).toLocaleString()}</strong></p>
                </div>
                <div className="space-y-3">
                    <select className="admin-select" value={status} onChange={handleStatusChange}>
                        {statuses.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <button className="premium-button-secondary w-full justify-center" onClick={() => setShowMessage((prev) => !prev)}>
                        {showMessage ? 'Hide message' : 'Show message'}
                    </button>
                    <button
                        className="w-full rounded-2xl border border-red-500/15 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            {showMessage && (
                <div className="mt-6 border-t border-black/[0.06] pt-6">
                    <div className="rounded-[28px] bg-surface-alt p-5">
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Message</div>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-ink-soft">{submission.message}</p>
                    </div>
                </div>
            )}

            <AdminConfirmModal
                open={isDeleteModalOpen}
                title="Delete this contact submission?"
                description="This support message will be removed from the admin inbox permanently."
                confirmLabel="Delete submission"
                isLoading={isDeleting}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default SingleContactSubmission;

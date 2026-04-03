import React, { useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminConfirmModal from '../../../components/AdminConfirmModal/AdminConfirmModal';

const tradeInStatuses = ["New", "Contacted", "Received", "Quoted", "Paid", "Closed"];

const formatAnswerValue = (value) => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (typeof value === 'string') return value;
    if (value === null || typeof value === 'undefined') return 'N/A';
    return String(value);
};

const labelize = (value = '') => value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();

const SingleTradeInRequest = ({ request, onStatusUpdated, onDeleted }) => {
    const [status, setStatus] = useState(request.status);
    const [showDetails, setShowDetails] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleStatusChange = async (event) => {
        const nextStatus = event.target.value;
        setStatus(nextStatus);
        setIsUpdating(true);

        try {
            const response = await axiosInstance.patch(`trade-in-requests/${request._id}/status`, { status: nextStatus });
            onStatusUpdated?.(response.data);
            toast.success(`Trade-in request marked as ${nextStatus}`);
        } catch (error) {
            setStatus(request.status);
            console.log(error);
            toast.error('Trade-in status update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`trade-in-requests/${request._id}`);
            onDeleted?.(request._id);
            toast.success('Trade-in request deleted');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete trade-in request');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_220px]">
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Request ID: <strong className="break-all text-apple-text">{request._id}</strong></p>
                    <p>Device: <strong className="text-apple-text">{request.device}</strong></p>
                    <p>Model: <strong className="text-apple-text">{request.modelTitle}</strong></p>
                    <p>Estimate: <strong className="text-apple-text">${request.estimate}</strong></p>
                </div>

                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Customer: <strong className="text-apple-text">{request.name}</strong></p>
                    <p>Email: <strong className="text-apple-text">{request.email}</strong></p>
                    <p>Phone: <strong className="text-apple-text">{request.phone}</strong></p>
                    <p>Created: <strong className="text-apple-text">{new Date(request.createdAt).toLocaleString()}</strong></p>
                </div>

                <div className="space-y-3">
                    <select className="admin-select" value={status} onChange={handleStatusChange} disabled={isUpdating}>
                        {tradeInStatuses.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <button className="premium-button-secondary w-full justify-center" onClick={() => setShowDetails((prev) => !prev)}>
                        {showDetails ? 'Hide details' : 'Show details'}
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

            {showDetails && (
                <div className="mt-6 grid gap-6 border-t border-black/[0.06] pt-6 lg:grid-cols-[1fr_1fr]">
                    <div className="rounded-[28px] bg-surface-alt p-5">
                        <h4 className="mb-4 text-[24px]">Request details</h4>
                        <div className="space-y-2 text-sm text-ink-soft">
                            <p>Storage: <strong className="text-apple-text">{request.storage}</strong></p>
                            <p>Carrier: <strong className="text-apple-text">{request.carrierTitle || 'N/A'}</strong></p>
                            <p>Current status: <strong className="text-apple-text">{status}</strong></p>
                            <p>Last updated: <strong className="text-apple-text">{new Date(request.updatedAt).toLocaleString()}</strong></p>
                        </div>
                    </div>

                    <div className="rounded-[28px] bg-surface-alt p-5">
                        <h4 className="mb-4 text-[24px]">Condition answers</h4>
                        <div className="space-y-2 text-sm text-ink-soft">
                            {Object.keys(request.answers || {}).length ? Object.entries(request.answers).map(([key, value]) => (
                                <p key={key}>
                                    {labelize(key)}: <strong className="text-apple-text">{formatAnswerValue(value)}</strong>
                                </p>
                            )) : (
                                <p>No condition answers saved.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AdminConfirmModal
                open={isDeleteModalOpen}
                title="Delete this trade-in request?"
                description="This removes the trade-in request from the admin queue permanently. You cannot undo this action."
                confirmLabel="Delete request"
                isLoading={isDeleting}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default SingleTradeInRequest;

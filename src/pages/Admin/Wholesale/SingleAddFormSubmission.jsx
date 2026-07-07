import React, { useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminConfirmModal from '../../../components/AdminConfirmModal/AdminConfirmModal';

const SingleAddFormSubmission = ({ submission, onDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`add-run-form-submit/admin/${submission._id}`);
            onDeleted?.(submission._id);
            toast.success('Wholesale submission deleted');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete wholesale submission');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Name: <strong className="text-apple-text">{submission.name}</strong></p>
                    <p>Email: <strong className="text-apple-text">{submission.email}</strong></p>
                    <p>Phone: <strong className="text-apple-text">{submission.phone}</strong></p>
                    <p>Devices: <strong className="text-apple-text">{submission.devices}</strong></p>
                    <p>Received: <strong className="text-apple-text">{new Date(submission.createdAt).toLocaleString()}</strong></p>
                </div>
                <div>
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
                title="Delete this wholesale submission?"
                description="This wholesale inquiry will be removed from the admin list permanently."
                confirmLabel="Delete submission"
                isLoading={isDeleting}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default SingleAddFormSubmission;

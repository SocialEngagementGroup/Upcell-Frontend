import React from 'react';

const AdminConfirmModal = ({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', isLoading = false, onConfirm, onCancel }) => {
    if (!open) return null;

    const confirmClassName = tone === 'danger'
        ? 'inline-flex h-[52px] items-center justify-center rounded-full bg-red-600 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
        : 'premium-button h-[52px] px-6';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm">
            <div className="admin-panel w-full max-w-[520px] rounded-[32px] p-7 md:p-8">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Please confirm</div>
                <h3 className="mt-4 text-[30px] leading-tight text-apple-text">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink-soft">{description}</p>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        className="premium-button-secondary h-[52px] px-6"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={confirmClassName}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Working...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminConfirmModal;

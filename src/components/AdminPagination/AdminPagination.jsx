import React from 'react';

const AdminPagination = ({ page, limit, totalItems, totalPages, currentCount, itemLabel, onPageChange }) => {
    const rangeStart = totalItems ? ((page - 1) * limit) + 1 : 0;
    const rangeEnd = totalItems ? rangeStart + currentCount - 1 : 0;

    return (
        <div className="admin-panel rounded-[28px] px-5 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-ink-soft">
                    Showing <strong className="text-apple-text">{rangeStart}-{rangeEnd}</strong> of{' '}
                    <strong className="text-apple-text">{totalItems}</strong> {itemLabel}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        className="premium-button-secondary h-11 px-5 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        type="button"
                    >
                        Previous
                    </button>
                    <p className="min-w-[108px] text-center text-sm font-bold text-apple-text">
                        Page {page} of {totalPages}
                    </p>
                    <button
                        className="premium-button-secondary h-11 px-5 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        type="button"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPagination;

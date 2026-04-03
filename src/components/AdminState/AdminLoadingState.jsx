import React from 'react';

const AdminLoadingState = ({ title = 'Loading…', description = 'Please wait while we pull the latest admin data.' }) => {
    return (
        <div className="admin-panel rounded-[30px] p-12 text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-apple-text" />
            <h2 className="text-[28px]">{title}</h2>
            <p className="mt-3 text-sm text-ink-soft">{description}</p>
        </div>
    );
};

export default AdminLoadingState;

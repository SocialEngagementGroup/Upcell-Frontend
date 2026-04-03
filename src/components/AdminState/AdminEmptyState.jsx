import React from 'react';

const AdminEmptyState = ({ title, description }) => {
    return (
        <div className="admin-panel rounded-[30px] p-12 text-center">
            <h2 className="text-[28px]">{title}</h2>
            <p className="mt-3 text-sm text-ink-soft">{description}</p>
        </div>
    );
};

export default AdminEmptyState;

import React from 'react';

const AdminStatsGrid = ({ items = [] }) => {
    if (!items.length) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <div key={`${item.label}-${item.value}`} className="admin-panel rounded-[28px] p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">{item.label}</div>
                    <div className="mt-3 text-[32px] font-extrabold leading-none text-apple-text">{item.value}</div>
                    {item.sub ? <div className="mt-2 text-sm text-ink-soft">{item.sub}</div> : null}
                </div>
            ))}
        </div>
    );
};

export default AdminStatsGrid;

import React from 'react';

const AdminPageHeader = ({ eyebrow, title, description, children }) => {
    return (
        <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-10 md:py-12">
            <span className="eyebrow mb-5">{eyebrow}</span>
            <h1 className="text-[clamp(2rem,3.8vw,3.9rem)] leading-[0.94]">{title}</h1>
            {description ? (
                <p className="mt-4 max-w-[700px] text-base leading-8 text-ink-soft">{description}</p>
            ) : null}
            {children ? <div className="mt-6">{children}</div> : null}
        </div>
    );
};

export default AdminPageHeader;

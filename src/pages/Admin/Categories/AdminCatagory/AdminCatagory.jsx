import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminCatagory = () => {
    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Categories</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Organize product families.</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">Edit Apple product groupings, descriptions, and imagery that power the shopfront.</p>
            </div>

            <div className="admin-panel rounded-[32px] p-6">
                <div className="flex flex-wrap gap-3">
                    <NavLink
                        to=""
                        end
                        className={({ isActive }) => `rounded-full px-5 py-3 text-sm font-bold ${isActive ? 'bg-apple-text text-white' : 'bg-surface-alt text-apple-text'}`}
                    >
                        All categories
                    </NavLink>
                    <NavLink
                        to="addcatagory"
                        className={({ isActive }) => `rounded-full px-5 py-3 text-sm font-bold ${isActive ? 'bg-apple-text text-white' : 'bg-surface-alt text-apple-text'}`}
                    >
                        Add category
                    </NavLink>
                </div>
            </div>
            <Outlet />
        </section>
    );
};

export default AdminCatagory;

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminCatagory = () => {
    return (
        <section className="space-y-6">
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

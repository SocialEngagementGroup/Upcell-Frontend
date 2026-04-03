import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const AdminCatagory = () => {
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Categories</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Organize product families.</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">Edit Apple product groupings, descriptions, and imagery that power the shopfront.</p>
            </div>

            <div className="admin-panel rounded-[32px] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

                    <label className="relative block w-full lg:max-w-[380px]">
                        <SearchRoundedIcon className="pointer-events-none absolute left-4 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray" />
                        <input
                            type="search"
                            value={categorySearchQuery}
                            onChange={(event) => setCategorySearchQuery(event.target.value)}
                            placeholder="Search categories"
                            className="h-12 w-full rounded-full border border-black/[0.08] bg-white pl-12 pr-4 text-sm font-semibold text-apple-text outline-none transition-all placeholder:font-medium placeholder:text-apple-gray focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)]"
                        />
                    </label>
                </div>
            </div>
            <Outlet context={{ categorySearchQuery, setCategorySearchQuery }} />
        </section>
    );
};

export default AdminCatagory;

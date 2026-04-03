import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AdminPageHeader from '../../../../components/AdminPageHeader/AdminPageHeader';

const AdminCatagory = () => {
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Categories"
                title="Organize product families."
                description="Keep storefront groupings clean, searchable, and ready for merchandising updates."
            />

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

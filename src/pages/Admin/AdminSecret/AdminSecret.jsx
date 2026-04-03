import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '', label: 'Overview', end: true },
    { to: 'catagory', label: 'Categories' },
    { to: 'products', label: 'Products' },
    { to: 'addproduct', label: 'Add Product' },
    { to: 'orders', label: 'Orders' },
];

const AdminSecret = () => {
    return (
        <div className="admin-shell">
            <div className="admin-container pb-16">
                <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                    <aside className="admin-panel h-fit rounded-[36px] p-6 lg:sticky lg:top-28">
                        <span className="eyebrow mb-5">Admin</span>
                        <h2 className="text-[32px] leading-[0.95]">UpCell control room.</h2>
                        <p className="mt-4 text-sm leading-7 text-ink-soft">Manage products, categories, orders, and merchandising in one cleaner workspace.</p>
                        <nav className="mt-8 flex flex-col gap-3">
                            {links.map((link) => (
                                <NavLink
                                    key={link.label}
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                                            isActive ? 'bg-apple-text text-white' : 'bg-surface-alt text-apple-text hover:bg-black/[0.04]'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>

                    <main className="min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminSecret;

import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { userContext } from '../../../utilities/UserContextProvider';
import axiosInstance from '../../../utilities/axiosInstance';

const links = [
    { to: '', label: 'Overview', end: true },
    { to: 'catagory', label: 'Categories' },
    { to: 'products', label: 'Products' },
    { to: 'addproduct', label: 'Add Product' },
    { to: 'orders', label: 'Orders' },
    { to: 'trade-in', label: 'Trade In' },
    { to: 'notifications', label: 'Notifications' },
    { to: 'email-settings', label: 'Email Settings' },
    { to: 'newsletter', label: 'Newsletter' },
    { to: 'contact', label: 'Contact' },
    { to: 'wholesale', label: 'Wholesale' },
    { to: 'analytics', label: 'Analytics' },
    { to: 'audit-log', label: 'Audit Log' },
];

const AdminSecret = () => {
    const { logOut } = useContext(userContext);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        axiosInstance
            .get('admin-notifications-unread-count')
            .then((res) => setUnreadCount(res.data.count || 0))
            .catch((error) => console.log(error));
    }, []);

    const handleSignOut = () => {
        logOut({ redirectUrl: '/' }).catch((error) => console.log(error));
    };

    return (
        <div className="admin-shell">
            <div className="admin-container pb-16">
                <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                    <aside className="admin-panel h-fit rounded-[36px] p-6 lg:sticky lg:top-28">
                        <span className="eyebrow mb-5">Admin</span>
                        <h2 className="text-[32px] leading-[0.95]">UpCell control room.</h2>
                        <p className="mt-4 text-sm leading-7 text-ink-soft">Manage products, categories, orders, trade-ins, analytics, and merchandising in one cleaner workspace.</p>
                        <nav className="mt-8 flex flex-col gap-3">
                            {links.map((link) => (
                                <NavLink
                                    key={link.label}
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                                            isActive ? 'bg-apple-text text-white' : 'bg-surface-alt text-apple-text hover:bg-black/[0.04]'
                                        }`
                                    }
                                >
                                    <span>{link.label}</span>
                                    {link.to === 'notifications' && unreadCount > 0 ? (
                                        <span className="rounded-full bg-brand-red px-2 py-0.5 text-[11px] font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    ) : null}
                                </NavLink>
                            ))}
                        </nav>
                        <button className="premium-button-secondary mt-6 w-full" type="button" onClick={handleSignOut}>
                            Sign out
                        </button>
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

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';

const PAGE_LIMIT = 10;
const defaultPagination = {
    page: 1,
    limit: PAGE_LIMIT,
    totalItems: 0,
    totalPages: 1,
};

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [markingId, setMarkingId] = useState(null);

    const fetchUnreadCount = async () => {
        try {
            const res = await axiosInstance.get('admin-notifications-unread-count');
            setUnreadCount(res.data.count || 0);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNotifications = async (filter = activeFilter, nextPage = page) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('admin-notifications', {
                params: { page: nextPage, limit: PAGE_LIMIT, filter: filter === 'unread' ? 'unread' : undefined },
            });
            setNotifications(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(activeFilter, page);
        fetchUnreadCount();
    }, [activeFilter, page]);

    const applyFilter = (nextFilter) => {
        if (nextFilter === activeFilter) {
            if (page === 1) {
                fetchNotifications(nextFilter, 1);
                return;
            }
            setPage(1);
            return;
        }

        setActiveFilter(nextFilter);
        setPage(1);
    };

    const handleMarkRead = async (id) => {
        setMarkingId(id);
        try {
            await axiosInstance.patch(`admin-notifications/${id}/read`);
            setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.log(error);
            toast.error('Failed to mark notification as read');
        } finally {
            setMarkingId(null);
        }
    };

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'notifications matching this view' },
        { label: 'Unread', value: unreadCount, sub: 'notifications waiting for review' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
        { label: 'View', value: activeFilter === 'unread' ? 'Unread' : 'All', sub: 'active notification filter' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Notifications"
                title="Stay on top of new activity."
                description="Trade-in requests and status changes land here as soon as they happen."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-wrap gap-3">
                    <button
                        className={activeFilter === 'all' ? 'premium-button' : 'premium-button-secondary'}
                        onClick={() => applyFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={activeFilter === 'unread' ? 'premium-button' : 'premium-button-secondary'}
                        onClick={() => applyFilter('unread')}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading notifications" description="Pulling the latest activity." />
            ) : notifications.length ? (
                <div className="space-y-5">
                    {notifications.map((notification) => (
                        <div key={notification._id} className="admin-panel rounded-[30px] p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="eyebrow">{notification.type}</span>
                                        {!notification.isRead ? (
                                            <span className="inline-block h-2 w-2 rounded-full bg-brand-red" />
                                        ) : null}
                                    </div>
                                    <h3 className="text-[22px] leading-tight text-apple-text">{notification.title}</h3>
                                    <p className="text-sm text-ink-soft">{notification.message}</p>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-3 md:flex-col">
                                    {notification.link ? (
                                        <Link to={notification.link} className="premium-button-secondary justify-center px-5 text-center">
                                            View
                                        </Link>
                                    ) : null}
                                    {!notification.isRead ? (
                                        <button
                                            className="premium-button px-5"
                                            onClick={() => handleMarkRead(notification._id)}
                                            disabled={markingId === notification._id}
                                        >
                                            {markingId === notification._id ? 'Marking...' : 'Mark as read'}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={notifications.length}
                        itemLabel="notifications"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No notifications found." description="New trade-in activity will show up here." />
            )}
        </section>
    );
};

export default AdminNotifications;

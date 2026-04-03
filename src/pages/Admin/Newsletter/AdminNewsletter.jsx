import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleNewsletterSubscriber from './SingleNewsletterSubscriber';
import { toast } from 'react-toastify';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';

const filters = ["all", "Active", "Unsubscribed"];
const PAGE_LIMIT = 10;
const defaultPagination = {
    page: 1,
    limit: PAGE_LIMIT,
    totalItems: 0,
    totalPages: 1,
};

const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [email, setEmail] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubscribers = async (filter = activeFilter, nextPage = page) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`admin-newsletter-subscribers/${filter}`, {
                params: { page: nextPage, limit: PAGE_LIMIT },
            });
            setSubscribers(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load subscribers');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers(activeFilter, page);
    }, [activeFilter, page]);

    useEffect(() => {
        setEmail('');
    }, [activeFilter]);

    const applyFilter = (nextFilter) => {
        if (nextFilter === activeFilter) {
            if (page === 1) {
                fetchSubscribers(nextFilter, 1);
                return;
            }

            setPage(1);
            return;
        }

        setActiveFilter(nextFilter);
        setPage(1);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const nextFilter = `byEmail:${email}`;

        if (nextFilter === activeFilter && page === 1) {
            fetchSubscribers(nextFilter, 1);
        } else {
            setActiveFilter(nextFilter);
            setPage(1);
        }

    };

    const handleUpdated = () => {
        fetchSubscribers(activeFilter, page);
    };

    const handleDeleted = () => {
        if (subscribers.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
            return;
        }

        fetchSubscribers(activeFilter, page);
    };

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'subscribers matching this view' },
        { label: 'Showing', value: subscribers.length, sub: 'subscribers on this page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
        { label: 'View', value: activeFilter, sub: 'active subscriber filter' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Newsletter"
                title="Manage newsletter subscribers."
                description="Track subscription status, search by email, and remove stale records cleanly."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={activeFilter === filter ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => applyFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-[28px] bg-surface-alt p-4">
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                        <form className="flex gap-3" onSubmit={handleSearch}>
                            <input className="admin-input" type="email" placeholder="Subscriber email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className="premium-button px-5" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading subscribers" description="Pulling the latest newsletter signup records for review." />
            ) : subscribers.length ? (
                <div className="space-y-5">
                    {subscribers.map((subscriber) => (
                        <SingleNewsletterSubscriber key={subscriber._id} subscriber={subscriber} onUpdated={handleUpdated} onDeleted={handleDeleted} />
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={subscribers.length}
                        itemLabel="subscribers"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No subscribers found." description="Try another filter or search email." />
            )}
        </section>
    );
};

export default AdminNewsletter;

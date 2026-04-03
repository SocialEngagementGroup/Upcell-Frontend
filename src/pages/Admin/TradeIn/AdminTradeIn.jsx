import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleTradeInRequest from './SingleTradeInRequest';
import { toast } from 'react-toastify';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';

const tradeInStatuses = ["New", "Contacted", "Received", "Quoted", "Paid", "Closed"];
const PAGE_LIMIT = 10;
const defaultPagination = {
    page: 1,
    limit: PAGE_LIMIT,
    totalItems: 0,
    totalPages: 1,
};

const AdminTradeIn = () => {
    const [requests, setRequests] = useState([]);
    const [activeFilter, setActiveFilter] = useState('New');
    const [email, setEmail] = useState('');
    const [requestId, setRequestId] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async (filter = activeFilter, nextPage = page) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`admin-trade-in-requests/${filter}`, {
                params: { page: nextPage, limit: PAGE_LIMIT },
            });
            setRequests(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load trade-in requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(activeFilter, page);
    }, [activeFilter, page]);

    useEffect(() => {
        setEmail('');
        setRequestId('');
    }, [activeFilter]);

    const applyFilter = (nextFilter) => {
        if (nextFilter === activeFilter) {
            if (page === 1) {
                fetchRequests(nextFilter, 1);
                return;
            }

            setPage(1);
            return;
        }

        setActiveFilter(nextFilter);
        setPage(1);
    };

    const handleRequestIdSearch = (event) => {
        event.preventDefault();
        const nextFilter = `byRequestId:${requestId}`;

        if (nextFilter === activeFilter && page === 1) {
            fetchRequests(nextFilter, 1);
        } else {
            setActiveFilter(nextFilter);
            setPage(1);
        }

    };

    const handleEmailSearch = (event) => {
        event.preventDefault();
        const nextFilter = `byEmail:${email}`;

        if (nextFilter === activeFilter && page === 1) {
            fetchRequests(nextFilter, 1);
        } else {
            setActiveFilter(nextFilter);
            setPage(1);
        }

    };

    const handleRequestUpdated = () => {
        fetchRequests(activeFilter, page);
    };

    const handleRequestDeleted = () => {
        if (requests.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
            return;
        }

        fetchRequests(activeFilter, page);
    };

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'trade-in requests matching this view' },
        { label: 'Showing', value: requests.length, sub: 'requests on the current page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
        { label: 'View', value: activeFilter, sub: 'active trade-in filter' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="Manage trade-in requests."
                description="Review incoming devices, move requests through the quote flow, and clear out completed records."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {tradeInStatuses.map((status) => (
                            <button
                                key={status}
                                className={activeFilter === status ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => applyFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by request ID</div>
                            <form className="flex gap-3" onSubmit={handleRequestIdSearch}>
                                <input className="admin-input" type="text" placeholder="Trade-in request ID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
                                <button className="premium-button px-5" type="submit">Search</button>
                            </form>
                        </div>
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                            <form className="flex gap-3" onSubmit={handleEmailSearch}>
                                <input className="admin-input" type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button className="premium-button px-5" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading trade-ins" description="Pulling the latest trade-in requests and request statuses." />
            ) : requests.length ? (
                <div className="space-y-5">
                    {requests.map((request) => (
                        <SingleTradeInRequest key={request._id} request={request} onStatusUpdated={handleRequestUpdated} onDeleted={handleRequestDeleted} />
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={requests.length}
                        itemLabel="trade-in requests"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No trade-in requests found." description="Try another status or search filter." />
            )}
        </section>
    );
};

export default AdminTradeIn;

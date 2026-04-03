import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleContactSubmission from './SingleContactSubmission';
import { toast } from 'react-toastify';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';

const filters = ["all", "New", "Resolved"];
const PAGE_LIMIT = 10;
const defaultPagination = {
    page: 1,
    limit: PAGE_LIMIT,
    totalItems: 0,
    totalPages: 1,
};

const AdminContact = () => {
    const [submissions, setSubmissions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [email, setEmail] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubmissions = async (filter = activeFilter, nextPage = page) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`admin-contact-submissions/${filter}`, {
                params: { page: nextPage, limit: PAGE_LIMIT },
            });
            setSubmissions(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load contact submissions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions(activeFilter, page);
    }, [activeFilter, page]);

    useEffect(() => {
        setEmail('');
    }, [activeFilter]);

    const applyFilter = (nextFilter) => {
        if (nextFilter === activeFilter) {
            if (page === 1) {
                fetchSubmissions(nextFilter, 1);
                return;
            }

            setPage(1);
            return;
        }

        setActiveFilter(nextFilter);
        setPage(1);
    };

    const handleUpdated = () => {
        fetchSubmissions(activeFilter, page);
    };

    const handleDeleted = () => {
        if (submissions.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
            return;
        }

        fetchSubmissions(activeFilter, page);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const nextFilter = `byEmail:${email}`;

        if (nextFilter === activeFilter && page === 1) {
            fetchSubmissions(nextFilter, 1);
        } else {
            setActiveFilter(nextFilter);
            setPage(1);
        }

    };

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'contact submissions in this view' },
        { label: 'Showing', value: submissions.length, sub: 'submissions on the current page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
        { label: 'View', value: activeFilter, sub: 'active submission filter' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Contact"
                title="Manage contact submissions."
                description="Review inbound support messages, mark them resolved, and keep the inbox clean."
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
                            <input className="admin-input" type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className="premium-button px-5" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading contact inbox" description="Pulling customer support messages and submission statuses." />
            ) : submissions.length ? (
                <div className="space-y-5">
                    {submissions.map((submission) => (
                        <SingleContactSubmission key={submission._id} submission={submission} onUpdated={handleUpdated} onDeleted={handleDeleted} />
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={submissions.length}
                        itemLabel="contact submissions"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No contact submissions found." description="Try another filter or search email." />
            )}
        </section>
    );
};

export default AdminContact;

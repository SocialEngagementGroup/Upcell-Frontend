import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import SingleAddFormSubmission from './SingleAddFormSubmission';
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

const AdminWholesale = () => {
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [email, setEmail] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubmissions = async (nextFilter = filter, nextPage = page) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`add-run-form-submit/admin/${nextFilter}`, {
                params: { page: nextPage, limit: PAGE_LIMIT },
            });
            setSubmissions(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load wholesale submissions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions(filter, page);
    }, [filter, page]);

    const handleDeleted = () => {
        if (submissions.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
            return;
        }

        fetchSubmissions(filter, page);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const nextFilter = email.trim() ? `byEmail:${email}` : 'all';

        if (nextFilter === filter && page === 1) {
            fetchSubmissions(nextFilter, 1);
        } else {
            setFilter(nextFilter);
            setPage(1);
        }
    };

    const handleClearSearch = () => {
        setEmail('');
        setFilter('all');
        setPage(1);
    };

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'wholesale submissions in this view' },
        { label: 'Showing', value: submissions.length, sub: 'submissions on the current page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Wholesale"
                title="Wholesale inquiries."
                description="Review bulk sell-in submissions collected from the wholesale form."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="rounded-[28px] bg-surface-alt p-4">
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                    <form className="flex gap-3" onSubmit={handleSearch}>
                        <input className="admin-input" type="email" placeholder="Submitter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className="premium-button px-5" type="submit">Search</button>
                        {filter !== 'all' && (
                            <button className="premium-button-secondary px-5" type="button" onClick={handleClearSearch}>Clear</button>
                        )}
                    </form>
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading wholesale inquiries" description="Pulling bulk sell-in submissions from the database." />
            ) : submissions.length ? (
                <div className="space-y-5">
                    {submissions.map((submission) => (
                        <SingleAddFormSubmission key={submission._id} submission={submission} onDeleted={handleDeleted} />
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={submissions.length}
                        itemLabel="wholesale submissions"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No wholesale submissions found." description="Try another search email or clear the filter." />
            )}
        </section>
    );
};

export default AdminWholesale;

import React, { useEffect, useState } from 'react';
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

const AdminAuditLog = () => {
    const [entries, setEntries] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAuditLog = async () => {
            setIsLoading(true);
            try {
                const res = await axiosInstance.get('admin-audit-log', {
                    params: { page, limit: PAGE_LIMIT },
                });
                setEntries(res.data.items || []);
                setPagination(res.data.pagination || defaultPagination);
            } catch (error) {
                console.log(error);
                toast.error('Failed to load audit log');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuditLog();
    }, [page]);

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'logged admin actions' },
        { label: 'Showing', value: entries.length, sub: 'entries on this page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Audit log"
                title="Track admin actions."
                description="A read-only record of who changed what, and when, across orders and trade-in requests."
            />

            <AdminStatsGrid items={stats} />

            {isLoading ? (
                <AdminLoadingState title="Loading audit log" description="Pulling the latest recorded admin actions." />
            ) : entries.length ? (
                <div className="space-y-5">
                    {entries.map((entry) => (
                        <div key={entry._id} className="admin-panel rounded-[30px] p-6">
                            <div className="grid gap-2 text-sm text-ink-soft">
                                <p>Action: <strong className="text-apple-text">{entry.action}</strong></p>
                                <p>By: <strong className="text-apple-text">{entry.actorEmail || 'Unknown'}</strong></p>
                                <p>Target: <strong className="text-apple-text">{entry.targetType} — {entry.targetId}</strong></p>
                                {entry.metadata?.from || entry.metadata?.to ? (
                                    <p>Change: <strong className="text-apple-text">{entry.metadata?.from} → {entry.metadata?.to}</strong></p>
                                ) : null}
                                <p>When: <strong className="text-apple-text">{new Date(entry.createdAt).toLocaleString()}</strong></p>
                            </div>
                        </div>
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={entries.length}
                        itemLabel="entries"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No audit log entries yet." description="Entries appear here once an admin changes an order or trade-in status." />
            )}
        </section>
    );
};

export default AdminAuditLog;

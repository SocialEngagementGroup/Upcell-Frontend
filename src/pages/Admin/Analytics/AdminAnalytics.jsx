import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import AdminPagination from '../../../components/AdminPagination/AdminPagination';
import { toast } from 'react-toastify';

const PAGE_LIMIT = 10;
const defaultPagination = {
    page: 1,
    limit: PAGE_LIMIT,
    totalItems: 0,
    totalPages: 1,
};

const categoryOptions = [
    { value: 'all', label: 'All events' },
    { value: 'form_submit', label: 'Form submits' },
    { value: 'form_dropoff', label: 'Drop-offs' },
    { value: 'admin_api_error', label: 'Admin API errors' },
    { value: 'form_engagement', label: 'Form starts' },
];

const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'dropoff', label: 'Drop-off' },
    { value: 'error', label: 'Error' },
    { value: 'started', label: 'Started' },
];

const AdminAnalytics = () => {
    const [summary, setSummary] = useState(null);
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [pagination, setPagination] = useState(defaultPagination);
    const [page, setPage] = useState(1);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    const [isEventsLoading, setIsEventsLoading] = useState(true);

    useEffect(() => {
        setIsSummaryLoading(true);
        axiosInstance.get('admin-analytics-summary')
            .then((res) => setSummary(res.data))
            .catch((error) => {
                console.log(error);
                toast.error('Failed to load analytics summary');
            })
            .finally(() => setIsSummaryLoading(false));
    }, []);

    useEffect(() => {
        setIsEventsLoading(true);
        axiosInstance.get('admin-analytics-events', {
            params: { category, status, page, limit: PAGE_LIMIT },
        }).then((res) => {
            setEvents(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        }).catch((error) => {
            console.log(error);
            toast.error('Failed to load analytics events');
        }).finally(() => setIsEventsLoading(false));
    }, [category, status, page]);

    const stats = summary ? [
        { label: 'Successful submits', value: summary.cards.successfulSubmits, sub: `last ${summary.windowDays} days` },
        { label: 'Failed submits', value: summary.cards.failedSubmits, sub: 'public form failures captured' },
        { label: 'Form drop-offs', value: summary.cards.formDropoffs, sub: 'started but never completed' },
        { label: 'Admin API errors', value: summary.cards.adminApiErrors, sub: 'request failures on admin routes' },
    ] : [];

    const applyCategory = (nextCategory) => {
        setCategory(nextCategory);
        setPage(1);
    };

    const applyStatus = (nextStatus) => {
        setStatus(nextStatus);
        setPage(1);
    };

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Analytics"
                title="Monitor form friction and admin failures."
                description="Track failed submits, admin API problems, and form drop-offs before they silently hurt conversion."
            />

            {isSummaryLoading ? (
                <AdminLoadingState title="Loading analytics summary" description="Crunching the latest monitoring totals and recent signal trends." />
            ) : (
                <>
                    <AdminStatsGrid items={stats} />

                    <div className="grid gap-6 xl:grid-cols-2">
                        <div className="admin-panel rounded-[30px] p-6">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Top failed forms</div>
                            <div className="mt-5 space-y-3">
                                {summary?.topFailedForms?.length ? summary.topFailedForms.map((item) => (
                                    <div key={`failed-${item._id || 'unknown'}`} className="flex items-center justify-between rounded-2xl bg-surface-alt px-4 py-3 text-sm">
                                        <span className="font-bold text-apple-text">{item._id || 'Unknown form'}</span>
                                        <span className="text-ink-soft">{item.count} failures</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-ink-soft">No failed form hotspots in the current window.</p>
                                )}
                            </div>
                        </div>

                        <div className="admin-panel rounded-[30px] p-6">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Top drop-off forms</div>
                            <div className="mt-5 space-y-3">
                                {summary?.topDropoffForms?.length ? summary.topDropoffForms.map((item) => (
                                    <div key={`dropoff-${item._id || 'unknown'}`} className="flex items-center justify-between rounded-2xl bg-surface-alt px-4 py-3 text-sm">
                                        <span className="font-bold text-apple-text">{item._id || 'Unknown form'}</span>
                                        <span className="text-ink-soft">{item.count} drop-offs</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-ink-soft">No drop-off hotspots in the current window.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Event category</div>
                            <div className="flex flex-wrap gap-3">
                                {categoryOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={category === option.value ? 'premium-button' : 'premium-button-secondary'}
                                        onClick={() => applyCategory(option.value)}
                                        type="button"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Status</div>
                            <div className="flex flex-wrap gap-3">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={status === option.value ? 'premium-button' : 'premium-button-secondary'}
                                        onClick={() => applyStatus(option.value)}
                                        type="button"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEventsLoading ? (
                <AdminLoadingState title="Loading analytics events" description="Pulling the latest event feed for the selected monitoring filters." />
            ) : events.length ? (
                <div className="space-y-5">
                    {events.map((event) => (
                        <div key={event._id} className="admin-panel rounded-[30px] p-6">
                            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                                <div className="space-y-2 text-sm text-ink-soft">
                                    <p>Event: <strong className="text-apple-text">{event.name}</strong></p>
                                    <p>Category: <strong className="text-apple-text">{event.category}</strong></p>
                                    <p>Status: <strong className="text-apple-text">{event.status}</strong></p>
                                    <p>Form: <strong className="text-apple-text">{event.formName || 'N/A'}</strong></p>
                                    <p>Path: <strong className="break-all text-apple-text">{event.path || 'N/A'}</strong></p>
                                    {event.message ? <p>Message: <strong className="text-apple-text">{event.message}</strong></p> : null}
                                </div>
                                <div className="space-y-2 text-sm text-ink-soft">
                                    <p>Created: <strong className="text-apple-text">{new Date(event.createdAt).toLocaleString()}</strong></p>
                                    <p>Session: <strong className="break-all text-apple-text">{event.sessionId || 'N/A'}</strong></p>
                                    {event.metadata && Object.keys(event.metadata).length ? (
                                        <div className="rounded-[24px] bg-surface-alt p-4">
                                            <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Metadata</div>
                                            <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-ink-soft">{JSON.stringify(event.metadata, null, 2)}</pre>
                                        </div>
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
                        currentCount={events.length}
                        itemLabel="events"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No analytics events found." description="Try a different category or status filter to inspect the event stream." />
            )}
        </section>
    );
};

export default AdminAnalytics;

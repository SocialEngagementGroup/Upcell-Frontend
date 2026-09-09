import React, { useState } from 'react';
import { useReturnsReportQuery } from '../../../queries/refundRequests';
import { apiBaseUrl } from '../../../utilities/env';
import { money } from './ReturnPanelKit';

// Is a model coming back more than the rest, and what for.
//
// The one question this page exists to answer. Everything else on it is
// context for that: a return rate with no breakdown tells you something is
// wrong without telling you what, and a breakdown with no rate tells you what
// is happening without telling you whether it matters.

const percent = (value) =>
    // Null means the denominator was empty, which is not zero. Showing 0%
    // return rate for a month with no sales reads as a triumph.
    value == null ? '—' : `${value}%`;

const Stat = ({ label, value, hint }) => (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
        <p className="text-2xl font-black text-apple-text">{value}</p>
        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">{label}</p>
        {hint ? <p className="mt-1 text-[11px] leading-4 text-ink-soft">{hint}</p> : null}
    </div>
);

const Breakdown = ({ title, counts = {}, total }) => {
    const rows = Object.entries(counts).sort((left, right) => right[1] - left[1]);
    if (!rows.length) return null;

    return (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">{title}</h4>
            <ul className="mt-3 space-y-2">
                {rows.map(([key, count]) => (
                    <li key={key}>
                        <div className="flex justify-between text-xs text-apple-text">
                            <span>{key}</span>
                            <span className="font-medium">{count}</span>
                        </div>
                        {/* A bar rather than only a number: the point of this
                            page is spotting the one that stands out, and a
                            column of numbers hides that. */}
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                            <div
                                className="h-full rounded-full bg-apple-text"
                                style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ReturnsReport = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const filters = { ...(from ? { from } : {}), ...(to ? { to } : {}) };
    const { data, isFetching } = useReturnsReportQuery(filters);

    const metrics = data?.metrics;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-[28px]">Returns report</h2>
                <p className="mt-1 text-sm text-ink-soft">
                    Which model is coming back, and what for. Last 90 days unless you narrow it.
                </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">From</span>
                    <input
                        type="date"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        className="mt-1.5 rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm outline-none focus:border-apple-text/25"
                    />
                </label>
                <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">To</span>
                    <input
                        type="date"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        className="mt-1.5 rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm outline-none focus:border-apple-text/25"
                    />
                </label>

                {/* A plain link, not a fetch: the browser already knows how to
                    save a file, and the endpoint sends the filename. */}
                <a
                    href={`${apiBaseUrl}admin-returns-report.csv${from || to ? `?${new URLSearchParams(filters)}` : ''}`}
                    className="rounded-full border border-black/[0.08] px-4 py-2.5 text-sm font-medium text-apple-text hover:bg-black/[0.03]"
                >
                    Download CSV
                </a>

                {isFetching ? <span className="text-xs text-ink-soft">Updating…</span> : null}
            </div>

            {metrics ? (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        <Stat label="Returns" value={metrics.total} />
                        <Stat
                            label="Return rate"
                            value={percent(metrics.returnRate)}
                            hint={`of ${metrics.unitsSold} sold`}
                        />
                        <Stat label="Reject rate" value={percent(metrics.rejectRate)} hint={`${metrics.concluded} concluded`} />
                        <Stat
                            label="Days to settle"
                            value={metrics.averageDaysToSettle ?? '—'}
                        />
                        <Stat label="SLA breaches" value={metrics.slaBreaches} hint={percent(metrics.slaBreachRate)} />
                        <Stat
                            label="Offers accepted"
                            value={percent(metrics.revisedOfferAcceptanceRate)}
                            hint={`${metrics.revisedOffersSent} sent`}
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Breakdown title="Why" counts={metrics.byReason} total={metrics.total} />
                        <Breakdown title="Whose fault" counts={metrics.byAttribution} total={metrics.total} />
                        <Breakdown title="Where devices went" counts={metrics.byDisposition} total={metrics.total} />
                        <Breakdown title="Status" counts={metrics.byStatus} total={metrics.total} />
                    </div>

                    <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-apple-gray">
                            By product — worst first
                        </h4>
                        <table className="mt-3 w-full text-left text-xs">
                            <thead className="text-apple-gray">
                                <tr>
                                    <th className="pb-2 font-bold">Product</th>
                                    <th className="pb-2 text-right font-bold">Returns</th>
                                    <th className="pb-2 text-right font-bold">Rejected</th>
                                    <th className="pb-2 pl-4 font-bold">Top reason</th>
                                </tr>
                            </thead>
                            <tbody className="text-apple-text">
                                {(data.byProduct || []).slice(0, 12).map((group) => {
                                    const [topReason] = Object.entries(group.reasons)
                                        .sort((left, right) => right[1] - left[1]);
                                    return (
                                        <tr key={group.key} className="border-t border-black/[0.04]">
                                            <td className="py-2">{group.key}</td>
                                            <td className="py-2 text-right font-medium">{group.total}</td>
                                            <td className="py-2 text-right">{group.rejected}</td>
                                            <td className="py-2 pl-4 text-ink-soft">{topReason ? topReason[0] : '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {!(data.byProduct || []).length ? (
                            <p className="mt-2 text-xs text-ink-soft">No returns in this window.</p>
                        ) : null}
                    </div>

                    {metrics.dispositionedValue > 0 ? (
                        <p className="text-xs text-ink-soft">
                            {money(metrics.dispositionedValue)} of devices were given a route in this period.
                        </p>
                    ) : null}
                </>
            ) : (
                <p className="text-sm text-ink-soft">Loading…</p>
            )}
        </div>
    );
};

export default ReturnsReport;

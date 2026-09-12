import React, { useState } from 'react';
import { toast } from 'sonner';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import { money } from '../RefundRequests/ReturnPanelKit';
import { downloadCsv } from '../../../utilities/downloadCsv';
import { extractApiError } from '../../../utilities/formValidation';
import { useTradeInReportQuery } from '../../../queries/tradeIn';

// Which model is UpCell quoting too high for.
//
// The mirror of the returns report, and the one question this page exists to
// answer. A model quoted forty times where three in four end in a revised offer
// is a price book entry that is wrong, or a condition question customers are
// reading differently from the way it was meant — and neither is visible one
// request at a time.

const percent = (value) =>
    // Null means the denominator was empty, which is not zero. Showing a 0%
    // acceptance rate for a month with no trade-ins reads as a disaster.
    value == null ? '—' : `${value}%`;

const Stat = ({ label, value, hint }) => (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
        <p className="text-2xl font-bold text-apple-text">{value}</p>
        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">{label}</p>
        {hint ? <p className="mt-1 text-[11px] leading-4 text-ink-soft">{hint}</p> : null}
    </div>
);

const TradeInReport = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const filters = { ...(from ? { from } : {}), ...(to ? { to } : {}) };
    const { data, isLoading, isFetching } = useTradeInReportQuery(filters);

    const metrics = data?.metrics;
    const byModel = data?.byModel || [];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="What the trade-in data says."
                description="Ninety days by default. The number worth watching is how often an offer had to be revised — that is a price, or a question, rather than a customer."
            />

            <div className="admin-panel flex flex-wrap items-end gap-4 rounded-[36px] p-6 md:p-8">
                <label className="flex flex-col text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">
                    From
                    <input
                        type="date"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        className="mt-1.5 rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm outline-none focus:border-apple-text/25"
                    />
                </label>
                <label className="flex flex-col text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">
                    To
                    <input
                        type="date"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        className="mt-1.5 rounded-xl border border-black/[0.08] bg-white p-2.5 text-sm outline-none focus:border-apple-text/25"
                    />
                </label>

                <button
                    type="button"
                    onClick={() => downloadCsv('admin-trade-in-report.csv', filters, 'upcell-trade-ins.csv')
                        .catch((error) => toast.error(extractApiError(error)))}
                    className="rounded-full border border-black/[0.08] px-4 py-2.5 text-sm font-medium text-apple-text hover:bg-black/[0.03]"
                >
                    Download CSV
                </button>

                {isFetching ? <span className="text-xs text-ink-soft">Updating…</span> : null}
            </div>

            {isLoading ? (
                <AdminEmptyState title="Loading" description="Working out the numbers." />
            ) : metrics ? (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        <Stat label="Quoted" value={metrics.total} />
                        <Stat label="Paid" value={metrics.paid} hint={money(metrics.paidOutCents / 100)} />
                        <Stat
                            label="Accepted"
                            value={percent(metrics.acceptanceRate)}
                            hint="of trade-ins that reached a conclusion"
                        />
                        <Stat
                            label="Expired"
                            value={percent(metrics.expiredRate)}
                            hint="quote ran out before the device arrived"
                        />
                        <Stat
                            label="Re-offered"
                            value={percent(metrics.revisedRate)}
                            hint="device was worse than described"
                        />
                        <Stat
                            label="Avg cut"
                            value={percent(metrics.avgDeductionPercent)}
                            hint="across the offers that were revised"
                        />
                    </div>

                    <div className="admin-panel rounded-[36px] p-6 md:p-8">
                        <p className="text-sm leading-7 text-ink-soft">
                            {metrics.avgDaysToPaid == null
                                ? 'Nothing has been paid in this window, so there is no quote-to-payment time yet.'
                                : `Quote to payment takes ${metrics.avgDaysToPaid} days on average, counted only over trade-ins that were actually paid.`}
                        </p>
                    </div>

                    {byModel.length ? (
                        <div className="admin-panel rounded-[36px] p-6 md:p-8">
                            <div className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">
                                By model — most quoted first
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead>
                                        <tr className="text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">
                                            <th className="pb-3 pr-4">Model</th>
                                            <th className="pb-3 pr-4 text-right">Quoted</th>
                                            <th className="pb-3 pr-4 text-right">Paid</th>
                                            <th className="pb-3 pr-4 text-right">Re-offered</th>
                                            <th className="pb-3 pr-4 text-right">Expired</th>
                                            <th className="pb-3 pr-4 text-right">Accepted</th>
                                            <th className="pb-3 pr-4 text-right">Avg cut</th>
                                            <th className="pb-3 text-right">Paid out</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {byModel.map((row) => {
                                            // More than half the quotes on a model ending in a
                                            // revised offer is the row worth acting on, so it is
                                            // the one thing here that carries the accent colour.
                                            const mostlyRevised = row.quoted > 2 && row.revisedOffers / row.quoted > 0.5;

                                            return (
                                                <tr key={row.parentId || row.name} className="border-t border-black/5">
                                                    <td className="py-3 pr-4 font-medium text-apple-text">{row.name}</td>
                                                    <td className="py-3 pr-4 text-right text-ink-soft">{row.quoted}</td>
                                                    <td className="py-3 pr-4 text-right text-ink-soft">{row.paid}</td>
                                                    <td className={`py-3 pr-4 text-right ${mostlyRevised ? 'font-bold text-brand-red' : 'text-ink-soft'}`}>
                                                        {row.revisedOffers}
                                                    </td>
                                                    <td className="py-3 pr-4 text-right text-ink-soft">{row.expired}</td>
                                                    <td className="py-3 pr-4 text-right text-ink-soft">{percent(row.acceptanceRate)}</td>
                                                    <td className="py-3 pr-4 text-right text-ink-soft">{percent(row.avgDeductionPercent)}</td>
                                                    <td className="py-3 text-right text-ink-soft">{money(row.paidOutCents / 100)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <AdminEmptyState
                            title="No trade-ins in this window."
                            description="Widen the dates, or wait for the first one."
                        />
                    )}
                </>
            ) : (
                <AdminEmptyState title="Nothing to report." description="No trade-in data for this window." />
            )}
        </section>
    );
};

export default TradeInReport;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../utilities/axiosInstance';

// How much of the catalogue can actually be sold.
//
// "In stock" and "sellable" are not the same thing, and the gap between them
// is the point of this panel. A device under 80% battery is in the building,
// works, and must not be listed until the battery is replaced. Counted here so
// somebody sees it, rather than discovering it when a customer asks why there
// are no iPhone 13s.

const EMPTY = { total: 0, sellable: 0, needsBattery: 0, needsRepair: 0, sold: 0 };

// Emptiest first is the server's order. Six is enough to see the problem
// without the overview turning into a second products page.
const SHOWN = 6;

const StockSummary = () => {
    const [totals, setTotals] = useState(EMPTY);
    const [families, setFamilies] = useState([]);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;

        axiosInstance.get('admin-stock-summary')
            .then((res) => {
                if (cancelled) return;
                setTotals(res.data?.totals || EMPTY);
                setFamilies(res.data?.families || []);
            })
            .catch(() => { if (!cancelled) setFailed(true); });

        return () => { cancelled = true; };
    }, []);

    // Silent rather than an error state. This panel sits under the revenue
    // figures on a page somebody opens to check on orders; a red box because
    // one extra query failed would read as something being wrong with those.
    if (failed) return null;

    const heldBack = totals.needsBattery + totals.needsRepair;

    return (
        <div className="admin-panel rounded-[36px] p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Stock</div>
                <Link className="text-sm font-medium text-ink-soft underline" to="/admin-secret/import-products">
                    Import stock
                </Link>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[38px] font-bold leading-none text-apple-text">{totals.sellable}</span>
                <span className="text-sm text-ink-soft">
                    units can be sold, of {totals.total} in the catalogue
                </span>
            </div>

            {heldBack > 0 ? (
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                    {heldBack} {heldBack === 1 ? 'unit is' : 'units are'} held back —{' '}
                    {totals.needsBattery} waiting on a battery, {totals.needsRepair} on a repair. They are in the
                    building and will not be listed until that is recorded as done.
                </p>
            ) : null}

            {families.length ? (
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                        <thead>
                            <tr className="text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">
                                <th className="pb-3 pr-4">Product</th>
                                <th className="pb-3 pr-4 text-right">Sellable</th>
                                <th className="pb-3 pr-4 text-right">Battery</th>
                                <th className="pb-3 pr-4 text-right">Repair</th>
                                <th className="pb-3 text-right">Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {families.slice(0, SHOWN).map((family) => (
                                <tr key={family.parentId || family.productName} className="border-t border-black/5">
                                    <td className="py-3 pr-4 font-medium text-apple-text">{family.productName}</td>
                                    {/* Nothing sellable is the row worth noticing, so it is the one
                                        thing on this table that carries the accent colour. */}
                                    <td className={`py-3 pr-4 text-right ${family.sellable === 0 ? 'font-bold text-brand-red' : 'text-ink-soft'}`}>
                                        {family.sellable}
                                    </td>
                                    <td className="py-3 pr-4 text-right text-ink-soft">{family.needsBattery || '—'}</td>
                                    <td className="py-3 pr-4 text-right text-ink-soft">{family.needsRepair || '—'}</td>
                                    <td className="py-3 text-right text-ink-soft">{family.sold || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {families.length > SHOWN ? (
                        <p className="mt-3 text-sm text-ink-soft">
                            Showing the {SHOWN} emptiest of {families.length} products.
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default StockSummary;

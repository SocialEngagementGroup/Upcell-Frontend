import React, { useState } from 'react';
import { toast } from 'sonner';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import { extractApiError } from '../../../utilities/formValidation';
import { usePriceBookQuery, useUpdatePriceBookEntryMutation } from '../../../queries/tradeIn';

// What UpCell pays for each model, editable by the person who decides it.
//
// These numbers used to live in the trade-in page's own bundle, which meant
// changing a price was a deploy and the arithmetic ran in the browser. Moving
// them to the server was half the fix; this page is the other half — without
// it the prices are on the server and still unreachable to anybody who cannot
// deploy, which is no better for Yasir than where they started.
//
// One model saved at a time, matching the API. A bulk save lets a stale tab
// overwrite somebody else's edit with nothing to show what happened, and the
// audit row then says "the book changed" when the question anybody asks is
// which price, from what, to what.

const money = (cents) => (cents == null ? '' : (cents / 100).toFixed(2));

const DEVICE_TYPES = ['iPhone', 'iPad', 'MacBook', 'Samsung', 'Google'];

const ModelRow = ({ entry }) => {
    const [basePrice, setBasePrice] = useState(money(entry.basePriceCents));
    const [displayName, setDisplayName] = useState(entry.displayName || '');
    const [active, setActive] = useState(entry.active !== false);
    const [error, setError] = useState('');

    const save = useUpdatePriceBookEntryMutation();

    // Nothing to save until something has changed. A save button that is always
    // live invites a save that rewrites a row with its own values and bumps the
    // version for nothing — and the version is what an old quote is checked
    // against.
    const changed =
        basePrice !== money(entry.basePriceCents)
        || displayName !== (entry.displayName || '')
        || active !== (entry.active !== false);

    const submit = (event) => {
        event.preventDefault();
        setError('');

        save.mutate(
            {
                modelKey: entry.modelKey,
                basePrice: Number(basePrice),
                displayName: displayName.trim(),
                active,
            },
            {
                onSuccess: () => toast.success(`${displayName || entry.modelKey} saved`),
                onError: (failure) => setError(extractApiError(failure)),
            }
        );
    };

    const storages = Object.entries(entry.storageMultipliers || {});

    return (
        <form onSubmit={submit} className={`rounded-[24px] border border-black/[0.06] p-4 ${active ? 'bg-white' : 'bg-surface-alt'}`}>
            <div className="grid gap-3 md:grid-cols-[1fr_140px_120px_auto] md:items-end">
                <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Name customers see</span>
                    <input
                        className="admin-input mt-1.5"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                    />
                </label>

                <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Base price</span>
                    <input
                        className="admin-input mt-1.5"
                        type="number"
                        step="0.01"
                        min="0"
                        value={basePrice}
                        onChange={(event) => setBasePrice(event.target.value)}
                    />
                </label>

                <label className="flex items-center gap-2 pb-2.5 text-sm text-ink-soft">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(event) => setActive(event.target.checked)}
                        className="h-4 w-4 accent-brand-red"
                    />
                    Quoting
                </label>

                <button className="premium-button px-5" type="submit" disabled={!changed || save.isPending}>
                    {save.isPending ? 'Saving…' : 'Save'}
                </button>
            </div>

            <p className="mt-2 font-mono text-[11px] text-apple-gray">
                {entry.modelKey} · {entry.deviceType} · version {entry.priceBookVersion}
                {entry.updatedBy ? ` · last changed by ${entry.updatedBy}` : ''}
            </p>

            {/* The storage multipliers, read-only here. They are what turns one
                base price into eight, and a typo in one is eight wrong quotes —
                worth showing, and worth not making easy to fumble in a row
                somebody is editing a name in. */}
            {storages.length ? (
                <p className="mt-1.5 text-[11px] leading-4 text-ink-soft">
                    {storages.map(([size, multiplier]) => `${size} ×${multiplier}`).join('  ·  ')}
                </p>
            ) : (
                <p className="mt-1.5 text-[11px] leading-4 text-ink-soft">
                    No storage multipliers — every size is quoted at the base price.
                </p>
            )}

            {!active ? (
                <p className="mt-2 text-[11px] leading-4 text-ink-soft">
                    Not offered to customers. The row stays so an old quote on this model can still be explained.
                </p>
            ) : null}

            {error ? (
                <p className="mt-2 rounded-xl bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red" role="alert">
                    {error}
                </p>
            ) : null}
        </form>
    );
};

const TradeInPriceBook = () => {
    const [deviceType, setDeviceType] = useState('iPhone');
    const { data, isLoading } = usePriceBookQuery();

    const models = (data?.models || []).filter((entry) => entry.deviceType === deviceType);
    const all = data?.models || [];

    const stats = [
        { label: 'Models', value: all.length, sub: 'in the price book' },
        { label: 'Quoting', value: all.filter((entry) => entry.active !== false).length, sub: 'offered to customers' },
        { label: 'In this view', value: models.length, sub: deviceType },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="What we pay."
                description="The base price for each model, before condition. Changing one here changes what customers are quoted from the next request onwards — quotes already given keep the price they were given."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                    {DEVICE_TYPES.map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={deviceType === type ? 'premium-button px-5' : 'premium-button-secondary px-5'}
                            onClick={() => setDeviceType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading the price book" description="Pulling what UpCell pays for each model." />
            ) : models.length ? (
                <div className="space-y-4">
                    {models.map((entry) => <ModelRow key={entry.modelKey} entry={entry} />)}
                </div>
            ) : (
                <AdminEmptyState
                    title={`No ${deviceType} models yet.`}
                    description="Models are seeded by scripts/seed-trade-in-pricebook.js. Adding a new one is still a script — this page edits prices, not the catalogue of models."
                />
            )}
        </section>
    );
};

export default TradeInPriceBook;

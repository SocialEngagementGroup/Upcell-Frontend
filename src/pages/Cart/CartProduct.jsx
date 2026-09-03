import React, { useState } from 'react';
import { groupSubtotal, groupLastIndex } from '../../utilities/cartGrouping';

// The two accessory photos are not in the catalogue yet. A broken image with
// its filename spelled out beside a $999 phone reads as a fault in the order,
// so fall back to something plain and deliberate.
const AccessoryThumb = ({ product }) => {
    const [failed, setFailed] = useState(false);

    return (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-white">
            {failed ? (
                <span className="text-lg font-extrabold text-apple-gray">
                    {(product.productName || '?').charAt(0)}
                </span>
            ) : (
                <img
                    src={product.image}
                    alt={product.productName}
                    onError={() => setFailed(true)}
                    className="h-[76%] w-auto object-contain"
                />
            )}
        </div>
    );
};

// The device keeps the full-size stepper. Add-ons sit underneath it and should
// not compete with it for attention.
const MiniStepper = ({ quantity, onAdd, onRemove }) => (
    <div className="flex items-center rounded-full border border-black/[0.08] bg-white px-2 py-1">
        <button
            type="button"
            className="h-7 w-7 rounded-full text-base text-apple-gray hover:bg-surface-alt"
            onClick={onRemove}
            aria-label="Remove one"
        >
            -
        </button>
        <span className="min-w-[28px] text-center text-xs font-bold text-apple-text">{quantity}</span>
        <button
            type="button"
            className="h-7 w-7 rounded-full text-base text-apple-gray hover:bg-surface-alt"
            onClick={onAdd}
            aria-label="Add one"
        >
            +
        </button>
    </div>
);

const CartProduct = ({ group, setCart }) => {
    const { device, deviceIndices, accessories } = group;
    const unit = deviceIndices.length;
    const hasAccessories = accessories.length > 0;
    const outOfStock = device?.outOfStock;

    // Cart edits work on positions, not ids. The same accessory can sit under
    // two different devices, and only one of the two is being changed.
    const dropIndex = (index) =>
        setCart((prev) => prev.filter((_, position) => position !== index));

    const dropIndices = (indices) => {
        const drop = new Set(indices);
        setCart((prev) => prev.filter((_, position) => !drop.has(position)));
    };

    const insertAfter = (index, id) =>
        setCart((prev) => {
            const next = [...prev];
            next.splice(index + 1, 0, id);
            return next;
        });

    // A new accessory goes at the end of this group, so it stays with the
    // device it was chosen for rather than attaching to whatever was added last.
    const addAccessory = (id) => insertAfter(groupLastIndex(group), id);

    // Dropping the device drops what was bought to go on it. A case for a phone
    // that is no longer in the order is not something anyone meant to keep.
    const removeGroup = () => dropIndices([
        ...deviceIndices,
        ...accessories.flatMap((entry) => entry.indices),
    ]);

    return (
        <div className={`premium-card rounded-[32px] p-5 md:p-6 ${outOfStock ? 'border-2 border-brand-red/40' : ''}`}>
            {device ? (
                <div className="grid gap-6 md:grid-cols-[140px_1fr_180px] md:items-center">
                    <div className="flex h-[140px] items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#f8f8fa_0%,#edf0f5_100%)]">
                        <img
                            src={device.image}
                            alt={device.productName}
                            className={`h-[78%] w-auto object-contain ${outOfStock ? 'opacity-40 grayscale' : ''}`}
                        />
                    </div>

                    <div>
                        <h3 className="text-[30px] leading-[1.02]">{device.productName}</h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {/* These are single refurbished units, so "sold" means this
                                exact device is gone — not that more are coming. Say so
                                here rather than letting the customer find out when the
                                bank declines their card. */}
                            {outOfStock ? (
                                <span className="rounded-full bg-brand-red px-3 py-2 text-xs font-bold text-white">Sold — no longer available</span>
                            ) : null}
                            <span className="rounded-full bg-surface-alt px-3 py-2 text-xs font-bold text-apple-gray">{device.color?.name || 'Apple finish'}</span>
                            <span className="rounded-full bg-surface-alt px-3 py-2 text-xs font-bold text-apple-gray">{device.storage}</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-ink-soft">
                            {outOfStock
                                ? 'Someone bought this one first. Remove it to continue to checkout.'
                                : 'Condition checked, securely reset, and packed for fast delivery.'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 md:items-end">
                        <div className={`text-2xl font-extrabold ${outOfStock ? 'text-apple-gray line-through' : 'text-apple-text'}`}>
                            ${(device.price * unit).toFixed(2)}
                        </div>
                        <div className="flex items-center rounded-full border border-black/[0.08] bg-white px-3 py-2">
                            <button
                                className="h-10 w-10 rounded-full text-xl text-apple-gray hover:bg-surface-alt"
                                onClick={() => dropIndex(Math.max(...deviceIndices))}
                            >
                                -
                            </button>
                            <span className="min-w-[40px] text-center text-sm font-bold text-apple-text">{unit}</span>
                            {/* Adding another of a device that is already gone can only
                                end in a declined payment. */}
                            <button
                                className="h-10 w-10 rounded-full text-xl text-apple-gray hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-30"
                                onClick={() => insertAfter(Math.max(...deviceIndices), device._id)}
                                disabled={outOfStock}
                                title={outOfStock ? 'This device has been sold' : 'Add one more'}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className={`text-sm font-bold ${outOfStock ? 'text-brand-red underline' : 'text-apple-gray hover:text-brand-red'}`}
                            onClick={removeGroup}
                        >
                            {outOfStock
                                ? 'Remove sold item'
                                : hasAccessories ? 'Remove item and add-ons' : 'Remove item'}
                        </button>
                    </div>
                </div>
            ) : null}

            {/* Add-ons belong to the device above, so they are shown inside its
                card instead of as separate purchases of their own. */}
            {hasAccessories ? (
                <div className={device ? 'mt-6 border-t border-black/[0.06] pt-5' : ''}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        {device ? 'Added with this device' : 'Accessories'}
                    </p>

                    <div className="mt-4 space-y-3">
                        {accessories.map((entry) => (
                            <div
                                key={entry.product._id}
                                className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[22px] bg-surface-alt px-4 py-3"
                            >
                                <AccessoryThumb product={entry.product} />

                                <div className="min-w-[140px] flex-1">
                                    <div className="text-[15px] font-bold text-apple-text">
                                        {entry.product.productName}
                                    </div>
                                    <div className="mt-0.5 text-xs text-ink-soft">
                                        ${entry.product.price.toFixed(2)} each
                                    </div>
                                </div>

                                <MiniStepper
                                    quantity={entry.indices.length}
                                    onAdd={() => addAccessory(entry.product._id)}
                                    onRemove={() => dropIndex(Math.max(...entry.indices))}
                                />

                                <div className="w-[72px] text-right text-[15px] font-bold text-apple-text">
                                    ${(entry.product.price * entry.indices.length).toFixed(2)}
                                </div>

                                {/* ml-auto only bites once the row wraps on a
                                    narrow screen, where it keeps this under the
                                    price rather than adrift on the left. */}
                                <button
                                    type="button"
                                    className="ml-auto text-xs font-bold text-apple-gray hover:text-brand-red"
                                    onClick={() => dropIndices(entry.indices)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4">
                        <span className="text-sm font-bold text-apple-text">
                            {device ? 'Item total' : 'Accessories total'}
                        </span>
                        <span className="text-lg font-extrabold text-apple-text">
                            ${groupSubtotal(group).toFixed(2)}
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CartProduct;

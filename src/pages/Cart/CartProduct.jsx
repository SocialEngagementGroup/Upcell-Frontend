import React, { useState } from 'react';
import {
    groupSubtotal,
    groupLastIndex,
    groupUnitCount,
    lineTotal,
    variantLabel,
} from '../../utilities/cartGrouping';

// Accessory photos are not in the catalogue yet, and a device photo can fail
// too. A broken image with its filename spelled out beside a $999 device reads
// as a fault in the order, so fall back to something plain and deliberate.
const Thumb = ({ src, alt, size = 'h-14 w-14', faded = false }) => {
    const [failed, setFailed] = useState(false);

    return (
        <div className={`flex ${size} shrink-0 items-center justify-center rounded-[16px] bg-white`}>
            {failed || !src ? (
                <span className="text-lg font-extrabold text-apple-gray">
                    {(alt || '?').charAt(0)}
                </span>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setFailed(true)}
                    className={`h-[76%] w-auto object-contain ${faded ? 'opacity-40 grayscale' : ''}`}
                />
            )}
        </div>
    );
};

const Stepper = ({ quantity, onAdd, onRemove, addDisabled, addTitle }) => (
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
            className="h-7 w-7 rounded-full text-base text-apple-gray hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-30"
            onClick={onAdd}
            disabled={addDisabled}
            title={addTitle}
            aria-label="Add one"
        >
            +
        </button>
    </div>
);

// Versions of the device and accessories bought with it are the same shape of
// thing to read: what it is, what one costs, how many, what that comes to. One
// row serves both so the card reads as a single list rather than two designs.
const LineRow = ({ label, sublabel, thumb, quantity, price, total, sold, onAdd, onRemove, onRemoveAll }) => (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-[22px] bg-surface-alt px-3 py-3 sm:px-4">
        {thumb}

        <div className="min-w-[130px] flex-1">
            <div className={`text-[15px] font-bold ${sold ? 'text-apple-gray' : 'text-apple-text'}`}>
                {label}
            </div>
            <div className="mt-0.5 text-xs text-ink-soft">
                {sold ? (
                    <span className="font-bold text-brand-red">Sold — no longer available</span>
                ) : (
                    // The unit price, always. Without it a line reading
                    // "$4076.00" gives no way to check the arithmetic, which is
                    // the whole complaint about a cart you cannot verify.
                    <>${price.toFixed(2)} each{sublabel ? ` · ${sublabel}` : ''}</>
                )}
            </div>
        </div>

        {/* The controls travel together. Left loose they wrap one at a time, and
            a lone remove button on its own line beneath the price reads as if it
            belongs to nothing. */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
            <Stepper
                quantity={quantity}
                onAdd={onAdd}
                onRemove={onRemove}
                addDisabled={sold}
                addTitle={sold ? 'This device has been sold' : 'Add one more'}
            />

            <div className={`w-[74px] text-right text-[15px] font-bold tabular-nums ${sold ? 'text-apple-gray line-through' : 'text-apple-text'}`}>
                ${total.toFixed(2)}
            </div>

            {/* Named for screen readers — a bare "×" announces as nothing. */}
            <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none text-apple-gray hover:bg-white hover:text-brand-red"
                onClick={onRemoveAll}
                aria-label={`Remove ${label}`}
                title={`Remove ${label}`}
            >
                ×
            </button>
        </div>
    </div>
);

const CartProduct = ({ group, setCart }) => {
    const { title, image, variants, accessories } = group;
    const hasDevice = variants.length > 0;
    const hasAccessories = accessories.length > 0;
    const units = groupUnitCount(group);
    const anySold = variants.some((entry) => entry.product.outOfStock);

    // Cart edits work on positions, not ids. The same case can sit under two
    // different devices, and only one of the two is being changed.
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

    // A new accessory goes at the end of this card, so it stays with the device
    // it was chosen for rather than attaching to whatever was added last.
    const addAccessory = (id) => insertAfter(groupLastIndex(group), id);

    // Dropping the device drops what was bought to go on it. A case for a
    // device that is no longer in the order is not something anyone meant to keep.
    const removeGroup = () => dropIndices([
        ...variants.flatMap((entry) => entry.indices),
        ...accessories.flatMap((entry) => entry.indices),
    ]);

    const row = (entry, isAccessory) => (
        <LineRow
            key={entry.product._id}
            label={isAccessory ? entry.product.productName : variantLabel(entry.product)}
            sublabel={isAccessory ? null : entry.product.condition}
            thumb={
                <Thumb
                    src={entry.product.image}
                    alt={isAccessory ? entry.product.productName : variantLabel(entry.product)}
                    faded={entry.product.outOfStock}
                />
            }
            quantity={entry.indices.length}
            price={entry.product.price}
            total={lineTotal(entry)}
            sold={entry.product.outOfStock}
            onAdd={() =>
                isAccessory
                    ? addAccessory(entry.product._id)
                    : insertAfter(Math.max(...entry.indices), entry.product._id)
            }
            onRemove={() => dropIndex(Math.max(...entry.indices))}
            onRemoveAll={() => dropIndices(entry.indices)}
        />
    );

    return (
        <div className={`premium-card rounded-[32px] p-5 md:p-6 ${anySold ? 'border-2 border-brand-red/40' : ''}`}>
            {hasDevice ? (
                <>
                    <div className="flex flex-wrap items-center gap-5">
                        <div className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#f8f8fa_0%,#edf0f5_100%)]">
                            <Thumb src={image} alt={title} size="h-full w-full" />
                        </div>

                        <div className="min-w-[180px] flex-1">
                            <h3 className="text-[26px] leading-[1.06]">{title}</h3>
                            <p className="mt-2 text-sm text-ink-soft">
                                {/* Says plainly what the card contains, which is what
                                    four identical headings could not. */}
                                {variants.length > 1
                                    ? `${variants.length} versions · ${units} ${units === 1 ? 'device' : 'devices'}`
                                    : `${units} ${units === 1 ? 'device' : 'devices'}`}
                                {' · Condition checked and securely reset'}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-extrabold text-apple-text">
                                ${groupSubtotal(group).toFixed(2)}
                            </div>
                            <button
                                type="button"
                                className="mt-2 text-sm font-bold text-apple-gray hover:text-brand-red"
                                onClick={removeGroup}
                            >
                                {hasAccessories ? 'Remove all' : 'Remove item'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {variants.map((entry) => row(entry, false))}
                    </div>
                </>
            ) : null}

            {/* Add-ons belong to the device above, so they are shown inside its
                card instead of as separate purchases of their own. */}
            {hasAccessories ? (
                <div className={hasDevice ? 'mt-6 border-t border-black/[0.06] pt-5' : ''}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        {hasDevice ? 'Added with this device' : 'Accessories'}
                    </p>
                    <div className="mt-4 space-y-3">
                        {accessories.map((entry) => row(entry, true))}
                    </div>
                </div>
            ) : null}

            {/* Only worth a total line when the card holds more than one thing to
                add up. */}
            {variants.length + accessories.length > 1 ? (
                <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4">
                    <span className="text-sm font-bold text-apple-text">Item total</span>
                    <span className="text-lg font-extrabold text-apple-text">
                        ${groupSubtotal(group).toFixed(2)}
                    </span>
                </div>
            ) : null}
        </div>
    );
};

export default CartProduct;

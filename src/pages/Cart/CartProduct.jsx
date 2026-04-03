import React from 'react';

const CartProduct = ({ product, setCart, cart }) => {
    const { _id, productName, storage, color, price, image } = product;
    const unit = cart.filter((id) => _id === id).length;

    const removeSingleItem = () => {
        const itemIndex = cart.indexOf(_id);
        if (itemIndex !== -1) {
            setCart((prev) => prev.filter((item, index) => !(item === _id && index === itemIndex)));
        }
    };

    const addSingleItem = () => setCart((prev) => [...prev, _id]);
    const removeAll = () => setCart((prev) => prev.filter((id) => id !== _id));

    return (
        <div className="premium-card grid gap-6 rounded-[32px] p-5 md:grid-cols-[140px_1fr_180px] md:items-center md:p-6">
            <div className="flex h-[140px] items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#f8f8fa_0%,#edf0f5_100%)]">
                <img src={image} alt={productName} className="h-[78%] w-auto object-contain" />
            </div>

            <div>
                <h3 className="text-[30px] leading-[1.02]">{productName}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface-alt px-3 py-2 text-xs font-bold text-apple-gray">{color?.name || 'Apple finish'}</span>
                    <span className="rounded-full bg-surface-alt px-3 py-2 text-xs font-bold text-apple-gray">{storage}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-ink-soft">Condition checked, securely reset, and packed for fast delivery.</p>
            </div>

            <div className="flex flex-col gap-4 md:items-end">
                <div className="text-2xl font-extrabold text-apple-text">${(price * unit).toFixed(2)}</div>
                <div className="flex items-center rounded-full border border-black/[0.08] bg-white px-3 py-2">
                    <button className="h-10 w-10 rounded-full text-xl text-apple-gray hover:bg-surface-alt" onClick={removeSingleItem}>-</button>
                    <span className="min-w-[40px] text-center text-sm font-bold text-apple-text">{unit}</span>
                    <button className="h-10 w-10 rounded-full text-xl text-apple-gray hover:bg-surface-alt" onClick={addSingleItem}>+</button>
                </div>
                <button className="text-sm font-bold text-apple-gray hover:text-brand-red" onClick={removeAll}>
                    Remove item
                </button>
            </div>
        </div>
    );
};

export default CartProduct;

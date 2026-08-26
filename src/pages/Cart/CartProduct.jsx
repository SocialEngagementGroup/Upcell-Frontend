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

    // TODO(redesign): build the new cart line-item UI here.
    return (
        <div>
            <img src={image} alt={productName} />
            <h3>{productName}</h3>
            <span>{color?.name || 'Apple finish'}</span>
            <span>{storage}</span>
            <div>${(price * unit).toFixed(2)} USD</div>
            <button type="button" onClick={removeSingleItem}>-</button>
            <span>{unit}</span>
            <button type="button" onClick={addSingleItem}>+</button>
            <button type="button" onClick={removeAll}>Remove item</button>
        </div>
    );
};

export default CartProduct;

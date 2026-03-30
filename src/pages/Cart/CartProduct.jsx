import React from 'react';
import "./CartProduct.css"

const CartProduct = ({ product, setCart, cart }) => {
    const { parentCatagory, _id, productName, description, storage, color, price, discountPrice, originalPrice, reviewScore, peopleReviewed, condition, image } = product

    const unit = cart.filter(id => _id === id).length

    const removeItemFromCart = () => {
        const itemIndex = cart.indexOf(_id)
        if(itemIndex !== -1){
            setCart(prev => prev.filter((item, ind) => itemIndex !== ind))
        }
    }
    const addItemToCart = () => {
        setCart(prev => [...prev, _id])
    }
    return (
        <div className='single-cart-product'>
            <img 
                src={image} 
                alt={productName} 
                className='cart-product-image'
            />
            
            <div className='cart-item-info'>
                <h3>{productName}</h3>
                <div className='cart-item-meta'>
                    <span>Color: {color?.name}</span>
                    <span>Storage: {storage}</span>
                    <span>Condition: {condition}</span>
                </div>
            </div>

            <div className='cart-controls-area'>
                <p className='cart-price'>$ {price * unit}</p>
                <div className='quantity-pill'>
                    <button onClick={removeItemFromCart}>-</button>
                    <span>{unit}</span>
                    <button onClick={addItemToCart}>+</button>
                </div>
                <button 
                    className='btn-remove-item' 
                    onClick={() => setCart(prev => prev.filter(id => id !== _id))}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartProduct;
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

            <div className='product-details'>
                <img src={image} alt='product image'></img>
                <div>
                    <h3>{productName}</h3>
                    <small>Color: {color?.name}</small>
                    <small>Storage: {storage}</small>
                    <small>Condition: {condition}</small>
                </div>
            </div>

            <div className='quantity'>
                <div>
                    <button onClick={removeItemFromCart}>-</button>
                    <p>{unit}</p>
                    <button onClick={addItemToCart}>+</button>
                </div>
            </div>

            <div className="item-center">
                <p className='big-hide'>Unit Price</p>
                <p className='price'>$ {price}</p>
            </div>

            <div className="item-center">
                <p className='big-hide'>Subtotal</p>
                <p className="price"> $ {price * unit}</p>
            </div>

        </div>
    );
};

export default CartProduct;
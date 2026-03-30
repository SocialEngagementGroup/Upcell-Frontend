import React from 'react';
import "./CheckoutSingleProduct.css"

const CheckoutSingleProduct = ({cart, product}) => {
    const { parentCatagory, _id, productName, description, storage, color, price, discountPrice, originalPrice, reviewScore, peopleReviewed, condition, image } = product

    const unit = cart.filter(id => _id === id).length


    return (
        <div className='singleCheckout'>
            <div className='product-details'>
                <img src={image} alt='product image'></img>
                <div>
                    <h3>{productName}</h3>
                    <small>Color: {color?.name}</small>
                    <small>Storage: {storage}</small>
                    <small>Condition: {condition}</small>
                </div>
            </div>

            <p className='unit'>x{unit}</p>

            <p className='price'>$ {unit * price}</p>
        </div>
    );
};

export default CheckoutSingleProduct;
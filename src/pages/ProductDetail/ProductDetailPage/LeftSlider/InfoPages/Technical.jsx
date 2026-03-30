import React from 'react';

const Technical = ({product}) => {
    return (
        <>
        <h2>{product?.productName} - {product?.storage} - {product?.color?.name} - {product?.description}</h2>
        
        <h3>Verified refurbished</h3>
        <p>Reborn electronics are like new — just better for the planet and your pocket. Our sellers are electronics experts who test and verify that every device is clean and 100% functional before it goes out for delivery. You get what it says on the box or your money back.</p>

        <h4><span>Model</span> <span>{product?.productName}</span></h4>
        <h4><span>Storage</span> <span>{product?.storage}</span></h4>
        <h4><span>Color</span> <span>{product?.color?.name}</span></h4>
        <h4><span>Condition</span> <span>{product?.condition}</span></h4>
        <h4><span>Brand</span> <span>Apple</span></h4>

        </>
    );
};

export default Technical;
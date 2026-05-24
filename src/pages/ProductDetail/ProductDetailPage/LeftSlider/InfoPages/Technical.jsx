import React from 'react';

const Technical = ({product}) => {
    return (
        <>
        <h2>{product?.productName} - {product?.storage} - {product?.color?.name} - {product?.description}</h2>
        
        <h3>Certified premium</h3>
        <p>Every premium Apple device we sell is restored to feel like new, and it is better for both the planet and your wallet. Our specialists test and verify that each device is clean and fully functional before it ships. You get exactly what the listing promises, or your money back.</p>

        <h4><span>Model</span> <span>{product?.productName}</span></h4>
        <h4><span>Storage</span> <span>{product?.storage}</span></h4>
        <h4><span>Color</span> <span>{product?.color?.name}</span></h4>
        <h4><span>Condition</span> <span>{product?.condition}</span></h4>
        <h4><span>Brand</span> <span>Apple</span></h4>

        </>
    );
};

export default Technical;
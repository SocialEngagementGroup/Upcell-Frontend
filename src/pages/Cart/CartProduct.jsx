import React from 'react';

const CartProduct = ({ product, setCart, cart }) => {
    const { _id, productName, storage, color, price, condition, image } = product
    const unit = cart.filter(id => _id === id).length

    const removeItemFromCart = () => {
        const itemIndex = cart.indexOf(_id)
        if(itemIndex !== -1) setCart(prev => prev.filter((item, ind) => itemIndex !== ind))
    }
    const addItemToCart = () => setCart(prev => [...prev, _id])

    return (
        <div className='bg-white p-6 rounded-3xl border border-black/5 grid grid-cols-[120px_1fr_150px] gap-8 items-center transition-all duration-[400ms] ease-bounce-out hover:border-brand-red/20 hover:shadow-medium max-md:grid-cols-[80px_1fr] max-md:gap-5 max-md:p-4'>
            <img src={image} alt={productName} className='w-[120px] h-[120px] object-contain bg-surface-alt rounded-2xl p-2.5 max-md:w-20 max-md:h-20' />
            
            <div className='flex flex-col gap-2'>
                <h3 className='text-lg font-bold m-0 leading-tight'>{productName}</h3>
                <div className='flex gap-2 flex-wrap'>
                    <span className='text-[12px] font-semibold text-apple-gray bg-surface-alt px-3 py-1 rounded-lg'>Color: {color?.name}</span>
                    <span className='text-[12px] font-semibold text-apple-gray bg-surface-alt px-3 py-1 rounded-lg'>Storage: {storage}</span>
                    <span className='text-[12px] font-semibold text-apple-gray bg-surface-alt px-3 py-1 rounded-lg'>Condition: {condition}</span>
                </div>
            </div>

            <div className='flex flex-col items-end gap-4 max-md:col-span-2 max-md:flex-row max-md:justify-between max-md:items-center max-md:border-t max-md:border-black/5 max-md:pt-4 max-md:mt-2'>
                <p className='text-lg font-extrabold text-apple-text'>$ {price * unit}</p>
                <div className='flex items-center bg-surface-alt rounded-full p-1 gap-3'>
                    <button className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg font-semibold shadow-sm transition-all duration-300 hover:bg-brand-red hover:text-white' onClick={removeItemFromCart}>-</button>
                    <span className='font-bold min-w-[20px] text-center text-apple-text'>{unit}</span>
                    <button className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg font-semibold shadow-sm transition-all duration-300 hover:bg-brand-red hover:text-white' onClick={addItemToCart}>+</button>
                </div>
                <button className='text-xs text-brand-red font-bold bg-transparent p-0 mt-2 uppercase tracking-[0.05em] hover:opacity-70 transition-opacity' onClick={() => setCart(prev => prev.filter(id => id !== _id))}>Remove</button>
            </div>
        </div>
    );
};

export default CartProduct;
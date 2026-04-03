import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from "jsbarcode";

const SingleCustomerOrder = ({ order }) => {
    const { line_items, name, email, phone, city, postal, street, country, shipping, paid, status, createdAt, updatedAt } = order;
    const [showDetails, setShowDetails] = useState(false);
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, order?._id.toString());
        }
    }, [order]);

    const total = line_items.reduce((sum, item) => sum + (item?.price_data?.product_data?.metadata?.totalPaid || 0), 0);

    return (
        <div className="premium-card rounded-[30px] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_220px]">
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Total amount: <strong className="text-apple-text">${total.toFixed(2)}</strong></p>
                    <p>Order ID: <strong className="text-apple-text">{order._id}</strong></p>
                </div>
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Payment date: <strong className="text-apple-text">{(new Date(createdAt)).toLocaleString()}</strong></p>
                    <p>Last updated: <strong className="text-apple-text">{(new Date(updatedAt)).toLocaleString()}</strong></p>
                </div>
                <div className="space-y-3">
                    <p className="text-sm text-ink-soft">Shipping: <strong className="text-apple-text uppercase">{shipping}</strong></p>
                    <p className={`text-sm font-bold ${paid ? 'text-green-600' : 'text-red-600'}`}>{status}</p>
                    <button className="premium-button-secondary w-full justify-center" onClick={() => setShowDetails((prev) => !prev)}>
                        {showDetails ? "Hide details" : "Show details"}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="mt-6 grid gap-6 border-t border-black/[0.06] pt-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <h4 className="mb-4 text-[24px]">Product details</h4>
                        <div className="space-y-4">
                            {line_items.map((item, index) => {
                                const productData = item.price_data.product_data;
                                return (
                                    <div key={index} className="rounded-[24px] bg-surface-alt p-4">
                                        <div className="flex gap-4">
                                            {productData.images && <img src={productData.images[0]} alt='product' className="h-16 w-16 rounded-2xl bg-white object-contain p-2" />}
                                            <div className="flex-1">
                                                <h5 className="text-lg font-bold text-apple-text">{productData.name}</h5>
                                                <small className="text-ink-soft">{productData.description}</small>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className='font-bold text-apple-text'>x{productData?.metadata?.quantity}</p>
                                                <p className='text-ink-soft'>$ {productData?.metadata?.totalPaid}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-base font-bold text-apple-text">Total</p>
                            <p className="text-xl font-extrabold text-apple-text">$ {total.toFixed(2)}</p>
                        </div>
                        <img className="mt-5 max-w-full" ref={barcodeRef} alt="order barcode" />
                    </div>

                    <div className="rounded-[28px] bg-surface-alt p-5">
                        <h4 className="mb-4 text-[24px]">Shipping information</h4>
                        <div className="space-y-2 text-sm text-ink-soft">
                            <p>Name: <strong className="text-apple-text">{name}</strong></p>
                            <p>Email: <strong className="text-apple-text">{email}</strong></p>
                            <p>Phone: <strong className="text-apple-text">{phone}</strong></p>
                            <p>City: <strong className="text-apple-text">{city}</strong></p>
                            <p>Street: <strong className="text-apple-text">{street}</strong></p>
                            <p>Postal code: <strong className="text-apple-text">{postal}</strong></p>
                            <p>Country: <strong className="text-apple-text">{country}</strong></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleCustomerOrder;

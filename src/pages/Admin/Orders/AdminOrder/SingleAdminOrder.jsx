import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from "../../../../utilities/axiosInstance";
import JsBarcode from "jsbarcode";
import { toast } from 'react-toastify';
import { ORDER_STATUS_OPTIONS, orderStatusLabel, paymentDisplay } from "../../../../constants/orderStatus";
import RefundPanel from "./RefundPanel";

const SingleAdminOrder = ({ order, onStatusChanged }) => {
    const { line_items, name, email, phone, city, postal, street, country, shipping, paid, status, createdAt, updatedAt, boaTransactionId, cardBrand, cardLast4 } = order;
    const [shippingStatus, setShippingStatus] = useState(status);
    const [showDetails, setShowDetails] = useState(false);
    const barcodeRef = useRef(null);

    const changeShippingStatus = async (e) => {
        if (window.confirm("Are you sure about the new changed Status ?!")) {
            const nextStatus = e.target.value;
            setShippingStatus(nextStatus);
            try {
                await axiosInstance.post("update-order-status", { orderId: order._id, status: nextStatus });
                onStatusChanged?.();
                toast.success(`Order marked as ${nextStatus}`);
            } catch (error) {
                console.log(error);
                setShippingStatus(status);
                toast.error('Order status update failed');
            }
        }
    };

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, order?._id.toString());
        }
    }, [order]);

    const total = line_items.reduce((sum, item) => sum + (item?.price_data?.product_data?.metadata?.totalPaid || 0), 0);
    const payment = paymentDisplay({ paid, status });

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_240px]">
                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Total amount: <strong className="text-apple-text">${total}</strong></p>
                    <p>Payment: <strong className={payment.className}>{payment.text}</strong></p>
                    <p>Order ID: <strong className="text-apple-text">{order._id}</strong></p>
                </div>

                <div className="space-y-2 text-sm text-ink-soft">
                    <p>Customer email: <strong className="text-apple-text">{email}</strong></p>
                    <p>Payment date: <strong className="text-apple-text">{(new Date(createdAt)).toLocaleString()}</strong></p>
                    <p>Last updated: <strong className="text-apple-text">{(new Date(updatedAt)).toLocaleString()}</strong></p>
                    {/* Stored on every Bank of America order since the first
                        payment, never shown here until now — the one thing
                        Raymond or Yasir need to find this transaction in the
                        Business Center, and this saved them opening the raw
                        database to get it. */}
                    {cardBrand || cardLast4 ? (
                        <p>Card: <strong className="text-apple-text">{[cardBrand, cardLast4 && `••${cardLast4}`].filter(Boolean).join(' ')}</strong></p>
                    ) : null}
                    {boaTransactionId ? (
                        <p>Bank transaction ID: <strong className="text-apple-text">{boaTransactionId}</strong></p>
                    ) : null}
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-ink-soft">Shipping method: <strong className="text-apple-text uppercase">{shipping}</strong></p>
                    <select className="admin-select" value={shippingStatus} onChange={changeShippingStatus}>
                        {ORDER_STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>{orderStatusLabel(option)}</option>
                        ))}
                    </select>
                    <button className="premium-button-secondary w-full justify-center" onClick={() => setShowDetails((prev) => !prev)}>
                        {showDetails ? 'Hide details' : 'Show details'}
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
                                    <div className="rounded-[24px] bg-surface-alt p-4" key={index}>
                                        <div className="flex gap-4">
                                            {productData.images && <img src={productData.images[0]} alt="product" className="h-16 w-16 rounded-2xl bg-white object-contain p-2" />}
                                            <div className="flex-1">
                                                <h5 className="text-lg font-bold text-apple-text">{productData.name}</h5>
                                                <small className="text-ink-soft">{productData.description}</small>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="font-bold text-apple-text">x{productData?.metadata?.quantity}</p>
                                                <p className="text-ink-soft">$ {productData?.metadata?.totalPaid}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-base font-bold text-apple-text">Total</p>
                            <p className="text-xl font-extrabold text-apple-text">$ {total}</p>
                        </div>
                        <img className="mt-5 max-w-full" ref={barcodeRef} alt="order barcode" />
                    </div>

                    <div className="space-y-6">
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

                        <RefundPanel order={order} onRefunded={onStatusChanged} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleAdminOrder;

import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from "jsbarcode";
import RefundRequestPanel from "./RefundRequestPanel";
import { resolveImageRef } from "../../utilities/cloudinary";

const money = (cents) => "$" + (Number(cents || 0) / 100).toFixed(2);

// items[] is the shape the API sends now, and the only one chunk 7 keeps. An
// order written before the chunk 6 migration ran carries only the legacy
// line_items, so those are mapped across rather than showing a customer an
// empty order.
const linesOf = (order) => {
    if (order?.items?.length) return order.items;

    return (order?.line_items || [])
        .filter((line) => line?.price_data?.product_data?.metadata?.productId)
        .map((line) => {
            const product = line.price_data.product_data;
            return {
                productId: product.metadata.productId,
                name: product.name,
                description: product.description,
                image: product.images?.[0],
                quantity: product.metadata.quantity,
                lineTotalCents: Math.round((product.metadata.totalPaid || 0) * 100),
            };
        });
};

const SingleCustomerOrder = ({ order }) => {
    const { name, email, phone, city, postal, street, country, shipping, paid, status, createdAt, updatedAt } = order;
    const lines = linesOf(order);
    const [showDetails, setShowDetails] = useState(false);
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, order?._id.toString());
        }
    }, [order]);

    // The figure the bank was sent, when the order has it. Summing the device
    // lines instead — as this did — leaves out tax and shipping, so a customer
    // comparing this against their statement saw two different numbers.
    const totalCents = order.totalCents != null
        ? order.totalCents
        : lines.reduce((sum, line) => sum + (line.lineTotalCents || 0), 0);

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
                            {lines.map((line, index) => (
                                <div key={line.productId || index} className="rounded-[24px] bg-surface-alt p-4">
                                    <div className="flex gap-4">
                                        {line.image && <img src={resolveImageRef(line.image, { width: 120 })} alt='product' className="h-16 w-16 rounded-2xl bg-white object-contain p-2" />}
                                        <div className="flex-1">
                                            <h5 className="text-lg font-bold text-apple-text">{line.name}</h5>
                                            <small className="text-ink-soft">{line.description}</small>
                                            {/* The device's own identity, on the record of the
                                                order that bought it. It is what a customer needs
                                                when they call the carrier or claim on insurance. */}
                                            {line.imei ? (
                                                <small className="mt-1 block font-mono text-xs text-apple-gray">IMEI {line.imei}</small>
                                            ) : null}
                                        </div>
                                        <div className="text-right text-sm">
                                            <p className='font-bold text-apple-text'>x{line.quantity}</p>
                                            <p className='text-ink-soft'>{money(line.lineTotalCents)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-base font-bold text-apple-text">Total {order.totalCents != null ? 'charged' : ''}</p>
                            <p className="text-xl font-extrabold text-apple-text">{money(totalCents)}</p>
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

                    {/* Full width under both columns: the return form needs the
                        room, and it is an action on the order rather than more
                        detail about it. Only offered on a paid order — the
                        panel itself decides whether a return is possible. */}
                    {paid ? (
                        <div className="lg:col-span-2">
                            <RefundRequestPanel order={order} />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SingleCustomerOrder;

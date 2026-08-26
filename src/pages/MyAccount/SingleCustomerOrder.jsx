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

    // TODO(redesign): build the new order card UI here.
    return (
        <div>
            <p>Total amount: <strong>${total.toFixed(2)}</strong></p>
            <p>Order ID: <strong>{order._id}</strong></p>
            <p>Payment date: <strong>{(new Date(createdAt)).toLocaleString()}</strong></p>
            <p>Last updated: <strong>{(new Date(updatedAt)).toLocaleString()}</strong></p>
            <p>Shipping: <strong>{shipping}</strong></p>
            <p data-paid={Boolean(paid)}>{status}</p>

            <button type="button" onClick={() => setShowDetails((prev) => !prev)}>
                {showDetails ? "Hide details" : "Show details"}
            </button>

            {showDetails && (
                <div>
                    <h4>Product details</h4>
                    {line_items.map((item, index) => {
                        const productData = item.price_data.product_data;
                        return (
                            <div key={index}>
                                {productData.images && <img src={productData.images[0]} alt="product" />}
                                <h5>{productData.name}</h5>
                                <small>{productData.description}</small>
                                <p>x{productData?.metadata?.quantity}</p>
                                <p>${productData?.metadata?.totalPaid}</p>
                            </div>
                        );
                    })}
                    <p>Total: ${total.toFixed(2)}</p>
                    <img ref={barcodeRef} alt="order barcode" />

                    <h4>Shipping information</h4>
                    <p>Name: <strong>{name}</strong></p>
                    <p>Email: <strong>{email}</strong></p>
                    <p>Phone: <strong>{phone}</strong></p>
                    <p>City: <strong>{city}</strong></p>
                    <p>Street: <strong>{street}</strong></p>
                    <p>Postal code: <strong>{postal}</strong></p>
                    <p>Country: <strong>{country}</strong></p>
                </div>
            )}
        </div>
    );
};

export default SingleCustomerOrder;

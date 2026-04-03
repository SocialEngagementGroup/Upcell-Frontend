import axiosInstance from "../../../../utilities/axiosInstance";
import React, { useEffect, useState } from 'react';
import SingleAdminOrder from "./SingleAdminOrder";

const statuses = ["Processing", "Shipped", "Delivered", "Returned", "Refunded", "payment failed"];

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState("Processing");
    const [email, setEmail] = useState("");
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        axiosInstance.get(`admin-orders/${orderStatus}`)
            .then((res) => setOrders(res.data))
            .catch((error) => console.log(error));
        setEmail("");
        setOrderId("");
    }, [orderStatus]);

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                className={orderStatus === status ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => setOrderStatus(status)}
                            >
                                {status === 'Processing' ? 'Paid' : status}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by order ID</div>
                            <div className="flex gap-3">
                                <input className="admin-input" type="text" placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                                <button className="premium-button px-5" onClick={() => setOrderStatus(`byOrderId:${orderId}`)}>Search</button>
                            </div>
                        </div>
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                            <div className="flex gap-3">
                                <input className="admin-input" type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button className="premium-button px-5" onClick={() => setOrderStatus(`byEmail:${email}`)}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {orders.map((order) => <SingleAdminOrder key={order._id} order={order} />)}
            </div>
        </section>
    );
};

export default AdminOrder;

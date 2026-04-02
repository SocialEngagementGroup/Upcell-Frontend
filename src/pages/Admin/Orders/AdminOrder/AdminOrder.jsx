import axiosInstance from "../../../../utilities/axiosInstance";
import "./AdminOrder.css"

import React, { useEffect, useState } from 'react';
import SingleAdminOrder from "./SingleAdminOrder";

const AdminOrder = () => {
    const [orders, setOrders] = useState([])
    const [orderStatus, setOrderStatus] = useState("Processing")
    const [email, setEmail] = useState("")
    const [orderId, setOrderId] = useState("")

    useEffect(() => {
        axiosInstance.get(`admin-orders/${orderStatus}`)
            .then(res => setOrders(res.data))
            .catch(error => console.log(error))
        setEmail("")
        setOrderId("")
    }, [orderStatus])


    return (
        <main className="admin-order">
            <div className="stausFilter">
                <div className="statusButtons">
                    <button className={orderStatus === "Processing" ? "active" : ""} onClick={() => setOrderStatus("Processing")}>Paid</button>

                    <button className={orderStatus === "Shipped" ? "active" : ""} onClick={() => setOrderStatus("Shipped")}>Shipped</button>

                    <button className={orderStatus === "Delivered" ? "active" : ""} onClick={() => setOrderStatus("Delivered")}>Delivered</button>

                    <button className={orderStatus === "Returned" ? "active" : ""} onClick={() => setOrderStatus("Returned")}>Returned</button>

                    <button className={orderStatus === "Refunded" ? "active" : ""} onClick={() => setOrderStatus("Refunded")}>Refunded</button>

                    <button className={orderStatus === "payment failed" ? "active" : ""} onClick={() => setOrderStatus("payment failed")}>Payment failed</button>
                </div>

                <div className="filterOptions">
                    <div className="singleFilter">
                        <input type="text" placeholder="Order Id" value={orderId} onChange={(e)=> setOrderId(e.target.value)} />

                        <button onClick={()=>setOrderStatus(`byOrderId:${orderId}`)}>Search by Id</button>
                    </div>

                    <div className="singleFilter">
                        <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />

                        <button onClick={()=>setOrderStatus(`byEmail:${email}`)}>Search by Email</button>
                    </div>
                </div>

            </div>

            {orders.map(order => <SingleAdminOrder key={order._id} order={order}>
            </SingleAdminOrder>)}
        </main>
    );
};

export default AdminOrder;
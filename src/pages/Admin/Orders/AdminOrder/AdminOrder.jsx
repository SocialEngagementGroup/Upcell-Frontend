import axiosInstance from "../../../../utilities/axiosInstance";
import React, { useEffect, useState } from 'react';
import SingleAdminOrder from "./SingleAdminOrder";
import { toast } from 'react-toastify';
import AdminPagination from "../../../../components/AdminPagination/AdminPagination";
import AdminPageHeader from "../../../../components/AdminPageHeader/AdminPageHeader";
import AdminStatsGrid from "../../../../components/AdminStatsGrid/AdminStatsGrid";
import AdminLoadingState from "../../../../components/AdminState/AdminLoadingState";
import AdminEmptyState from "../../../../components/AdminState/AdminEmptyState";

const statuses = ["Processing", "Shipped", "Delivered", "Returned", "Refunded", "payment failed"];
const PAGE_LIMIT = 10;
const defaultPagination = {
    page: 1,
    limit: PAGE_LIMIT,
    totalItems: 0,
    totalPages: 1,
};

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState("Processing");
    const [email, setEmail] = useState("");
    const [orderId, setOrderId] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(defaultPagination);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async (status = orderStatus, nextPage = page) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`admin-orders/${status}`, {
                params: { page: nextPage, limit: PAGE_LIMIT },
            });
            setOrders(res.data.items || []);
            setPagination(res.data.pagination || defaultPagination);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(orderStatus, page);
    }, [orderStatus, page]);

    useEffect(() => {
        setEmail("");
        setOrderId("");
    }, [orderStatus]);

    const applyStatusFilter = (nextStatus) => {
        if (nextStatus === orderStatus) {
            if (page === 1) {
                fetchOrders(nextStatus, 1);
                return;
            }

            setPage(1);
            return;
        }

        setOrderStatus(nextStatus);
        setPage(1);
    };

    const handleOrderIdSearch = (event) => {
        event.preventDefault();
        const nextFilter = `byOrderId:${orderId}`;

        if (nextFilter === orderStatus && page === 1) {
            fetchOrders(nextFilter, 1);
        } else {
            setOrderStatus(nextFilter);
            setPage(1);
        }

    };

    const handleEmailSearch = (event) => {
        event.preventDefault();
        const nextFilter = `byEmail:${email}`;

        if (nextFilter === orderStatus && page === 1) {
            fetchOrders(nextFilter, 1);
        } else {
            setOrderStatus(nextFilter);
            setPage(1);
        }

    };

    const stats = [
        { label: 'Results', value: pagination.totalItems, sub: 'orders matching the current filter' },
        { label: 'Showing', value: orders.length, sub: 'orders on this page' },
        { label: 'Page', value: `${pagination.page}/${pagination.totalPages}`, sub: 'current pagination position' },
        { label: 'View', value: orderStatus === 'Processing' ? 'Paid' : orderStatus, sub: 'active order filter' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Orders"
                title="Manage customer orders."
                description="Track fulfillment, search by customer or order ID, and keep shipping progress moving."
            />

            <AdminStatsGrid items={stats} />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                className={orderStatus === status ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => applyStatusFilter(status)}
                            >
                                {status === 'Processing' ? 'Paid' : status}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by order ID</div>
                            <form className="flex gap-3" onSubmit={handleOrderIdSearch}>
                                <input className="admin-input" type="text" placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                                <button className="premium-button px-5" type="submit">Search</button>
                            </form>
                        </div>
                        <div className="rounded-[28px] bg-surface-alt p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Search by email</div>
                            <form className="flex gap-3" onSubmit={handleEmailSearch}>
                                <input className="admin-input" type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button className="premium-button px-5" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading orders" description="Pulling the latest customer orders for this admin view." />
            ) : orders.length ? (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <SingleAdminOrder
                            key={order._id}
                            order={order}
                            onStatusChanged={() => fetchOrders(orderStatus, page)}
                        />
                    ))}
                    <AdminPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        currentCount={orders.length}
                        itemLabel="orders"
                        onPageChange={setPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No orders found." description="Try another status or search filter." />
            )}
        </section>
    );
};

export default AdminOrder;

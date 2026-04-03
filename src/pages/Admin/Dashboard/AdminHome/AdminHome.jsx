import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../../../utilities/UserContextProvider';
import axiosInstance from '../../../../utilities/axiosInstance';

const AdminHome = () => {
    const [ordersToday, setOrdersToday] = useState({ amount: 0, money: 0 });
    const [ordersWeek, setOrdersWeek] = useState({ amount: 0, money: 0 });
    const [ordersMonth, setOrdersMonth] = useState({ amount: 0, money: 0 });
    const { user } = useContext(userContext);

    useEffect(() => {
        axiosInstance.get('admin-orders-by-data')
            .then((res) => {
                const totalOrders = res.data;

                const sumOrders = (items) => items.reduce((acc, item) => {
                    if (!item.paid) return acc;
                    acc.amount += 1;
                    item.line_items.forEach((line) => {
                        acc.money += line.price_data.unit_amount / 100;
                    });
                    return acc;
                }, { amount: 0, money: 0 });

                setOrdersToday(sumOrders(totalOrders.today));
                setOrdersWeek(sumOrders(totalOrders.thisWeek));
                setOrdersMonth(sumOrders(totalOrders.thisMonth));
            })
            .catch((error) => console.log('error in adminHome.jsx', error));
    }, []);

    const stats = [
        { label: 'Today', value: ordersToday.amount, sub: 'orders placed' },
        { label: 'This week', value: ordersWeek.amount, sub: 'orders placed' },
        { label: 'This month', value: ordersMonth.amount, sub: 'orders placed' },
        { label: 'Today', value: `$${ordersToday.money}`, sub: 'revenue processed' },
        { label: 'This week', value: `$${ordersWeek.money}`, sub: 'revenue processed' },
        { label: 'This month', value: `$${ordersMonth.money}`, sub: 'revenue processed' },
    ];

    return (
        <section className="space-y-8">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-10 md:py-12">
                <span className="eyebrow mb-5">Overview</span>
                <h1 className="text-[clamp(2.3rem,4vw,4rem)] leading-[0.94]">Welcome back{user ? `, ${user.email}` : ''}.</h1>
                <p className="mt-4 max-w-[620px] text-base leading-8 text-ink-soft">Track recent order volume and revenue at a glance before jumping into fulfillment or catalog updates.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {stats.map((item) => (
                    <div key={`${item.label}-${item.sub}`} className="admin-panel rounded-[30px] p-6">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">{item.label}</div>
                        <div className="mt-4 text-[38px] font-extrabold leading-none text-apple-text">{item.value}</div>
                        <div className="mt-2 text-sm text-ink-soft">{item.sub}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdminHome;

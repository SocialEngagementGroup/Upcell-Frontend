import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../../../utilities/UserContextProvider';
import axiosInstance from '../../../../utilities/axiosInstance';
import "./AdminHome.css"


const AdminHome = () => {
    const [ordersToday, setOrdersToday] = useState({ amount: 0, money: 0 })
    const [ordersWeek, setOrdersWeek] = useState({ amount: 0, money: 0 })
    const [ordersMonth, setOrderMonth] = useState({ amount: 0, money: 0 })

    const { user, loading } = useContext(userContext)

    useEffect(() => {
        axiosInstance.get("admin-orders-by-data")
            .then(res => {
                const totalOrders = res.data

                let todayAmount = 0
                let weekAmount = 0
                let monthAmount = 0

                let todayMoney = 0
                let weekMoney = 0
                let monthMoney = 0

                totalOrders.today.forEach(items => {
                    if (items.paid) {
                        todayAmount++
                        items.line_items.forEach(i => {
                            todayMoney += i.price_data.unit_amount / 100
                        })
                    }
                })

                totalOrders.thisWeek.forEach(items => {
                    if (items.paid) {
                        weekAmount++
                        items.line_items.forEach(i => {
                            weekMoney += i.price_data.unit_amount / 100
                        })
                    }
                })

                totalOrders.thisMonth.forEach(items => {
                    if (items.paid) {
                        monthAmount++
                        items.line_items.forEach(i => {
                            monthMoney += i.price_data.unit_amount / 100
                        })
                    }
                })

                setOrdersToday({ amount: todayAmount, money: todayMoney })
                setOrdersWeek({ amount: weekAmount, money: weekMoney })
                setOrderMonth({ amount: monthAmount, money: monthMoney })
            })
            .catch(error => console.log("error in adminHome.jsx", error))
    }, [])

    return (
        <section id='adminHome'>
            {user &&
                <h3>Welcome: <span>{user.email}</span></h3>
            }

            <div id='stats'>

                <div>
                    <p>TODAY</p>
                    <p className="big">{ordersToday?.amount}</p>
                    <small>Total orders today</small>
                </div>

                <div>
                    <p>THIS WEEK</p>
                    <p className="big">{ordersWeek?.amount}</p>
                    <small>Total orders this week</small>
                </div>

                <div>
                    <p>THIS MONTH</p>
                    <p className="big">{ordersMonth?.amount}</p>
                    <small>Total orders this month</small>
                </div>

                {/* prices */}

                <div>
                    <p>TODAY</p>
                    <p className="big">$ {ordersToday?.money}</p>
                    <small>Total orders amount today</small>
                </div>

                <div>
                    <p>THIS WEEK</p>
                    <p className="big">$ {ordersWeek?.money}</p>
                    <small>Total orders amount this week</small>
                </div>

                <div>
                    <p>THIS MONTH</p>
                    <p className="big">$ {ordersMonth?.money}</p>
                    <small>Total orders amount this month</small>
                </div>

            </div>
        </section>
    );
};

export default AdminHome;
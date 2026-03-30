import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utilities/UserContextProvider";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utilities/axiosInstance";
import SingleCustomerOrder from "./SingleCustomerOrder";
import SingleProductOrdered from "./SingleProductOrdered";
import "./MyAccount.css"

const MyAccount = () => {
    const { user, loading, logOut } = useContext(userContext)
    const navigate = useNavigate()

    const [showRecipt, setShowRecipt] = useState(true)

    const handleSingOut = () => {
        logOut().then(() => {
            navigate("/")
        }
        ).catch(error => console.log(error))
    }

    const [orders, setOrders] = useState([])
    const [lineItems, setLineItems] = useState([])

    useEffect(() => {
        axiosInstance.get(`client-orders/${user?.email}`)
            .then(res => {
                const data = res.data
                setOrders(data)

                let singleOrders = [];

                for(const ord of data){
                    for(const item in ord.line_items){
                        singleOrders.push(item)
                    }
                }
                setLineItems(singleOrders)

            })
            .catch(error => console.log(error))
    }, [])


    return (
        <div className="myAccount">

            <div id="accountDetails">
                <h2>Email: {user?.email}</h2>
                <button onClick={handleSingOut}>Sign Out</button>
            </div>

            {/* <div className="orderButtons">
                <button onClick={() => setShowRecipt(false)}>Orders</button>
                <button onClick={() => setShowRecipt(true)}>Order recipts</button>
            </div> */}

            {showRecipt && orders ? 
                orders.map(order => <SingleCustomerOrder key={order._id} order={order}>
                </SingleCustomerOrder>)
                :
                lineItems.map((item, ind) => <SingleProductOrdered key={ind} line_items={lineItems}>
                </SingleProductOrdered>)
            }

        </div>
    );
};

export default MyAccount;
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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user?.email) return;
        setIsLoading(true)
        axiosInstance.get(`client-orders/${user?.email}`)
            .then(res => {
                const data = res.data
                setOrders(data)

                let singleOrders = [];

                for(const ord of data){
                    if (Array.isArray(ord.line_items)) {
                        for(const item of ord.line_items){
                            singleOrders.push(item)
                        }
                    }
                }
                setLineItems(singleOrders)
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
            })
    }, [user?.email])


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

            {isLoading ? (
                <div className="account-loading">
                    <div className="spinner-premium"></div>
                    <p>Fetching your orders...</p>
                </div>
            ) : (
                showRecipt && orders ? 
                    orders.map(order => <SingleCustomerOrder key={order._id} order={order} />)
                    :
                    lineItems.map((item, ind) => <SingleProductOrdered key={ind} line_items={lineItems} />)
            )}

        </div>
    );
};

export default MyAccount;
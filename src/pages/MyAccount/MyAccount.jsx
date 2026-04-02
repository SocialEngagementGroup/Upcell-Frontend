import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utilities/UserContextProvider";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utilities/axiosInstance";
import SingleCustomerOrder from "./SingleCustomerOrder";
import "./MyAccount.css"

const MyAccount = () => {
    const { user, logOut } = useContext(userContext)
    const navigate = useNavigate()

    const handleSingOut = () => {
        logOut().then(() => {
            navigate("/")
        }).catch(error => console.log(error))
    }

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user?.email) return;
        setIsLoading(true)
        axiosInstance.get(`client-orders/${user?.email}`)
            .then(res => {
                setOrders(res.data)
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

            {isLoading ? (
                <div className="account-loading">
                    <div className="spinner-premium"></div>
                    <p>Fetching your orders...</p>
                </div>
            ) : (
                orders.map(order => <SingleCustomerOrder key={order._id} order={order} />)
            )}

        </div>
    );
};

export default MyAccount;
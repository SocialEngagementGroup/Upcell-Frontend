import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utilities/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { UserProfile } from "@clerk/clerk-react";
import SingleCustomerOrder from "./SingleCustomerOrder";
import axiosInstance from "../../utilities/axiosInstance";

// Brand variables only. The old `elements` class overrides were part of the
// previous design system and were removed; re-add element styling once the
// new account UI exists.
const clerkProfileAppearance = {
    variables: {
        colorPrimary: '#d90b0f',
        colorText: '#0c0c0c',
        colorTextSecondary: '#86868b',
        colorBackground: '#ffffff',
        colorInputBackground: '#ffffff',
        colorInputText: '#0c0c0c',
        fontFamily: 'Roboto, ui-sans-serif, system-ui, sans-serif',
        borderRadius: '14px',
    },
};

const MyAccount = () => {
    const { user, loading, logOut } = useContext(userContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    const handleSingOut = () => {
        logOut({ redirectUrl: "/" }).catch((error) => console.log(error));
    };

    useEffect(() => {
        if (loading) {
            return;
        }

        if (user?.role === "admin") {
            navigate("/admin-secret", { replace: true });
            return;
        }

        if (!user?.email) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        axiosInstance.get(`client-orders/${encodeURIComponent(user.email)}`)
            .then((res) => {
                setOrders(res.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setOrders([]);
                setIsLoading(false);
            });
    }, [loading, navigate, user?.email, user?.role]);

    // TODO(redesign): build the new account page UI here.
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <span>Account</span>
            </nav>

            <h1>Your orders and account details.</h1>
            <p>{user?.email}</p>
            <button type="button" onClick={handleSingOut}>Sign out</button>

            <div role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'orders'}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'account'}
                    onClick={() => setActiveTab('account')}
                >
                    Account settings
                </button>
            </div>

            {activeTab === 'orders' ? (
                isLoading ? (
                    <p>Fetching your orders...</p>
                ) : orders.length ? (
                    <div>
                        {orders.map((order) => <SingleCustomerOrder key={order._id} order={order} />)}
                    </div>
                ) : (
                    <div>
                        <h2>No orders yet.</h2>
                        <p>When you place an order, it will appear here with its current status.</p>
                    </div>
                )
            ) : (
                <UserProfile routing="hash" appearance={clerkProfileAppearance} />
            )}
        </div>
    );
};

export default MyAccount;

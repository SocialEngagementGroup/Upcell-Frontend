import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utilities/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SingleCustomerOrder from "./SingleCustomerOrder";
import axiosInstance from "../../utilities/axiosInstance";

const MyAccount = () => {
    const { user, logOut } = useContext(userContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleSingOut = () => {
        logOut().then(() => navigate("/")).catch((error) => console.log(error));
    };

    useEffect(() => {
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
    }, [user?.email]);

    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Account</span>
                    </nav>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-[clamp(2.6rem,4.8vw,4.8rem)] leading-[0.94]">Your orders and account details.</h1>
                            <p className="mt-4 text-lg leading-8 text-ink-soft">{user?.email}</p>
                        </div>
                        <button className="premium-button-secondary" onClick={handleSingOut}>Sign out</button>
                    </div>
                </div>
            </section>

            <section className="page-container pb-16">
                {isLoading ? (
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <p className="text-lg text-ink-soft">Fetching your orders...</p>
                    </div>
                ) : orders.length ? (
                    <div className="space-y-5">
                        {orders.map((order) => <SingleCustomerOrder key={order._id} order={order} />)}
                    </div>
                ) : (
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>No orders yet.</h2>
                        <p className="mt-4 text-lg text-ink-soft">When you place an order, it will appear here with its current status.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyAccount;

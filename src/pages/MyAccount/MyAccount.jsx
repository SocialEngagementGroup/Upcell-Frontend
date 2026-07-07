import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utilities/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { UserProfile } from "@clerk/clerk-react";
import SingleCustomerOrder from "./SingleCustomerOrder";
import axiosInstance from "../../utilities/axiosInstance";

// Brand-aligned styling for Clerk's embedded UserProfile (matches tailwind tokens).
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
    elements: {
        rootBox: 'w-full',
        cardBox: 'w-full max-w-full mx-auto rounded-[28px] sm:rounded-[36px] border border-black/[0.06] shadow-premium overflow-hidden',
        card: 'w-full max-w-full bg-white',
        navbar: 'bg-surface/60 border-r border-black/[0.06]',
        navbarButton: 'text-apple-gray font-semibold',
        navbarButton__active: 'text-brand-red',
        headerTitle: 'text-apple-text font-bold',
        headerSubtitle: 'text-apple-gray',
        formButtonPrimary: 'bg-brand-red hover:bg-[#b00a0d] text-white rounded-full font-bold normal-case shadow-none',
        formFieldInput: 'rounded-2xl border border-black/[0.1] focus:border-brand-red focus:ring-1 focus:ring-brand-red',
        formFieldLabel: 'text-apple-text font-bold',
        profileSectionPrimaryButton: 'text-brand-red font-bold normal-case',
        badge: 'bg-brand-red/10 text-brand-red',
        footerActionLink: 'text-brand-red font-bold',
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

    const tabBaseClass = "rounded-full px-5 py-2.5 text-sm font-bold transition-all sm:px-6";
    const tabActiveClass = "bg-apple-text text-white shadow-sm";
    const tabInactiveClass = "text-apple-gray hover:text-apple-text";

    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Account</span>
                    </nav>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-[clamp(2.1rem,4.8vw,4.8rem)] leading-[0.96] sm:leading-[0.94]">Your orders and account details.</h1>
                            <p className="mt-3 break-words text-base leading-7 text-ink-soft sm:mt-4 sm:text-lg sm:leading-8">{user?.email}</p>
                        </div>
                        <button className="premium-button-secondary w-full md:w-auto" onClick={handleSingOut}>Sign out</button>
                    </div>

                    <div className="mt-8 inline-flex w-full gap-1 rounded-full bg-surface p-1 sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('orders')}
                            className={`${tabBaseClass} flex-1 sm:flex-none ${activeTab === 'orders' ? tabActiveClass : tabInactiveClass}`}
                        >
                            Orders
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('account')}
                            className={`${tabBaseClass} flex-1 sm:flex-none ${activeTab === 'account' ? tabActiveClass : tabInactiveClass}`}
                        >
                            Account settings
                        </button>
                    </div>
                </div>
            </section>

            <section className="page-container pb-16">
                {activeTab === 'orders' ? (
                    isLoading ? (
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
                    )
                ) : (
                    <div className="flex justify-center">
                        <UserProfile routing="hash" appearance={clerkProfileAppearance} />
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyAccount;

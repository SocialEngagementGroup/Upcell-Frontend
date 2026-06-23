import React, { useEffect, useState } from 'react';
import { SignIn, SignUp, useClerk, useUser } from '@clerk/clerk-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RouteLoadingScreen from '../../../components/RouteLoadingScreen/RouteLoadingScreen';
import { getClerkPrimaryEmail, getUserRole } from '../../../utilities/auth';

const clerkAppearance = {
    variables: {
        colorPrimary: '#d20a0d',
        colorText: '#111111',
        colorTextSecondary: '#6b7280',
        colorBackground: '#ffffff',
        colorInputBackground: '#ffffff',
        colorInputText: '#111111',
        fontFamily: 'Roboto, Arial, sans-serif',
        borderRadius: '14px',
    },
    elements: {
        rootBox: 'w-full max-w-[400px] mx-auto',
        card: 'w-full max-w-full border border-[#e5e7eb] shadow-[0_22px_60px_rgba(15,23,42,0.14)] rounded-[28px] px-5 py-6 sm:px-7 bg-white',
        headerTitle: 'hidden',
        headerSubtitle: 'hidden',
        socialButtonsBlockButton: 'h-12 rounded-full border border-[#e5e7eb] text-[#111111] font-bold hover:bg-[#f5f5f7] transition-all',
        formButtonPrimary: 'h-12 rounded-full bg-brand-red text-white font-bold hover:bg-[#b00a0d] transition-all shadow-none',
        formFieldInput: 'h-12 rounded-2xl border border-[#d1d5db] bg-white text-[#111111] focus:border-brand-red focus:ring-1 focus:ring-brand-red',
        formFieldLabel: 'text-sm font-bold text-[#111111]',
        footerActionLink: 'text-brand-red font-bold hover:text-[#b00a0d]',
        identityPreviewEditButton: 'text-brand-red font-bold',
        formResendCodeLink: 'text-brand-red font-bold',
        otpCodeFieldInput: 'rounded-xl border-[#d1d5db] focus:border-brand-red',
    },
};


const LoginAndSignup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user, isLoaded, isSignedIn } = useUser();
    const [signin, setSignin] = useState(!location.search.includes("mode=signup"));
    const isAdminLogin = location.search.includes("admin=true");
    const afterAuthUrl = isAdminLogin ? "/admin-secret" : "/myaccount";
    const currentRole = getUserRole(user);
    const currentEmail = getClerkPrimaryEmail(user);

    const [roleReady, setRoleReady] = useState(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            setRoleReady(true);
            return undefined;
        }

        setRoleReady(false);
        const timer = setTimeout(() => setRoleReady(true), 500);
        return () => clearTimeout(timer);
    }, [isLoaded, isSignedIn, user?.id]);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !roleReady) {
            return;
        }

        if (isAdminLogin && currentRole !== "admin") {
            return;
        }

        if (currentRole === "admin") {
            navigate("/admin-secret", { replace: true });
        } else {
            navigate("/myaccount", { replace: true });
        }
    }, [currentRole, isAdminLogin, isLoaded, isSignedIn, roleReady, navigate]);

    const handleSwitchToAdmin = () => {
        signOut({ redirectUrl: "/login?admin=true" });
    };

    const renderAuthContent = () => {
        if (!isLoaded || (isSignedIn && !roleReady)) {
            return <RouteLoadingScreen compact />;
        }

        if (isAdminLogin && isSignedIn && currentRole !== "admin") {
            return (
                <div className="rounded-[28px] border border-[#e5e7eb] bg-white px-6 py-8 text-center shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-red">Account switch required</p>
                    <h2 className="mt-3 text-2xl font-extrabold text-apple-text">Sign out before admin access.</h2>
                    <p className="mx-auto mt-3 max-w-[320px] text-sm leading-6 text-apple-gray">
                        You are currently signed in as {currentEmail || "a customer account"}. Sign out first, then use the admin account.
                    </p>
                    <button className="premium-button mt-6 w-full" type="button" onClick={handleSwitchToAdmin}>
                        Sign out and continue
                    </button>
                    <Link to="/" className="mt-4 inline-block text-sm font-bold text-apple-text hover:text-brand-red">
                        Return home
                    </Link>
                </div>
            );
        }

        if (isSignedIn) {
            return <RouteLoadingScreen compact />;
        }

        return signin ? (
            <SignIn
                routing="hash"
                signUpUrl="/login?mode=signup"
                forceRedirectUrl={afterAuthUrl}
                fallbackRedirectUrl={afterAuthUrl}
                appearance={clerkAppearance}
            />
        ) : (
            <SignUp
                routing="hash"
                signInUrl={isAdminLogin ? "/login?admin=true" : "/login"}
                forceRedirectUrl={afterAuthUrl}
                fallbackRedirectUrl={afterAuthUrl}
                appearance={clerkAppearance}
            />
        );
    };

    return (
        <div className="flex min-h-screen w-full items-stretch justify-center bg-[#f5f5f7] px-4 pb-6 pt-[96px] sm:px-6 lg:h-screen">
            <div className="mx-auto flex w-full max-w-[1040px] overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:rounded-[40px]">
                <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#0c0c0c_0%,#2b2a2a_100%)] p-12 text-white lg:flex">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-red/30 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-brand-red/20 blur-[90px]" />
                    <Link to="/" className="relative z-10">
                        <img src="/staticImages/upcellLogoLight.png" alt="UpCell" className="h-12 w-auto" />
                    </Link>
                    <div className="relative z-10">
                        <h2 className="text-[34px] font-extrabold leading-[1.1] text-white">Premium devices,<br />better prices.</h2>
                        <p className="mt-4 max-w-[320px] text-[15px] leading-7 text-white/60">
                            Sign in to track your orders, manage trade-ins, and check out faster on certified premium Apple devices.
                        </p>
                    </div>
                    <p className="relative z-10 text-xs text-white/40">&copy; {new Date().getFullYear()} UpCell. All rights reserved.</p>
                </div>

                <div className="flex w-full flex-col overflow-y-auto px-5 py-8 sm:px-10 sm:py-10 lg:w-[56%] lg:px-12">
                    <div className="m-auto w-full max-w-[430px]">
                        <Link to="/" className="mb-8 inline-block lg:hidden">
                            <img src="/staticImages/upcellLogo.png" alt="UpCell" className="h-8 w-auto" />
                        </Link>
                        <header className="mb-6">
                            <h1 className="text-3xl font-extrabold mb-2">{signin ? "Welcome back" : "Join UpCell"}</h1>
                            <p className="text-apple-gray text-base">
                                {isAdminLogin ? "Sign in with an admin account to manage the shop." : "Sign in to manage your orders."}
                            </p>
                        </header>

                        {renderAuthContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAndSignup;




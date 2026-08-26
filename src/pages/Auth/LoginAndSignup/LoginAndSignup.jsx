import React, { useContext, useEffect, useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RouteLoadingScreen from '../../../components/RouteLoadingScreen/RouteLoadingScreen';
import { userContext } from '../../../utilities/UserContextProvider';

// Brand variables only. The old `elements` class overrides were part of the
// previous design system and were removed; re-add element styling once the
// new auth UI exists.
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
};

const LoginAndSignup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading, logOut } = useContext(userContext);
    const [signin, setSignin] = useState(!location.search.includes("mode=signup"));
    const isAdminLogin = location.search.includes("admin=true");
    // Always return here after Clerk finishes auth (email/password or an
    // OAuth round-trip) instead of redirecting straight to a role-gated
    // route. This keeps exactly one thing (the effect below) responsible
    // for deciding where a signed-in user actually goes, so Clerk's own
    // redirect and our role check can never race/loop against each other.
    const postAuthReturnUrl = `${location.pathname}${location.search}`;
    const isSignedIn = Boolean(user);
    const currentRole = user?.role;
    const currentEmail = user?.email;

    useEffect(() => {
        if (loading || !isSignedIn) {
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
    }, [currentRole, isAdminLogin, isSignedIn, loading, navigate]);

    const handleSwitchToAdmin = () => {
        logOut({ redirectUrl: "/login?admin=true" });
    };

    const renderAuthContent = () => {
        if (loading) {
            return <RouteLoadingScreen compact />;
        }

        if (isAdminLogin && isSignedIn && currentRole !== "admin") {
            return (
                <div>
                    <p>Account switch required</p>
                    <h2>Sign out before admin access.</h2>
                    <p>
                        You are currently signed in as {currentEmail || "a customer account"}. Sign
                        out first, then use the admin account.
                    </p>
                    <button type="button" onClick={handleSwitchToAdmin}>Sign out and continue</button>
                    <Link to="/">Return home</Link>
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
                forceRedirectUrl={postAuthReturnUrl}
                fallbackRedirectUrl={postAuthReturnUrl}
                appearance={clerkAppearance}
            />
        ) : (
            <SignUp
                routing="hash"
                signInUrl={isAdminLogin ? "/login?admin=true" : "/login"}
                forceRedirectUrl={postAuthReturnUrl}
                fallbackRedirectUrl={postAuthReturnUrl}
                appearance={clerkAppearance}
            />
        );
    };

    // TODO(redesign): build the new auth page UI here.
    return (
        <div>
            <Link to="/">UpCell</Link>

            <h1>{signin ? "Welcome back" : "Join UpCell"}</h1>
            <p>
                {isAdminLogin
                    ? "Sign in with an admin account to manage the shop."
                    : "Sign in to manage your orders."}
            </p>

            {renderAuthContent()}

            {!isSignedIn && !loading && (
                <button type="button" onClick={() => setSignin((prev) => !prev)}>
                    {signin ? "Create an account" : "Already have an account? Sign in"}
                </button>
            )}
        </div>
    );
};

export default LoginAndSignup;

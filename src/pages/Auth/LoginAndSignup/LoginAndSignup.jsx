import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userContext } from '../../../utilities/UserContextProvider';
import { validateEmailAddress, validateRequiredText } from '../../../utilities/formValidation';
import useFormAnalytics from '../../../utilities/useFormAnalytics';

const LoginAndSignup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { signIn, signUp } = useContext(userContext)
    const [signin, setSignin] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics(signin ? 'auth_signin' : 'auth_signup');

    const isAdminLogin = location.search.includes("admin=true");

    const completeAuth = async ({ email, name }) => {
        const payload = {
            email,
            name,
            isAdmin: isAdminLogin,
        };

        if (signin) await signIn(payload);
        else await signUp(payload);

        navigate(isAdminLogin ? "/admin-secret" : "/myaccount");
    };

    const settingSingin = () => { setSignin(true); setErrorMessage(""); }
    const settingSingup = () => { setSignin(false); setErrorMessage(""); }

    const handleGoogleSignin = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        markInteraction();
        try {
            const email = isAdminLogin ? "admin@upcell.local" : "shopper@upcell.local";
            await completeAuth({
                email,
                name: isAdminLogin ? "Local Admin" : "Local Shopper",
            });
            trackSuccess({ provider: 'google', mode: signin ? 'signin' : 'signup', isAdminLogin });
        } catch (error) {
            const message = error?.message || 'Authentication failed.';
            setErrorMessage(message);
            trackFailure(message, { provider: 'google', mode: signin ? 'signin' : 'signup', isAdminLogin });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSinginWithEmail = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setErrorMessage("");

        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        const emailError = validateEmailAddress(email);
        const passwordError = validateRequiredText("Password", password, { min: 8, max: 128 });
        if (emailError || passwordError) {
            const message = emailError || passwordError;
            setErrorMessage(message);
            trackFailure(message, { mode: 'signin', phase: 'validation', isAdminLogin });
            return;
        }

        setIsSubmitting(true);
        markInteraction();
        try {
            await completeAuth({ email });
            trackSuccess({ mode: 'signin', isAdminLogin });
        } catch (error) {
            const message = error?.message || 'Unable to sign in right now.';
            setErrorMessage(message);
            trackFailure(message, { mode: 'signin', phase: 'request', isAdminLogin });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSingupWithEmail = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setErrorMessage("");

        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        const rePassword = e.target.rePassword.value.trim();

        const emailError = validateEmailAddress(email);
        const passwordError = validateRequiredText("Password", password, { min: 8, max: 128 });
        if (emailError || passwordError) {
            const message = emailError || passwordError;
            setErrorMessage(message);
            trackFailure(message, { mode: 'signup', phase: 'validation', isAdminLogin });
            return;
        }

        if (password !== rePassword) {
            setErrorMessage("Passwords do not match.");
            trackFailure('Passwords do not match.', { mode: 'signup', phase: 'validation', isAdminLogin });
            return;
        }

        setIsSubmitting(true);
        markInteraction();
        try {
            await completeAuth({ email });
            trackSuccess({ mode: 'signup', isAdminLogin });
        } catch (error) {
            const message = error?.message || 'Unable to create your account right now.';
            setErrorMessage(message);
            trackFailure(message, { mode: 'signup', phase: 'request', isAdminLogin });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-stretch justify-center bg-[#f5f5f7] px-4 pb-6 pt-[96px] sm:px-6 lg:h-screen">
            <div className="mx-auto flex w-full max-w-[1040px] overflow-hidden rounded-[40px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
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
                        <ul className="mt-9 space-y-4">
                            {[
                                '40-point certified inspection',
                                '12-month warranty on every device',
                                'Trade-in quotes paid within 24 hours',
                            ].map((point) => (
                                <li key={point} className="flex items-center gap-3 text-[14px] text-white/85">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="relative z-10 text-xs text-white/40">&copy; {new Date().getFullYear()} UpCell. All rights reserved.</p>
                </div>

                <div className="flex w-full flex-col overflow-y-auto px-8 py-8 sm:px-12 sm:py-10 lg:w-[56%]">
                  <div className="m-auto w-full">
                    <Link to="/" className="mb-8 inline-block lg:hidden">
                        <img src="/staticImages/upcellLogo.png" alt="UpCell" className="h-8 w-auto" />
                    </Link>
                    <header className="mb-6">
                        <h1 className="text-3xl font-extrabold mb-2">{signin ? "Welcome back" : "Join UpCell"}</h1>
                        <p className="text-apple-gray text-base">
                            {isAdminLogin
                                ? "Use a local admin session to manage the shop on this machine."
                                : signin
                                    ? "Sign in to manage your orders"
                                    : "Create an account to start shopping"}
                        </p>
                    </header>

                {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6">{errorMessage}</div>
                )}

                {signin ? (
                    <form className="flex flex-col gap-5" onSubmit={handleSinginWithEmail} onChangeCapture={markInteraction}>
                        <div className="flex flex-col gap-2.5">
                            <label htmlFor="email" className="text-[13px] font-bold uppercase tracking-[0.1em] text-apple-gray">Email address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="name@email.com" 
                                required 
                                className="h-14 bg-[#f9f9fb] border border-black/[0.04] rounded-2xl px-5 text-[15px] outline-none transition-all focus:ring-2 focus:ring-black focus:bg-white" 
                            />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label htmlFor="password" className="text-[13px] font-bold uppercase tracking-[0.1em] text-apple-gray">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="••••••••" 
                                required 
                                className="h-14 bg-[#f9f9fb] border border-black/[0.04] rounded-2xl px-5 text-[15px] outline-none transition-all focus:ring-2 focus:ring-black focus:bg-white" 
                            />
                        </div>
                        <button type="submit" className="premium-button w-full mt-2" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
                    </form>
                ) : (
                    <form className="flex flex-col gap-5" onSubmit={handleSingupWithEmail} onChangeCapture={markInteraction}>
                        <div className="flex flex-col gap-2.5">
                            <label htmlFor="email" className="text-[13px] font-bold uppercase tracking-[0.1em] text-apple-gray">Email address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="name@email.com" 
                                required 
                                className="h-14 bg-[#f9f9fb] border border-black/[0.04] rounded-2xl px-5 text-[15px] outline-none transition-all focus:ring-2 focus:ring-black focus:bg-white" 
                            />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label htmlFor="password" className="text-[13px] font-bold uppercase tracking-[0.1em] text-apple-gray">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Minimum 8 characters" 
                                required 
                                className="h-14 bg-[#f9f9fb] border border-black/[0.04] rounded-2xl px-5 text-[15px] outline-none transition-all focus:ring-2 focus:ring-black focus:bg-white" 
                            />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label htmlFor="rePassword" className="text-[13px] font-bold uppercase tracking-[0.1em] text-apple-gray">Confirm Password</label>
                            <input 
                                type="password" 
                                id="rePassword" 
                                name="rePassword" 
                                placeholder="Confirm your password" 
                                required 
                                className="h-14 bg-[#f9f9fb] border border-black/[0.04] rounded-2xl px-5 text-[15px] outline-none transition-all focus:ring-2 focus:ring-black focus:bg-white" 
                            />
                        </div>
                        <button type="submit" className="premium-button w-full mt-2" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
                    </form>
                )}

                    <div className="flex items-center gap-4 my-3.5 text-sm text-apple-gray before:flex-1 before:h-px before:bg-black/10 after:flex-1 after:h-px after:bg-black/10">or</div>

                    <div className="flex flex-col gap-3">
                        <button onClick={handleGoogleSignin} disabled={isSubmitting} className="premium-button-secondary w-full gap-3 border-black/10 bg-[#f8f8fa] hover:bg-[#f0f0f3]">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>
                        <button onClick={() => alert("Apple Sign-in coming soon!")} className="premium-button-secondary w-full gap-3 border-black/10 bg-[#f8f8fa] hover:bg-[#f0f0f3]">
                            <svg viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                            Continue with Apple
                        </button>
                    </div>

                    <footer className="text-center mt-6 text-[14px] text-apple-gray">
                        {signin ? (
                            <>New to UpCell? <button className="text-apple-text font-black hover:underline underline-offset-4 bg-transparent p-0 transition-all" type="button" onClick={settingSingup}>Sign up</button></>
                        ) : (
                            <>Already have an account? <button className="text-apple-text font-black hover:underline underline-offset-4 bg-transparent p-0 transition-all" type="button" onClick={settingSingin}>Sign in</button></>
                        )}
                    </footer>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAndSignup;

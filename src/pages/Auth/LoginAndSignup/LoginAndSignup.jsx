import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userContext } from '../../../utilities/UserContextProvider';

const LoginAndSignup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { signIn, signUp } = useContext(userContext)
    const [signin, setSignin] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

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
        await completeAuth({
            email: isAdminLogin ? "admin@upcell.local" : "shopper@upcell.local",
            name: isAdminLogin ? "Local Admin" : "Local Shopper",
        });
    };

    const handleSinginWithEmail = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        if (!email || !password) {
            setErrorMessage("Email and password are required.");
            return;
        }

        await completeAuth({ email });
    };

    const handleSingupWithEmail = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        const rePassword = e.target.rePassword.value.trim();

        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters.");
            return;
        }

        if (password !== rePassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        await completeAuth({ email });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-alt py-20 px-5">
            <div className="w-full max-w-[480px] bg-white rounded-4xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-2">{signin ? "Welcome Back" : "Join UpCell"}</h1>
                    <p className="text-apple-gray text-base">
                        {isAdminLogin
                            ? "Use a local admin session to manage the store on this machine."
                            : signin
                                ? "Sign in to manage your orders"
                                : "Create an account to start shopping"}
                    </p>
                </header>

                {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6">{errorMessage}</div>
                )}

                {signin ? (
                    <form className="flex flex-col gap-5 mb-6" onSubmit={handleSinginWithEmail}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-bold text-apple-text">Email address</label>
                            <input type="email" id="email" name="email" placeholder="name@email.com" required className="h-14 bg-surface-alt border-none rounded-xl px-5 text-base outline-none focus:ring-2 focus:ring-brand-red" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-bold text-apple-text">Password</label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required className="h-14 bg-surface-alt border-none rounded-xl px-5 text-base outline-none focus:ring-2 focus:ring-brand-red" />
                        </div>
                        <button type="submit" className="h-14 bg-brand-red text-white rounded-xl font-bold text-base transition-all duration-300 hover:bg-brand-red-hover">Sign in</button>
                    </form>
                ) : (
                    <form className="flex flex-col gap-5 mb-6" onSubmit={handleSingupWithEmail}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-bold text-apple-text">Email address</label>
                            <input type="email" id="email" name="email" placeholder="name@email.com" required className="h-14 bg-surface-alt border-none rounded-xl px-5 text-base outline-none focus:ring-2 focus:ring-brand-red" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-bold text-apple-text">Password</label>
                            <input type="password" id="password" name="password" placeholder="Minimum 8 characters" required className="h-14 bg-surface-alt border-none rounded-xl px-5 text-base outline-none focus:ring-2 focus:ring-brand-red" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="rePassword" className="text-sm font-bold text-apple-text">Confirm Password</label>
                            <input type="password" id="rePassword" name="rePassword" placeholder="Confirm your password" required className="h-14 bg-surface-alt border-none rounded-xl px-5 text-base outline-none focus:ring-2 focus:ring-brand-red" />
                        </div>
                        <button type="submit" className="h-14 bg-brand-red text-white rounded-xl font-bold text-base transition-all duration-300 hover:bg-brand-red-hover">Create account</button>
                    </form>
                )}

                <div className="flex items-center gap-4 my-6 text-sm text-apple-gray before:flex-1 before:h-px before:bg-border-light after:flex-1 after:h-px after:bg-border-light">or</div>

                <div className="flex flex-col gap-3">
                    <button onClick={handleGoogleSignin} className="h-14 bg-white border border-border-light rounded-xl flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200 hover:bg-surface-alt">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <button onClick={() => alert("Apple Sign-in coming soon!")} className="h-14 bg-black text-white rounded-xl flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200 hover:bg-apple-text">
                        <svg viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                        Continue with Apple
                    </button>
                </div>

                <footer className="text-center mt-8 text-sm text-apple-gray">
                    {signin ? (
                        <>New to UpCell? <button className="text-brand-red font-bold bg-transparent p-0" type="button" onClick={settingSingup}>Sign up</button></>
                    ) : (
                        <>Already have an account? <button className="text-brand-red font-bold bg-transparent p-0" type="button" onClick={settingSingin}>Sign in</button></>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default LoginAndSignup;

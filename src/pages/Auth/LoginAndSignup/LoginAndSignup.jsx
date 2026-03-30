import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import axiosInstance from '../../../utilities/axiosInstance';
import { app } from '../../../utilities/firebaseConfig';
import "./LoginAndSignup.css"
import { useLocation, useNavigate } from 'react-router-dom';


const LoginAndSignup = () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth(app)

    const navigate = useNavigate()
    const location = useLocation()

    const [signin, setSignin] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSigninUp = () => {
        const admin = location.search

        if (admin) {
            navigate("/admin-secret")
        } else {
            navigate("/myaccount")
        }
    }

    const settingSingin = () => {
        setSignin(true)
        setErrorMessage("")
    }
    const settingSingup = () => {
        setSignin(false)
        setErrorMessage("")
    }

    const handleGoogleSignin = () => {
        signInWithPopup(auth, provider)
            .then(result => {
                handleSigninUp()

            })
            .catch(error => {
                console.log(error)
                setErrorMessage(error)
            })
    }

    const handleSinginWithEmail = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        setErrorMessage("")


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                console.log("siggned in properly")
                e.target.reset()
                handleSigninUp()
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("error in signin ***, ", errorMessage)
                setErrorMessage(errorMessage)
            });

    }

    const handleSingupWithEmail = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const rePassword = e.target.rePassword.value

        setErrorMessage("")

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                settingSingin()

                e.target.reset()
                handleSigninUp()
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("error in signin ***, ", errorMessage)
                setErrorMessage(errorMessage)
            });

    }

    return (
        <div className="login-page-container">
            <div className="auth-card">
                <header className="auth-header">
                    <h1>{signin ? "Welcome Back" : "Join Global Traders"}</h1>
                    <p>{signin ? "Sign in to manage your orders" : "Create an account to start shopping"}</p>
                </header>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                {signin ? (
                    <form className="auth-form" onSubmit={handleSinginWithEmail}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" id="email" name="email" placeholder="name@email.com" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required />
                        </div>

                        <button type="submit" className="btn-auth-submit">Sign in</button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleSingupWithEmail}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" id="email" name="email" placeholder="name@email.com" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Minimum 8 characters" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="rePassword">Confirm Password</label>
                            <input type="password" id="rePassword" name="rePassword" placeholder="Confirm your password" required />
                        </div>

                        <button type="submit" className="btn-auth-submit">Create account</button>
                    </form>
                )}

                <div className="auth-divider">or</div>

                <div className="social-auth-container">
                    <button onClick={handleGoogleSignin} className="btn-social-auth google">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                        Continue with Google
                    </button>

                    <button onClick={() => alert("Apple Sign-in coming soon!")} className="btn-social-auth apple">
                        <svg viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                        Continue with Apple
                    </button>
                </div>

                <footer className="auth-footer">
                    {signin ? (
                        <>New to Global Traders? <button className="btn-link-toggle" type="button" onClick={settingSingup}>Sign up</button></>
                    ) : (
                        <>Already have an account? <button className="btn-link-toggle" type="button" onClick={settingSingin}>Sign in</button></>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default LoginAndSignup;
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
        <div className='loginAndSignup'>
            {signin &&

                <form onSubmit={handleSinginWithEmail}>
                    <label htmlFor='emial'>Email</label>
                    <input type='email' id='email' name='email' placeholder='Email' required></input>

                    <lable htmlFor="password"> Password</lable>
                    <input type='password' id='password' name='password' placeholder='Password' required></input>

                    <button type='submit' className='submit'> Sign in</button>

                    {errorMessage &&
                        <p className='error'>{errorMessage}</p>
                    }

                    <p>New to the site ? <button className='link' type='button' onClick={settingSingup}>Signup</button></p>
                </form>

            }
            {!signin &&
                <form onSubmit={handleSingupWithEmail}>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' placeholder='Email' required></input>

                    <lable htmlFor="password"> Password</lable>
                    <input type='password' id='password' name='password' placeholder='Password' required></input>

                    <lable htmlFor="rePassword">Re-enter Password</lable>
                    <input type='password' id='rePassword' name='rePassword' required></input>

                    <button type='submit' className='submit'> Sign up</button>

                    {errorMessage &&
                        <p className='error'>{errorMessage}</p>
                    }

                    <p>Already have account ? <button className='link' type='button' onClick={settingSingin}>SignIn</button></p>
                </form>

            }

            <button onClick={handleGoogleSignin} className='googleSignin'>Continue with Google</button>

        </div>
    );
};

export default LoginAndSignup;
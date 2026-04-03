import { createContext, useEffect, useState } from "react";
import { getStoredUser, setStoredUser } from "./localStore";

export const userContext = createContext()

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setUser(getStoredUser());
        setLoading(false);
    }, []);

    const persistUser = (nextUser) => {
        setUser(nextUser);
        setStoredUser(nextUser);
        return nextUser;
    };

    const signIn = async ({ email, name, isAdmin = false }) => {
        const nextUser = {
            email,
            displayName: name || email.split("@")[0],
            isAdmin,
        };

        return persistUser(nextUser);
    };

    const signUp = async ({ email, name, isAdmin = false }) => signIn({ email, name, isAdmin });

    const logOut = async () => {
        persistUser(null);
    };

    const credencials = {
        user,
        loading,
        logOut,
        signIn,
        signUp,
    }

    return (
        <userContext.Provider value={credencials}>
            {children}
        </userContext.Provider>
    );
};

export default UserContextProvider;

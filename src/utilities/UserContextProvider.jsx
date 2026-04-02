import { createContext, useEffect, useState } from "react";

export const userContext = createContext()

const UserContextProvider = ({ children }) => {
    // Firebase Auth has been removed. 
    // Re-implement your new authentication provider here.
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const logOut = () => {
        setUser(null)
    }

    const credencials = {
        user,
        loading,
        logOut
    }

    return (
        <userContext.Provider value={credencials}>
            {children}
        </userContext.Provider>
    );
};

export default UserContextProvider;
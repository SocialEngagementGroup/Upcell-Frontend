import { createContext, useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { getClerkPrimaryEmail, getUserRole } from "./auth";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
    const { signOut } = useClerk();
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const [roleReady, setRoleReady] = useState(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            setRoleReady(true);
            return undefined;
        }

        setRoleReady(false);
        const timer = setTimeout(() => setRoleReady(true), 500);
        return () => clearTimeout(timer);
    }, [isLoaded, isSignedIn, clerkUser?.id]);

    const email = getClerkPrimaryEmail(clerkUser);
    const user = isSignedIn && clerkUser
        ? {
            id: clerkUser.id,
            email: email,
            displayName: clerkUser.fullName || clerkUser.username || email,
            role: getUserRole(clerkUser),
            clerkUser,
        }
        : null;

    const credencials = {
        user,
        loading: !isLoaded || (isSignedIn && !roleReady),
        logOut: signOut,
    };

    return (
        <userContext.Provider value={credencials}>
            {children}
        </userContext.Provider>
    );
};

export default UserContextProvider;

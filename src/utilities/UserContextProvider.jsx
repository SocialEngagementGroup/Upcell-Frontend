import { createContext } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { getClerkPrimaryEmail, getUserRole } from "./auth";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
    const { signOut } = useClerk();
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();

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
        loading: !isLoaded,
        logOut: signOut,
    };

    return (
        <userContext.Provider value={credencials}>
            {children}
        </userContext.Provider>
    );
};

export default UserContextProvider;

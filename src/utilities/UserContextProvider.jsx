import { createContext, useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";

export const userContext = createContext();

const normalizeRole = (role) => {
    if (typeof role !== "string") return null;
    return role.trim().toLowerCase();
};

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

    const user = isSignedIn && clerkUser
        ? {
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || "",
            displayName: clerkUser.fullName || clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress || "",
            role: normalizeRole(clerkUser.publicMetadata?.role) || "customer",
            clerkUser,
        }
        : null;

    const credencials = {
        user,
        loading: !isLoaded || (isSignedIn && !roleReady),
        logOut: signOut,
    };

    console.log("[DEBUG UserContextProvider] isLoaded:", isLoaded);
    console.log("[DEBUG UserContextProvider] isSignedIn:", isSignedIn);
    console.log("[DEBUG UserContextProvider] clerkUser.id:", clerkUser?.id);
    console.log("[DEBUG UserContextProvider] clerkUser email:", clerkUser?.primaryEmailAddress?.emailAddress);
    console.log("[DEBUG UserContextProvider] clerkUser publicMetadata:", clerkUser?.publicMetadata);
    console.log("[DEBUG UserContextProvider] normalized role:", normalizeRole(clerkUser?.publicMetadata?.role));
    console.log("[DEBUG UserContextProvider] exported user object role:", user?.role);
    console.log("[DEBUG UserContextProvider] loading value:", credencials.loading);

    return (
        <userContext.Provider value={credencials}>
            {children}
        </userContext.Provider>
    );
};

export default UserContextProvider;

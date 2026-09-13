import { createContext, useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { getClerkPrimaryEmail, getUserRole } from "./auth";
import { toast } from "sonner";
import { useClaimGuestOrdersMutation } from "../queries/orders";

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

    // Somebody who checked out as a guest and later signed up with the same
    // address should find those orders waiting, not have to keep the email
    // with the link in it forever.
    //
    // Once per session, guarded by a ref rather than by state: this provider
    // re-renders on every Clerk update, and a claim fired on each one would be
    // a request per render. The server is idempotent — a second call finds
    // nothing left to claim — but that is a reason not to worry about a race,
    // not a reason to make the calls.
    const claim = useClaimGuestOrdersMutation();
    const claimed = useRef(false);

    useEffect(() => {
        if (!user?.id || claimed.current) return;
        claimed.current = true;

        claim.mutate(undefined, {
            onSuccess: (result) => {
                if (!result?.claimed) return;
                toast.success(
                    result.claimed === 1
                        ? "We found an order you placed with this email."
                        : `We found ${result.claimed} orders you placed with this email.`
                );
            },
            // Silent on failure. A customer who has just signed in did not ask
            // for this and cannot act on it going wrong; the orders are still
            // reachable from the link in their receipt either way.
            onError: () => {},
        });
    }, [user?.id]);

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

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./UserContextProvider";



const AdminPrivateRoute = ({ children }) => {
    const {user, loading} = useContext(userContext)

    if (loading){
        return <div>loading...</div>
    }

    if(user){
        const admins = (import.meta.env.VITE_ADMINS || "")
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean)

        if(user?.isAdmin || admins.includes(user?.email)){

            return <>{children}</>
        }
    }

    return (
        <Navigate to="/login?admin=true"></Navigate>
    );
};

export default AdminPrivateRoute;

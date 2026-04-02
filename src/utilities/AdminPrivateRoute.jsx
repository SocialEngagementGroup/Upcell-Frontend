import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./UserContextProvider";



const AdminPrivateRoute = ({ children }) => {
    const {user, loading} = useContext(userContext)

    if (loading){
        return <div>loading...</div>
    }

    if(user){
        // console.log("user in adminPrivate: ", user)
        const admins = import.meta.env.VITE_ADMINS.split(",")

        if(admins.includes(user?.email)){

            return <>{children}</>
        }
    }

    return (
        <Navigate to="/login?admin=true"></Navigate>
    );
};

export default AdminPrivateRoute;
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./UserContextProvider";



const AdminPrivateRoute = ({ children }) => {
    const {user, loading} = useContext(userContext)

    if (loading){
        return <div>loading...</div>
    }

    if (user?.role === "admin") {
        return <>{children}</>
    }

    return <Navigate to={user ? "/" : "/login?admin=true"} replace />;
};

export default AdminPrivateRoute;

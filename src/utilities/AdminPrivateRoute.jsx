import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./UserContextProvider";



const AdminPrivateRoute = ({ children }) => {
    const {user, loading} = useContext(userContext)

    console.log("[DEBUG AdminPrivateRoute] loading:", loading);
    console.log("[DEBUG AdminPrivateRoute] user?.email:", user?.email);
    console.log("[DEBUG AdminPrivateRoute] user?.role:", user?.role);
    console.log("[DEBUG AdminPrivateRoute] current path:", window.location.pathname + window.location.search);
    console.log("[DEBUG AdminPrivateRoute] decision:", loading ? "waiting" : (user?.role === "admin" ? "allow" : "redirect"));

    if (loading){
        return <div>loading...</div>
    }

    if (user?.role === "admin") {
        return <>{children}</>
    }

    return <Navigate to={user ? "/" : "/login?admin=true"} replace />;
};

export default AdminPrivateRoute;

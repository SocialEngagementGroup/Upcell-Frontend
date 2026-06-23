import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./UserContextProvider";
import RouteLoadingScreen from "../components/RouteLoadingScreen/RouteLoadingScreen";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(userContext);

    if (loading) {
        return <RouteLoadingScreen />;
    }

    if (user) {
        return <>{children}</>;
    }

    return <Navigate to="/login" replace />;
};

export default PrivateRoute;

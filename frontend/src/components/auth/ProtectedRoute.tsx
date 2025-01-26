import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token && location.pathname !== "/login") {
        console.warn("🔒 No token found. Redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
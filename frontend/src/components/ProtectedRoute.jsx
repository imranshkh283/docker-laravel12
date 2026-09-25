import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise render the child route
    return <Outlet />;
}

export default ProtectedRoute;

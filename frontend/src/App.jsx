import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Users from "./pages/Users";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";

import CategoryList from "./pages/categories/CategoryList";
import CategoryForm from "./pages/categories/CategoryForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route index element={<Home />} />
                        <Route path="users" element={<Users />} />
                        <Route path="about" element={<About />} />

                        {/* Categories */}
                        <Route path="categories" element={<CategoryList />} />
                        <Route
                            path="categories/create"
                            element={<CategoryForm />}
                        />
                        <Route
                            path="categories/:id/edit"
                            element={<CategoryForm />}
                        />
                    </Route>
                </Route>

                {/* 404 fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

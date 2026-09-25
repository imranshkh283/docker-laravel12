import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Header() {
    const navigate = useNavigate();

    // Read user from localStorage (set during login)
    const [user] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Logout handler
    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            // Even if API fails, still clear local data
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
                >
                    {/* Avatar circle with first letter */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-medium text-gray-800">
                            {user?.name || "User"}
                        </p>
                    </div>

                    <svg
                        className={`h-4 w-4 text-gray-400 transition ${
                            dropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        <div className="border-b border-gray-100 px-4 py-2 sm:hidden">
                            <p className="truncate text-sm font-medium text-gray-800">
                                {user?.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate("/dashboard/profile");
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;

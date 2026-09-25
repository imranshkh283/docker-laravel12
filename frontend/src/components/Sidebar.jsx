import { NavLink } from "react-router-dom";

function Sidebar() {
    // Reusable class for links
    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
            isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    return (
        <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
            {/* Brand */}
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <span className="text-lg font-bold text-gray-900">MyApp</span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 p-4">
                <NavLink to="/dashboard" end className={linkClass}>
                    <span>🏠</span> Dashboard
                </NavLink>

                <NavLink to="/dashboard/users" className={linkClass}>
                    <span>👥</span> Users
                </NavLink>

                <NavLink to="/dashboard/about" className={linkClass}>
                    <span>ℹ️</span> About
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;

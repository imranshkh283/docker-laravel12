import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Layers, Receipt } from "lucide-react";
import { useState } from "react";

function Sidebar() {
    const [expenseOpen, setExpenseOpen] = useState(false);
    const location = useLocation();

    const isExpenseActive = location.pathname.startsWith(
        "/dashboard/expense-tracker",
    );

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

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-4">
                <NavLink to="/dashboard" end className={linkClass}>
                    <span>🏠</span> Dashboard
                </NavLink>

                <NavLink to="/dashboard/categories" className={linkClass}>
                    <span>📁</span> Categories
                </NavLink>

                <NavLink to="/dashboard/products" className={linkClass}>
                    <span>📦</span> Products
                </NavLink>

                <NavLink to="/dashboard/pos" className={linkClass}>
                    <span>🧾</span> POS
                </NavLink>

                <NavLink to="/dashboard/leave-approve" className={linkClass}>
                    <span>✅</span> Task
                </NavLink>

                {/* Expense Tracker Dropdown */}
                <div>
                    <button
                        type="button"
                        onClick={() => setExpenseOpen(!expenseOpen)}
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                            isExpenseActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                        <span className="flex items-center gap-3">
                            <span>₹</span>
                            Expense Tracker
                        </span>

                        <ChevronDown
                            size={17}
                            className={`transition-transform duration-200 ${
                                expenseOpen || isExpenseActive
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>

                    {(expenseOpen || isExpenseActive) && (
                        <div className="ml-5 mt-1 flex flex-col gap-1 border-l-2 border-gray-200 pl-4">
                            <NavLink
                                to="/dashboard/expense-tracker/category"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                                        isActive
                                            ? "bg-blue-50 font-semibold text-blue-600"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`
                                }
                            >
                                <Layers size={16} />
                                Category
                            </NavLink>

                            <NavLink
                                to="/dashboard/expense-tracker/expense"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                                        isActive
                                            ? "bg-blue-50 font-semibold text-blue-600"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`
                                }
                            >
                                <Receipt size={16} />
                                Expense
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink to="/dashboard/manager" className={linkClass}>
                    <span>👨‍💼</span> Manager
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

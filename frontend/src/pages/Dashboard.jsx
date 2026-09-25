import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            {/* Right side: header + content */}
            <div className="flex flex-1 flex-col">
                <Header />

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Dashboard;

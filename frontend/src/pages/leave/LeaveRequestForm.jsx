// src/components/LeaveRequestForm.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";

export default function LeaveRequestForm({ onSuccess }) {
    const { user, userId, isAuthenticated, logout } = useAuth();
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [form, setForm] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const leaveType = async () => {
        try {
            const response = await api.get("/leave-type");
            const data = response.data;

            if (data.success === true) {
                setLeaveTypes(Object.values(data.data));
            } else {
                setLeaveTypes([]);
            }
        } catch (error) {
            console.error(error);
            setLeaveTypes([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.post("/leave-request", { ...form, user_id: userId });
            setForm({
                leave_type_id: "",
                start_date: "",
                end_date: "",
                reason: "",
            });
            onSuccess?.();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                JSON.stringify(err.response?.data?.errors) ||
                "Failed to submit";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        leaveType();
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800">
                Apply for Leave
            </h2>

            {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave Type
                    </label>
                    <select
                        name="leave_type_id"
                        required
                        defaultValue=""
                        value={form.leave_type_id}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm outline-none transition duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236b7280' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                        }}
                    >
                        <option value="" disabled>
                            Select leave type
                        </option>

                        {leaveTypes.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason
                    </label>
                    <input
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        required
                        placeholder="Why do you need this leave?"
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <input
                            type="date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                            className="block w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        End Date <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <input
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            min={form.start_date || undefined}
                            required
                            className="block w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-md font-medium"
            >
                {loading ? "Submitting…" : "Submit Request"}
            </button>
        </form>
    );
}

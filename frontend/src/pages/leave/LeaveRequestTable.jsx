import { useEffect, useState } from "react";
import api from "../../api";

export default function LeaveRequestTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = () => {
        setLoading(true);
        api.get("/leave-request")
            .then((res) => setData(res.data.data || res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleApprove = () => {};
    const handleReject = () => {};
    const handleCancel = () => {};

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 text-left">Employee</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">From</th>
                        <th className="px-4 py-3 text-left">To</th>
                        <th className="px-4 py-3 text-left">Days</th>
                        <th className="px-4 py-3 text-left">Reason</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{r.user?.name || "—"}</td>
                            <td className="px-4 py-3">
                                {r.leave_type?.name || "—"}
                            </td>
                            <td className="px-4 py-3">
                                {r.formatted_start_date}
                            </td>
                            <td className="px-4 py-3">
                                {r.formatted_end_date}
                            </td>
                            <td className="px-4 py-3">{r.total_days}</td>
                            <td
                                className="px-4 py-3 max-w-xs truncate"
                                title={r.reason}
                            >
                                {r.reason}
                            </td>
                            <td className="px-4 py-3">{r.status}</td>
                            {
                                <td className="px-4 py-3">
                                    {r.status === "pending" ? (
                                        ["1", "2", "3", "4"].includes(
                                            String(r.user?.role),
                                        ) ? (
                                            <button
                                                onClick={() =>
                                                    handleCancel(r.id)
                                                }
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleApprove(r.id)
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleReject(r.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <span className="text-gray-400 text-xs">
                                            —
                                        </span>
                                    )}
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

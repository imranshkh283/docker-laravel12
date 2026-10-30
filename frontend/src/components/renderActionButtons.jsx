export default function renderActionButtons(row) {
    // No buttons if the request is no longer pending
    if (row.status !== "pending") {
        return <span className="text-gray-400 text-xs">—</span>;
    }

    // ADMIN / MANAGER → Approve + Reject
    if (role === "admin" || role === "manager") {
        return (
            <div className="flex gap-2">
                <button
                    onClick={() => onAction?.(row.id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                >
                    Approve
                </button>
                <button
                    onClick={() => onAction?.(row.id, "reject")}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                >
                    Reject
                </button>
            </div>
        );
    }

    // EMPLOYEE → Cancel only
    if (role === "employee") {
        return (
            <button
                onClick={() => onAction?.(row.id, "cancel")}
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded"
            >
                Cancel
            </button>
        );
    }

    // Fallback — unknown role
    return <span className="text-gray-400 text-xs">—</span>;
}

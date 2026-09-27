function DeleteModal({ count, onCancel, onConfirm }) {
    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            {/* Modal box */}
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                    Delete {count} {count === 1 ? "category" : "categories"}?
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    This action cannot be undone. The selected item
                    {count > 1 ? "s" : ""} will be permanently removed.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;

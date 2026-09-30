import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api";
import DeleteModal from "../categories/DeleteModal";

function ProductList() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products");
            setProducts(response.data.data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    // Checkbox: select all / deselect all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(products.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete("/products/bulk", {
                data: { ids: selectedIds },
            });
            setSelectedIds([]);
            setShowDeleteModal(false);
            fetchProducts();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const isAllSelected =
        products.length > 0 && selectedIds.length === products.length;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Header row: title + buttons */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                    Products
                </h2>

                <div className="flex gap-2">
                    {/* Delete — disabled until at least one selected */}
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={selectedIds.length === 0}
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Delete ({selectedIds.length})
                    </button>

                    {/* Add new */}
                    <button
                        onClick={() => navigate("/dashboard/products/create")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <p className="py-10 text-center text-sm text-gray-500">
                    Loading...
                </p>
            ) : products.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">
                    No products yet. Click "Add Product" to create one.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-600">
                                    Category
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-600">
                                    Name
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-600">
                                    SKU
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-600">
                                    Price
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-600">
                                    Stock
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-600">
                                    Total Price
                                </th>
                                <th className="w-24 px-4 py-3 text-right font-medium text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(
                                                product.id,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(product.id)
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {product.category.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {product.sku}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {product.price}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {product.stock}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {product.price * product.stock}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/dashboard/products/${product.id}/edit`,
                                                )
                                            }
                                            className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <DeleteModal
                    count={selectedIds.length}
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
}

export default ProductList;

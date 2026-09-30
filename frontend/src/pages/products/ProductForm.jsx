import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function ProductForm() {
    const { id } = useParams(); // present → edit mode
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        is_active: false,
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/categories");
                setCategories(res.data.data);
            } catch {
                // toast.error("Failed to load categories");
            }
        })();
    }, []);

    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            try {
                const res = await api.get(`/products/${id}`);
                const product = res.data.data;
                setForm({
                    category_id: product.category_id,
                    name: product.name,
                    sku: product.sku,
                    price: product.price,
                    stock: product.stock,
                    description: product.description || "",
                });
            } catch (err) {
                if (err.response?.status === 404) {
                    navigate("/dashboard/products", { replace: true });
                    return;
                }
            }
        })();
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            if (isEdit) {
                await api.put(`/products/${id}`, form);
                //toast.success("Product updated");
            } else {
                await api.post("/products", form);
                //toast.success("Product created");
            }
            navigate("/dashboard/products");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                //toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? "Edit Product" : "Add Product"}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.category_id[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.name[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Product SKU
                    </label>
                    <input
                        name="sku"
                        type="text"
                        value={form.sku}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.sku && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.sku[0]}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Price</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.price && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.price[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Stock</label>
                        <input
                            name="stock"
                            type="number"
                            step="1"
                            min="1"
                            max="100"
                            value={form.stock}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.stock && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.stock[0]}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.description && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.description[0]}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                    >
                        {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/products")}
                        className="px-5 py-2 rounded border"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

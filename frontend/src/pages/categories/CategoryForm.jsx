import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function CatgoryForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // undefined on /create, defined on /:id/edit

    const isEdit = Boolean(id);

    const [form, setForm] = useState({ name: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (!isEdit) return;

        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${id}`);
                setForm({ name: response.data.data.name });
            } catch (error) {
                console.error("Failed to load category", error);
            } finally {
                setFetching(false);
            }
        };

        fetchCategory();
    }, [id, isEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const insertCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await api.put(`/categories/${id}`, form);
            } else {
                const response = await api.post("/categories", form);
                if (response.data.success) {
                    setForm({ name: "" });
                }
            }
            navigate("/dashboard/categories");
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="max-w-md" onSubmit={insertCategory}>
            <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category Name
                </label>
                <input
                    name="name"
                    type="text"
                    placeholder="Enter category name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.name[0]}
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading
                        ? isEdit
                            ? "Updating..."
                            : "Creating..."
                        : isEdit
                          ? "Update Category"
                          : "Create Category"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard/categories")}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default CatgoryForm;

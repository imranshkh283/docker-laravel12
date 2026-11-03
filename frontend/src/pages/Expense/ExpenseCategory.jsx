import { useMemo, useState, useEffect } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Wallet,
    TrendingDown,
    TrendingUp,
    Coffee,
    Plane,
    ShoppingBag,
    Laptop,
    X,
    Layers,
} from "lucide-react";

import api from "../../api";

const initialCategories = [
    { id: 1, name: "Break Fast", type: "Expense" },
    { id: 2, name: "Salary", type: "Income" },
    { id: 3, name: "Travel", type: "Expense" },
    { id: 4, name: "Freelancing", type: "Income" },
    { id: 5, name: "Shopping", type: "Expense" },
    { id: 6, name: "Rent", type: "Expense" },
];

const ExpenseCategory = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        type: "",
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await api.get("/expense-category");

            setCategories(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = useMemo(() => {
        return categories.filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesFilter = filter === "All" || item.type === filter;

            return matchesSearch && matchesFilter;
        });
    }, [categories, search, filter]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const expenseCount = categories.filter(
        (item) => item.type === "expense",
    ).length;

    const incomeCount = categories.filter(
        (item) => item.type === "income",
    ).length;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.type) return;
        try {
            let response = "";

            if (editId) {
                response = api.put(`/expense-category/update/${editId}`, {
                    expense_cat_name: form.name,
                    expense_type: form.type,
                });
            } else {
                response = api.post("/expense-category/store", {
                    expense_cat_name: form.name,
                    expense_type: form.type,
                });
            }

            setForm({
                name: "",
                type: "Expense",
            });

            fetchCategories();

            if (response.data.success) {
                console.log(response.data);
            }
        } catch (error) {
            const errors = error.response?.data?.errors;
            console.log(errors);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setForm({
            name: item.name,
            type: item.type,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            const response = await api.delete(`/expense-category/delete/${id}`);

            if (response.data.success) {
                console.log(response.data.message);

                // Refresh category list
                fetchCategories();
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setEditId(null);
        setForm({
            name: "",
            type: "",
        });
    };

    const getIcon = (category) => {
        const value = category.toLowerCase();

        if (value.includes("food") || value.includes("break")) return Coffee;
        if (value.includes("travel")) return Plane;
        if (value.includes("shopping")) return ShoppingBag;
        if (value.includes("salary")) return Wallet;
        if (value.includes("freelance")) return Laptop;

        return Layers;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Expense Categories
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage your income and expense categories
                        </p>
                    </div>

                    <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                        Category Management
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard
                        title="Total Categories"
                        count={categories.length}
                        icon={Layers}
                        color="indigo"
                    />

                    <SummaryCard
                        title="Expense Categories"
                        count={expenseCount}
                        icon={TrendingDown}
                        color="orange"
                    />

                    <SummaryCard
                        title="Income Categories"
                        count={incomeCount}
                        icon={TrendingUp}
                        color="green"
                    />
                </div>

                {/* Form */}
                <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {editId
                                    ? "Update Category"
                                    : "Add New Category"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Enter category details below
                            </p>
                        </div>

                        {editId && (
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500"
                            >
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Break Fast"
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category Type
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">Select</option>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Plus size={18} />
                                    {editId
                                        ? "Update Category"
                                        : "Add Category"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Category List
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {filteredCategories.length} categories found
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-3 text-slate-400"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search category..."
                                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 sm:w-56"
                                />
                            </div>

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Category Name
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Category Type
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredCategories.map((item) => {
                                    const Icon = getIcon(item.name);

                                    return (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                                        <Icon size={19} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                        item.type === "income"
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-orange-50 text-orange-700"
                                                    } capitalize`}
                                                >
                                                    {item.type}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-12 text-center"
                                        >
                                            <Layers
                                                className="mx-auto mb-3 text-slate-300"
                                                size={35}
                                            />
                                            <p className="font-semibold text-slate-600">
                                                No categories found
                                            </p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Try another search or add a new
                                                category.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, count, icon: Icon, color }) => {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        orange: "bg-orange-50 text-orange-600",
        green: "bg-green-50 text-green-600",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-800">
                        {count}
                    </h3>
                </div>

                <div className={`rounded-xl p-3 ${colors[color]}`}>
                    <Icon size={23} />
                </div>
            </div>
        </div>
    );
};

export default ExpenseCategory;

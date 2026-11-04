import { useMemo, useState, useEffect } from "react";
import api from "../../api";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Wallet,
    TrendingDown,
    CalendarDays,
    Receipt,
    X,
    Filter,
    Coffee,
    Plane,
    ShoppingBag,
    Home,
    HeartPulse,
    GraduationCap,
    Utensils,
    MoreHorizontal,
} from "lucide-react";

const initialExpenses = [
    {
        id: 1,
        title: "Breakfast",
        category: "Food",
        amount: 250,
        date: "2026-11-03",
        payment: "Cash",
        note: "Morning breakfast",
    },
];

// const categories = [
//     "Food",
//     "Travel",
//     "Shopping",
//     "Rent",
//     "Bills",
//     "Entertainment",
//     "Health",
//     "Education",
//     "Other",
// ];

const Expense = () => {
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState(initialExpenses);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        expense_category_id: "",
        expense_title: "",
        type: "expense",
        amount: "",
        description: "",
        transaction_date: "2026-11-04",
        payment_method: "",
    });

    const currency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    const totalExpense = expenses.reduce(
        (total, item) => total + Number(item.amount),
        0,
    );

    const todayExpense = expenses
        .filter((item) => item.date === "2026-11-03")
        .reduce((total, item) => total + Number(item.amount), 0);

    const monthlyExpense = expenses
        .filter((item) => item.date.startsWith("2026-11"))
        .reduce((total, item) => total + Number(item.amount), 0);

    const averageExpense =
        expenses.length > 0 ? totalExpense / expenses.length : 0;

    const filteredExpenses = useMemo(() => {
        return expenses.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase());

            const matchesFilter = filter === "all" || item.category === filter;

            const matchesDate =
                dateFilter === "all" ||
                (dateFilter === "today" && item.date === "2026-11-03") ||
                (dateFilter === "month" && item.date.startsWith("2026-11"));

            return matchesSearch && matchesFilter && matchesDate;
        });
    }, [expenses, search, filter, dateFilter]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const fetchExpenseCategory = async () => {
        const response = await api.get(`/expense-category`);
        console.log(response);
        setCategories(response.data.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            expense_category_id: Number(form.expense_category_id),
            expense_title: form.expense_title.trim(),
            type: form.type,
            amount: Number(form.amount),
            description: form.description.trim(),
            transaction_date: form.transaction_date,
            payment_method: form.payment_method,
        };
        console.log("Request Payload:", payload);
        try {
            let response;

            if (editId) {
                response = await api.put(`/expense/${editId}`, payload);
            } else {
                response = await api.post("/expense/store", payload);
            }

            console.log("Status:", response.status);
            console.log("Response:", response.data);

            if (response.data.success) {
                resetForm();
                // API se updated expenses fetch karein
                fetchExpenses();
            }
        } catch (error) {
            console.log(error.response?.data?.errors || error.response?.data);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setForm({
            expense_category_id: item.expense_category_id,
            expense_title: item.expense_title,
            type: item.type,
            amount: item.amount,
            description: item.description || "",
            transaction_date: item.transaction_date,
            payment_method: item.payment_method,
        });

        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            setExpenses((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const resetForm = () => {
        setEditId(null);
        setShowForm(false);

        setForm({
            expense_category_id: "",
            expense_title: "",
            type: "expense",
            amount: "",
            description: "",
            transaction_date: "2026-11-04",
            payment_method: "",
        });
    };

    const getCategoryIcon = (category) => {
        const icons = {
            Food: Utensils,
            Travel: Plane,
            Shopping: ShoppingBag,
            Rent: Home,
            Bills: Wallet,
            Health: HeartPulse,
            Education: GraduationCap,
            Entertainment: Coffee,
            Other: MoreHorizontal,
        };

        return icons[category] || Receipt;
    };

    useEffect(() => {
        fetchExpenseCategory();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Expense Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Track, manage and monitor your daily expenses.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Add Expense
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Expenses"
                        amount={currency(totalExpense)}
                        icon={Wallet}
                        color="indigo"
                    />

                    <SummaryCard
                        title="This Month"
                        amount={currency(monthlyExpense)}
                        icon={CalendarDays}
                        color="blue"
                    />

                    <SummaryCard
                        title="Today's Expense"
                        amount={currency(todayExpense)}
                        icon={TrendingDown}
                        color="orange"
                    />

                    <SummaryCard
                        title="Average Expense"
                        amount={currency(averageExpense)}
                        icon={Receipt}
                        color="green"
                    />
                </div>

                {/* Add Expense Form */}
                {showForm && (
                    <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    {editId
                                        ? "Update Expense"
                                        : "Add New Expense"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Enter your expense details below.
                                </p>
                            </div>

                            <button
                                onClick={resetForm}
                                className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-red-50 hover:text-red-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <FormInput
                                    label="Expense Title"
                                    name="expense_title"
                                    value={form.expense_title}
                                    onChange={handleChange}
                                    placeholder="e.g. Office Lunch"
                                />

                                <FormSelect
                                    label="Category"
                                    name="expense_category_id"
                                    value={form.expense_category_id}
                                    onChange={handleChange}
                                    options={categories}
                                />

                                <FormInput
                                    label="Amount (₹)"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                />

                                <FormInput
                                    label="Expense Date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />

                                <FormSelect
                                    label="Payment Method"
                                    name="payment_method"
                                    value={form.payment_method}
                                    onChange={handleChange}
                                    options={[
                                        "Cash",
                                        "UPI",
                                        "Credit Card",
                                        "Debit Card",
                                        "Bank Transfer",
                                    ]}
                                />

                                <FormInput
                                    label="Description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="mt-6 flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    <Plus size={18} />
                                    {editId ? "Update Expense" : "Save Expense"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Expense List */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Expense History
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {filteredExpenses.length} expenses found
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-3 text-slate-400"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search expense..."
                                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 sm:w-52"
                                />
                            </div>

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.type})
                                    </option>
                                ))}
                            </select>

                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    {[
                                        "Expense",
                                        "Category",
                                        "Date",
                                        "Payment",
                                        "Amount",
                                        "Actions",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredExpenses.map((item) => {
                                    const Icon = getCategoryIcon(item.category);

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

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">
                                                            {item.expense_title}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {item.note ||
                                                                "No description"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                                                    {item.category}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {new Date(
                                                    item.date + "T00:00:00",
                                                ).toLocaleDateString("en-IN")}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {item.payment}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-red-600">
                                                - {currency(item.amount)}
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

                                {filteredExpenses.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-16 text-center"
                                        >
                                            <Receipt
                                                size={40}
                                                className="mx-auto mb-3 text-slate-300"
                                            />
                                            <p className="font-semibold text-slate-600">
                                                No expenses found
                                            </p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Try another search or add a new
                                                expense.
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

// Summary Card
const SummaryCard = ({ title, amount, icon: Icon, color }) => {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        blue: "bg-blue-50 text-blue-600",
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
                    <h3 className="mt-2 text-2xl font-bold text-slate-800">
                        {amount}
                    </h3>
                </div>

                <div className={`rounded-xl p-3 ${colors[color]}`}>
                    <Icon size={23} />
                </div>
            </div>
        </div>
    );
};

// Reusable Input
const FormInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
}) => (
    <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={name !== "note"}
            min={type === "number" ? "0.01" : undefined}
            step={type === "number" ? "0.01" : undefined}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
    </div>
);

// Reusable Select
const FormSelect = ({ label, name, value, onChange, options }) => (
    <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
            <option value="">Select {label}</option>

            {options.map((item) => {
                const isObject = typeof item === "object";

                return (
                    <option
                        key={isObject ? item.id : item}
                        value={isObject ? item.id : item}
                    >
                        {isObject ? `${item.name} (${item.type})` : item}
                    </option>
                );
            })}
        </select>
    </div>
);

export default Expense;

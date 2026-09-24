import { useState } from "react";

import api from "../api";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErrors({});
        setSuccess(false);

        try {
            const response = await api.post("/login", form);
            console.log(form);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user),
                );

                setSuccess(response.data.message);

                setForm({ email: "", password: "" });
            }
        } catch (error) {
            // Laravel validation errors: { email: ["..."], password: ["..."] }
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ message: "Something went wrong. Try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
            <div className="w-full max-w-md">
                <form
                    className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl"
                    onSubmit={handleLogin}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                            <svg
                                className="h-7 w-7 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Login to your account
                        </p>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Success */}
                    {success && (
                        <p className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    {/* General Error */}
                    {errors.message && (
                        <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                            {errors.message}
                        </p>
                    )}

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-gray-200" />
                        <span className="px-3 text-xs text-gray-400">OR</span>
                        <div className="flex-1 border-t border-gray-200" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Register
                        </a>
                    </p>

                    {/* Forgot password */}
                    <p className="mt-3 text-center text-sm">
                        <a
                            href="/forgot-password"
                            className="text-gray-500 hover:text-blue-600 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;

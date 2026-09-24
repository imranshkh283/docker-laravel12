import { useState } from "react";

import api from "../api";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/register", form);
            if (response.data.success) {
                setSuccess(response.data.message);

                setForm({
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                });
                setErrors({});
            }

            console.log("Response:", response.data);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
            <div className="w-full max-w-md">
                <form
                    className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl"
                    onSubmit={handleRegister}
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
                            Create an account
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Register to get started with your account
                        </p>
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Name
                        </label>

                        <input
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
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
                    </div>

                    {/* Password */}
                    <div className="mb-4">
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
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Confirm password
                        </label>

                        <input
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirm your password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        Create Account
                    </button>

                    {/* Success */}
                    {success && (
                        <p className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    {/* Error */}
                    {errors && (
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

                    {/* Login */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Login
                        </a>
                    </p>

                    {/* Forgot Password */}
                    <p className="mt-3 text-center text-sm">
                        <a
                            href="/forgot-password"
                            className="text-gray-500 hover:text-blue-600 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </p>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    By creating an account, you agree to our Terms & Privacy
                    Policy.
                </p>
            </div>
        </div>
    );
}

export default Register;

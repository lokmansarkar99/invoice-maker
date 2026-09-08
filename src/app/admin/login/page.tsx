"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Admin <span className="text-blue-600">Login</span></h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input required type="email" name="email" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mt-2 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input required type="password" name="password" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mt-2 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

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
      <div className="max-w-md w-full glass rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Admin <span className="text-teal-400">Login</span></h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input required type="email" name="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mt-2 text-white focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input required type="password" name="password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mt-2 text-white focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold py-3 rounded-lg shadow-lg transition-all mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

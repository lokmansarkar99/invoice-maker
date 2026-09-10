"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { Terminal } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [storeName, setStoreName] = useState("");
  const router = useRouter();

  // Ensure body scroll is hidden on mount for this specific page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Fetch store name
    async function fetchStore() {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.success && json.data?.storeName) {
          setStoreName(json.data.storeName);
        }
      } catch (err) {}
    }
    fetchStore();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  async function handleSubmit(formData: FormData) {
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col items-center pt-8 sm:pt-16 px-4 font-mono light:font-sans overflow-hidden bg-black light:bg-white z-50">
      {/* Fixed Full Screen Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none light:hidden"
        style={{
          backgroundImage: "url('/studio-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for studio vibe */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
        
        {/* Grid overlay for retro feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      </div>

      {/* Main Login Card - Smaller Max Width */}
      <div className="w-full max-w-sm sm:max-w-md bg-black/80 light:bg-white backdrop-blur-md border border-cyan-500/50 light:border-slate-300 shadow-[0_0_30px_rgba(6,182,212,0.3)] light:shadow-md light:shadow-xl p-6 sm:p-8 relative z-10 mt-4 sm:mt-10 mx-auto light:rounded-2xl">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-cyan-500/30 light:border-slate-300 pb-3 mb-6">
          <Terminal size={20} className="text-cyan-400 light:text-slate-900 light:text-indigo-600" />
          <h2 className="text-md sm:text-md font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal light:tracking-tight">
            SYS_AUTH {storeName ? `// ${storeName}` : ""}
          </h2>
          <span className="w-2 h-4 bg-cyan-400 light:bg-indigo-600 animate-pulse ml-1"></span>
        </div>
        
        {error && (
          <div className="bg-red-950/50 light:bg-red-50 text-red-500 font-bold border-l-4 border-red-500 p-3 mb-6 text-xs sm:text-sm tracking-wide light:tracking-normal light:rounded-r-md">
            [FATAL] {error}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
              // USER_IDENTIFICATION
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 light:text-slate-700 light:text-slate-600 font-bold">{">"}</span>
              <input 
                required 
                type="email" 
                name="email" 
                className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 px-8 py-3 text-cyan-300 light:text-slate-900 font-mono light:font-sans text-sm placeholder-cyan-900/50 light:placeholder-slate-400 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 light:focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] light:focus:shadow-md transition-all light:rounded-lg" 
                placeholder="admin@sys.local"
              />
            </div>
          </div>
          
          <div className="group">
            <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
              // SECURE_PASSPHRASE
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 light:text-slate-700 light:text-slate-600 font-bold">{">"}</span>
              <input 
                required 
                type="password" 
                name="password" 
                className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 px-8 py-3 text-cyan-300 light:text-slate-900 font-mono light:font-sans text-sm placeholder-cyan-900/50 light:placeholder-slate-400 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 light:focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] light:focus:shadow-md transition-all light:rounded-lg" 
                placeholder="********"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-cyan-950/50 light:bg-slate-200 light:bg-indigo-600 text-cyan-400 light:text-slate-900 light:text-white text-sm sm:text-base tracking-widest light:tracking-normal font-bold py-3 border border-cyan-500/50 light:border-slate-300 light:border-transparent hover:bg-cyan-900/50 light:hover:bg-indigo-50 light:hover:bg-indigo-700 hover:text-cyan-300 light:hover:text-indigo-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] light:hover:shadow-lg transition-all mt-6 flex items-center justify-center gap-2 relative overflow-hidden group light:rounded-lg"
          >
            <span className="relative z-10">EXECUTE_LOGIN</span>
            <div className="absolute inset-0 bg-cyan-400/10 light:bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-cyan-500/30 light:border-slate-300 text-center">
          <Link href="/" className="text-[10px] sm:text-xs text-cyan-700 light:text-slate-600 light:text-slate-700 hover:text-cyan-400 light:hover:text-indigo-600 tracking-widest light:tracking-normal transition-colors flex items-center justify-center gap-2">
            {"<"} Return to Front_End
          </Link>
        </div>
      </div>
      
      {/* Decorative terminal output */}
      <div className="fixed bottom-4 left-4 text-cyan-800 light:text-slate-600 text-[10px] sm:text-xs font-mono light:font-sans opacity-50 hidden md:block z-10 pointer-events-none light:hidden">
        <p>sys.boot sequence initiated...</p>
        <p>loading modules: [OK]</p>
        <p>establishing secure connection... [WAIT]</p>
        <p className="animate-pulse">awaiting auth_token...</p>
      </div>
    </div>
  );
}

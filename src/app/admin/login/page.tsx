"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { Terminal } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const router = useRouter();

  // Ensure body scroll is hidden on mount for this specific page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
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
    <div className="fixed inset-0 w-screen h-screen flex flex-col items-center pt-8 sm:pt-16 px-4 font-mono overflow-hidden bg-black z-50">
      {/* Fixed Full Screen Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
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
      <div className="w-full max-w-sm sm:max-w-md bg-black/80 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] p-6 sm:p-8 relative z-10 mt-4 sm:mt-10 mx-auto">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-3 mb-6">
          <Terminal size={20} className="text-cyan-400" />
          <h2 className="text-lg sm:text-xl font-bold text-cyan-400 tracking-widest uppercase">
            SYS_AUTH
          </h2>
          <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>
        </div>
        
        {error && (
          <div className="bg-red-950/50 text-red-500 font-bold border-l-4 border-red-500 p-3 mb-6 text-xs sm:text-sm uppercase tracking-wide">
            [FATAL] {error}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="text-[10px] sm:text-xs font-bold text-cyan-600 uppercase tracking-widest block mb-1 group-focus-within:text-cyan-400 transition-colors">
              // USER_IDENTIFICATION
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">{">"}</span>
              <input 
                required 
                type="email" 
                name="email" 
                className="w-full bg-black/50 border border-cyan-900 px-8 py-3 text-cyan-300 font-mono text-sm placeholder-cyan-900/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all" 
                placeholder="admin@sys.local"
              />
            </div>
          </div>
          
          <div className="group">
            <label className="text-[10px] sm:text-xs font-bold text-cyan-600 uppercase tracking-widest block mb-1 group-focus-within:text-cyan-400 transition-colors">
              // SECURE_PASSPHRASE
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">{">"}</span>
              <input 
                required 
                type="password" 
                name="password" 
                className="w-full bg-black/50 border border-cyan-900 px-8 py-3 text-cyan-300 font-mono text-sm placeholder-cyan-900/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all" 
                placeholder="********"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-cyan-950/50 text-cyan-400 text-sm sm:text-base uppercase tracking-widest font-bold py-3 border border-cyan-500/50 hover:bg-cyan-900/50 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all mt-6 flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="relative z-10">EXECUTE_LOGIN</span>
            <div className="absolute inset-0 bg-cyan-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-cyan-500/30 text-center">
          <Link href="/" className="text-[10px] sm:text-xs text-cyan-700 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            {"<"} Return to Front_End
          </Link>
        </div>
      </div>
      
      {/* Decorative terminal output */}
      <div className="fixed bottom-4 left-4 text-cyan-800 text-[10px] sm:text-xs font-mono opacity-50 hidden md:block z-10 pointer-events-none">
        <p>sys.boot sequence initiated...</p>
        <p>loading modules: [OK]</p>
        <p>establishing secure connection... [WAIT]</p>
        <p className="animate-pulse">awaiting auth_token...</p>
      </div>
    </div>
  );
}

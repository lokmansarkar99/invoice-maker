"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Lock, Printer, ArrowRight, Menu, MapPin, Phone, Mail, User, Terminal } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  const [invoiceId, setInvoiceId] = useState("");
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const binNumber = process.env.NEXT_PUBLIC_BIN || "BIN-000000000-0000";
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+880 1712-000000";
  const devName = process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Lokman Sarkar";
  const devUrl = process.env.NEXT_PUBLIC_DEVELOPER_URL || "#";

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.success) setStore(json.data);
      } catch (err) {}
    }
    fetchStore();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invoices/${invoiceId.trim()}`);
      const json = await res.json();
      
      if (json.success && json.data) {
        router.push(`/invoice/${json.data.invoiceNumber}`);
      } else {
        setError("ERR_NOT_FOUND: Check Invoice ID payload.");
      }
    } catch (err) {
      setError("FATAL: Execution failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-mono light:font-sans relative overflow-hidden bg-black light:bg-slate-50 text-cyan-300 light:text-slate-900">
      {/* Fixed Full Screen Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none light:hidden"
        style={{
          backgroundImage: "url('/studio-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      {/* Top Navbar */}
      <nav className="relative z-50 bg-black/80 light:bg-white/80 backdrop-blur-md border-b border-cyan-500/50 light:border-slate-200 shadow-[0_4px_30px_rgba(6,182,212,0.15)] light:shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="bg-cyan-950/50 light:bg-indigo-50 text-cyan-400 light:text-indigo-600 p-2 border border-cyan-500/50 light:border-indigo-100 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] light:group-hover:shadow-md transition-all rounded-md">
              <Terminal size={24} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-widest light:tracking-tight text-cyan-400 light:text-slate-900">SYS_INVOICE</span>
              <span className="hidden sm:flex items-center bg-cyan-950/30 light:bg-emerald-50 text-cyan-500 light:text-emerald-600 text-[10px] font-bold px-2 py-1 border border-cyan-800 light:border-emerald-200 ml-2 tracking-widest light:tracking-normal light:rounded-full animate-pulse">
                [LIVE_NODE]
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 font-bold text-xs text-cyan-600 light:text-slate-600 tracking-widest light:tracking-normal">
            <a href="#" className="hover:text-cyan-400 light:hover:text-indigo-600 transition-colors">/BILLING_PORTAL</a>
            <a href="#" className="hover:text-cyan-400 light:hover:text-indigo-600 transition-colors">/VERIFY_TX</a>
            <a href="#" className="hover:text-cyan-400 light:hover:text-indigo-600 transition-colors">/SYS_SUPPORT</a>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeSwitcher />
            <div className="hidden md:block text-right">
              <div className="text-[10px] text-cyan-700 light:text-slate-500 font-bold tracking-widest light:tracking-normal">OP_DESK</div>
              <div className="font-bold text-cyan-400 light:text-slate-900 text-sm">{supportPhone}</div>
            </div>
            <Link href="/admin/login" className="bg-cyan-950/50 light:bg-indigo-600 text-cyan-400 light:text-white text-xs tracking-widest light:tracking-normal font-bold py-2.5 px-6 border border-cyan-500/50 light:border-transparent hover:bg-cyan-900/50 light:hover:bg-indigo-700 hover:text-cyan-300 light:hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] light:hover:shadow-lg transition-all light:rounded-md">
              ROOT_ACCESS
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 mt-12 flex-1 w-full flex flex-col mb-16 relative z-10">
        
        {/* Store Information Panel */}
        <div className="bg-black/80 light:bg-white/90 backdrop-blur-md border border-cyan-500/50 light:border-slate-200 p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] light:shadow-md flex flex-col md:flex-row justify-between items-center mb-12 hover:border-cyan-400 light:hover:border-indigo-300 light:hover:shadow-lg transition-all group light:rounded-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto text-center md:text-left">
            <div className="w-24 h-24 bg-cyan-950/30 light:bg-indigo-50 border border-cyan-500/50 light:border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] light:group-hover:shadow-md transition-all light:rounded-xl">
              {store?.storeImageUrl ? (
                <img src={store.storeImageUrl} alt="Store Logo" className="w-full h-full object-cover mix-blend-screen light:mix-blend-normal opacity-90 light:opacity-100" />
              ) : (
                <Terminal className="text-cyan-500 light:text-indigo-400" size={32} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 justify-center md:justify-start">
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-tight">
                  {store?.storeName || "INIT_STORE_DATA..."}
                </h2>
                <span className="bg-cyan-950/50 light:bg-emerald-50 text-cyan-400 light:text-emerald-700 text-[10px] font-bold px-2 py-1 border border-cyan-500/50 light:border-emerald-200 flex items-center gap-1 w-fit mx-auto md:mx-0 tracking-wider light:tracking-normal light:rounded-full">
                  <ShieldCheck size={12} /> SECURE_NODE
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs text-cyan-600 light:text-slate-600 font-bold light:font-medium tracking-wider light:tracking-normal">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={14} className="text-cyan-500 light:text-slate-400" />
                  <span>{store?.address || "NULL_LOC"}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone size={14} className="text-cyan-500 light:text-slate-400" />
                  <span>{store?.phone || "NULL_COMMS"}</span>
                </div>
                {store?.email && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail size={14} className="text-cyan-500 light:text-slate-400" />
                    <span>{store.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <User size={14} className="text-cyan-500 light:text-slate-400" />
                  <span>{store?.proprietorName || "NULL_ADMIN"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 bg-cyan-950/30 light:bg-slate-50 border border-cyan-800 light:border-slate-200 p-5 text-center w-full md:w-auto self-stretch flex flex-col justify-center light:rounded-xl">
            <div className="text-[10px] font-bold text-cyan-700 light:text-slate-500 tracking-widest light:tracking-normal mb-1">// SYS_BIN_ID</div>
            <div className="font-bold text-lg text-cyan-400 light:text-slate-700 tracking-wider light:tracking-normal">{binNumber}</div>
          </div>
        </div>

        {/* Search Terminal */}
        <div className="bg-black/80 light:bg-white/90 backdrop-blur-md border border-cyan-500/50 light:border-slate-200 p-10 md:p-14 text-center shadow-[0_0_40px_rgba(6,182,212,0.2)] light:shadow-lg mb-16 relative light:rounded-2xl">
          
          {/* <div className="inline-flex items-center bg-cyan-950/50 text-cyan-400 text-[10px] font-bold px-3 py-1.5 border border-cyan-500/50 mb-8 relative z-10 tracking-widest">
            <span className="w-2 h-2 bg-cyan-400 animate-pulse mr-2"></span>
            GUEST_TERMINAL_V1
          </div> */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-widest light:tracking-tight text-cyan-400 light:text-slate-900 relative z-10">
            Execute {"<"}Search_Query{">"}
          </h1>
          <p className="text-cyan-600 light:text-slate-500 text-sm max-w-2xl mx-auto mb-10 relative z-10 tracking-wider light:tracking-normal">
            Input unique payload ID to retrieve official document .
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex flex-col md:flex-row gap-4 z-10">
            <div className="relative flex-1 group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500 light:text-slate-400 font-bold text-xl">{">"}</span>
              <input 
                type="text" 
                placeholder="INV-8F4K2P91" 
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full bg-black/50 light:bg-slate-50 border border-cyan-900 light:border-slate-300 pl-12 pr-6 py-4 text-lg text-cyan-300 light:text-slate-900 placeholder-cyan-900/50 light:placeholder-slate-400 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] light:focus:shadow-md transition-all light:rounded-xl"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-cyan-950/50 light:bg-indigo-600 disabled:opacity-50 text-cyan-400 light:text-white font-bold text-sm py-4 px-8 border border-cyan-500/50 light:border-transparent hover:bg-cyan-900/50 light:hover:bg-indigo-700 hover:text-cyan-300 light:hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] light:hover:shadow-lg transition-all flex items-center justify-center gap-3 tracking-widest light:tracking-normal relative overflow-hidden submit-btn light:rounded-xl"
            >
              <span className="relative z-10">{loading ? "PROCESSING..." : "RUN_QUERY"}</span>
              <ArrowRight size={18} className="relative z-10" />
            </button>
          </form>
          {error && (
            <div className="text-red-500 font-bold mt-6 bg-red-950/30 light:bg-red-50 border-l-4 border-red-500 py-3 px-4 inline-block text-xs tracking-widest light:tracking-normal light:rounded-r-md">
              {error}
            </div>
          )}
          
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4 text-xs text-cyan-700 light:text-slate-500 font-bold tracking-widest light:tracking-normal z-10 relative">
            <span>// DEMO_PAYLOADS:</span>
            <button onClick={() => setInvoiceId("INV-8F4K2P91")} className="bg-black/50 light:bg-slate-100 text-cyan-500 light:text-slate-600 px-3 py-1.5 border border-cyan-900 light:border-slate-200 hover:border-cyan-400 light:hover:border-indigo-300 hover:text-cyan-300 light:hover:text-indigo-600 transition-colors light:rounded-md">INV-8F4K2P91</button>
            <button onClick={() => setInvoiceId("INV-Q8F3L2ZT")} className="bg-black/50 light:bg-slate-100 text-cyan-500 light:text-slate-600 px-3 py-1.5 border border-cyan-900 light:border-slate-200 hover:border-cyan-400 light:hover:border-indigo-300 hover:text-cyan-300 light:hover:text-indigo-600 transition-colors light:rounded-md">INV-Q8F3L2ZT</button>
          </div>
        </div>

        {/* Feature Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Module 1 */}
          <div className="bg-black/80 light:bg-white/90 backdrop-blur-md border border-cyan-500/50 light:border-slate-200 p-8 shadow-[0_0_20px_rgba(6,182,212,0.1)] light:shadow-sm hover:border-cyan-400 light:hover:border-indigo-300 light:hover:shadow-md transition-all flex flex-col group relative overflow-hidden light:rounded-2xl">
            <div className="absolute -right-6 -top-6 text-cyan-900/20 light:text-slate-50 transform rotate-12 group-hover:scale-110 transition-transform">
              <Lock size={100} strokeWidth={1} />
            </div>
            <div className="w-12 h-12 bg-cyan-950/50 light:bg-indigo-50 text-cyan-400 light:text-indigo-600 border border-cyan-500/50 light:border-indigo-100 flex items-center justify-center mb-6 relative z-10 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] light:group-hover:shadow-md transition-all light:rounded-lg">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-cyan-400 light:text-slate-900 tracking-widest light:tracking-tight relative z-10">Local_Auth</h3>
            <p className="text-cyan-600/80 light:text-slate-500 text-sm leading-relaxed mb-6 flex-1 relative z-10">Payload assembly handled locally. Zero external tracking algorithms active.</p>
            <div className="text-[10px] font-bold text-cyan-500 light:text-slate-400 flex items-center justify-between pt-4 border-t border-cyan-900 light:border-slate-100 tracking-widest light:tracking-normal relative z-10">
              Zero-Cloud <ShieldCheck size={14} />
            </div>
          </div>
          
          {/* Module 2 */}
          <div className="bg-black/80 light:bg-white/90 backdrop-blur-md border border-cyan-500/50 light:border-slate-200 p-8 shadow-[0_0_20px_rgba(6,182,212,0.1)] light:shadow-sm hover:border-cyan-400 light:hover:border-indigo-300 light:hover:shadow-md transition-all flex flex-col group relative overflow-hidden light:rounded-2xl">
            <div className="absolute -right-6 -top-6 text-cyan-900/20 light:text-slate-50 transform rotate-12 group-hover:scale-110 transition-transform">
              <ShieldCheck size={100} strokeWidth={1} />
            </div>
            <div className="w-12 h-12 bg-cyan-950/50 light:bg-indigo-50 text-cyan-400 light:text-indigo-600 border border-cyan-500/50 light:border-indigo-100 flex items-center justify-center mb-6 relative z-10 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] light:group-hover:shadow-md transition-all light:rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-cyan-400 light:text-slate-900 tracking-widest light:tracking-tight relative z-10">Sys_Verify</h3>
            <p className="text-cyan-600/80 light:text-slate-500 text-sm leading-relaxed mb-6 flex-1 relative z-10">Real-time audit confirms match with registered POS endpoints.</p>
            <div className="text-[10px] font-bold text-cyan-500 light:text-slate-400 flex items-center justify-between pt-4 border-t border-cyan-900 light:border-slate-100 tracking-widest light:tracking-normal relative z-10">
              NBR Compliant <ShieldCheck size={14} />
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-black/80 light:bg-white/90 backdrop-blur-md border border-cyan-500/50 light:border-slate-200 p-8 shadow-[0_0_20px_rgba(6,182,212,0.1)] light:shadow-sm hover:border-cyan-400 light:hover:border-indigo-300 light:hover:shadow-md transition-all flex flex-col group relative overflow-hidden light:rounded-2xl">
            <div className="absolute -right-6 -top-6 text-cyan-900/20 light:text-slate-50 transform rotate-12 group-hover:scale-110 transition-transform">
              <Printer size={100} strokeWidth={1} />
            </div>
            <div className="w-12 h-12 bg-cyan-950/50 light:bg-indigo-50 text-cyan-400 light:text-indigo-600 border border-cyan-500/50 light:border-indigo-100 flex items-center justify-center mb-6 relative z-10 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] light:group-hover:shadow-md transition-all light:rounded-lg">
              <Printer size={20} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-cyan-400 light:text-slate-900 tracking-widest light:tracking-tight relative z-10">Print_Protocol</h3>
            <p className="text-cyan-600/80 light:text-slate-500 text-sm leading-relaxed mb-6 flex-1 relative z-10">Retrieve 80mm thermal outputs or full A4 digital documents instantly.</p>
            <div className="text-[10px] font-bold text-cyan-500 light:text-slate-400 flex items-center justify-between pt-4 border-t border-cyan-900 light:border-slate-100 tracking-widest light:tracking-normal relative z-10">
              Format_Ready <Printer size={14} />
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-auto relative z-10 bg-black/80 light:bg-slate-50 backdrop-blur-md border-t border-cyan-500/50 light:border-slate-200 py-6 text-center text-cyan-700 light:text-slate-500 text-[10px] tracking-widest light:tracking-normal font-bold light:font-medium">
        <div className="max-w-5xl mx-auto px-4">
          [SYS.END] © {new Date().getFullYear()}. Engine by <a href={devUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 light:text-indigo-500 hover:text-cyan-300 light:hover:text-indigo-700 hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] light:hover:shadow-none transition-all">{devName}</a>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, LayoutDashboard,  Briefcase,  LogOut, Settings, Warehouse , ShoppingBasketIcon, Terminal} from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "[SYS.HOME]", href: "/", icon: <Home size={18} /> },
    { name: "[SYS.DASHBOARD]", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "[SYS.INVOICES]", href: "/admin/invoices", icon: <Briefcase size={18} /> },
    { name: "[SYS.PRODUCTS]", href: "/admin/products", icon: <ShoppingBasketIcon size={18} /> },
    { name: "[SYS.STORE]", href: "/admin/store", icon: <Warehouse size={18} /> },
    { name: "[SYS.SETTINGS]", href: "/admin/settings", icon: <Settings size={18} /> },
  ];

  if (pathname === "/admin/login") return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-black light:bg-white border border-cyan-500/50 light:border-slate-300 text-cyan-400 light:text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.3)] light:shadow-md focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-black/90 light:bg-white backdrop-blur-md border-r border-cyan-500/50 light:border-slate-200 shadow-[4px_0_30px_rgba(6,182,212,0.1)] transition-transform duration-300 ease-in-out flex flex-col font-mono light:font-sans ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <Terminal className="text-cyan-400 light:text-slate-900" size={28} />
          <div>
            <h2 className="text-xl font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal leading-none">SYS_ADMIN</h2>
            <span className="text-[10px] text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mt-1 animate-pulse">NODE_ACTIVE</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors border ${
                  isActive
                    ? "bg-cyan-950/50 light:bg-indigo-50 text-cyan-300 light:text-indigo-700 border-cyan-500/50 light:border-indigo-200 shadow-[0_0_15px_rgba(6,182,212,0.2)] light:shadow-sm"
                    : "text-cyan-600 light:text-slate-500 border-transparent hover:bg-black/50 light:hover:bg-slate-50 hover:text-cyan-400 light:hover:text-indigo-600 hover:border-cyan-900 light:hover:border-slate-200"
                }`}
              >
                {link.icon}
                <span className="font-bold text-xs tracking-widest light:tracking-normal">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyan-500/30 light:border-slate-300">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-950/30 light:hover:bg-red-50 border border-transparent hover:border-red-500/50 light:hover:border-red-200 transition-colors font-bold text-xs tracking-widest light:tracking-normal group"
            >
              <LogOut size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] light:group-hover:drop-shadow-none" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 light:bg-white backdrop-blur-[2px] z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

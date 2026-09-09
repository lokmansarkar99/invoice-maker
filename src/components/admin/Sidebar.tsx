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
          className="p-2 rounded-lg bg-black border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-black/90 backdrop-blur-md border-r border-cyan-500/50 shadow-[4px_0_30px_rgba(6,182,212,0.1)] transition-transform duration-300 ease-in-out flex flex-col font-mono ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <Terminal className="text-cyan-400" size={28} />
          <div>
            <h2 className="text-xl font-bold text-cyan-400 tracking-widest leading-none">SYS_ADMIN</h2>
            <span className="text-[10px] text-cyan-600 tracking-widest block mt-1 animate-pulse">NODE_ACTIVE</span>
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
                    ? "bg-cyan-950/50 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "text-cyan-600 border-transparent hover:bg-black/50 hover:text-cyan-400 hover:border-cyan-900"
                }`}
              >
                {link.icon}
                <span className="font-bold text-xs tracking-widest">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyan-500/30">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-950/30 border border-transparent hover:border-red-500/50 transition-colors font-bold text-xs tracking-widest group"
            >
              <LogOut size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

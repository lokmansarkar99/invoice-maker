"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, LayoutDashboard,  Briefcase,  LogOut, Settings, Warehouse , ShoppingBasketIcon} from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Invoices", href: "/admin/invoices", icon: <Briefcase size={18} /> },
    { name: "Products", href: "/admin/products", icon: <ShoppingBasketIcon size={18} /> },
    { name: "Store", href: "/admin/store", icon: <Warehouse size={18} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  ];

  if (pathname === "/admin/login") return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border border-transparent ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-blue-100 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.icon}
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

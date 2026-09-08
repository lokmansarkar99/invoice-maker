"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit2, Trash2 } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInvoices = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const json = await res.json();
      if (json.success) setInvoices(json.data);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInvoices(search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (confirm("Delete Invoice? The invoice will be removed and its product quantities will be returned to stock.")) {
      try {
        const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (json.success) {
          fetchInvoices(search);
        } else {
          alert(json.message || "Failed to delete");
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <Link 
          href="/admin/invoices/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus size={20} />
          <span>Create Invoice</span>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search Invoice ID, Customer Name, or Phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-gray-600 font-medium">Invoice ID</th>
                <th className="py-3 px-4 text-gray-600 font-medium">Customer</th>
                <th className="py-3 px-4 text-gray-600 font-medium">Total</th>
                <th className="py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="py-3 px-4 text-gray-600 font-medium">Date</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-blue-600">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      <div>{invoice.customer.name}</div>
                      <div className="text-xs text-gray-500">{invoice.customer.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">৳{invoice.grandTotal.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        invoice.status === 'DUE' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/invoices/${invoice._id}`}
                          className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          href={`/admin/invoices/${invoice._id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

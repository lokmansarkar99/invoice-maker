"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit2, Trash2, Terminal } from "lucide-react";

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
    if (confirm("EXECUTE PURGE? Record will be deleted and stock reallocated.")) {
      try {
        const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (json.success) {
          fetchInvoices(search);
        } else {
          alert(json.message || "Failed to delete invoice");
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-cyan-400 tracking-widest inline-flex items-center gap-2">
            <Terminal size={24} />
            SYS_INVOICES
          </h1>
          <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1 inline-block"></span>
        </div>
        <Link 
          href="/admin/invoices/create"
          className="bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-400 font-bold py-2 px-4 border border-cyan-500/50 hover:border-cyan-400 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] tracking-widest text-sm"
        >
          <Plus size={18} />
          <span>Create Invoice</span>
        </Link>
      </div>

      <div className="bg-black/80 backdrop-blur-md p-6 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
        <div className="relative mb-6 group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">{">"}</span>
          <input 
            type="text" 
            placeholder="QUERY_INVOICE_DB..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-cyan-900 text-cyan-300 rounded-none pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyan-900 bg-cyan-950/30">
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">ID_Payload</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">Client_Entity</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">Total</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">State</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">Timestamp</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-cyan-700 animate-pulse tracking-widest text-xs font-bold">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500 tracking-widest text-xs font-bold">
                    NULL_RESULT: No records found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b border-cyan-900/50 hover:bg-cyan-950/30 transition-colors group">
                    <td className="py-3 px-4 font-bold text-cyan-400 tracking-wider">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-4 text-cyan-300 font-medium">
                      <div className="">{invoice.customer.name}</div>
                      <div className="text-[10px] text-cyan-600 tracking-widest">{invoice.customer.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-medium">৳{invoice.grandTotal.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-widest border ${
                        invoice.status === 'PAID' ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' :
                        invoice.status === 'DUE' ? 'bg-yellow-950/50 text-yellow-500 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                        'bg-red-950/50 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      }`}>
                        [{invoice.status}]
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-600 text-xs font-bold tracking-widest">
                      {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/invoices/${invoice._id}`}
                          className="p-2 text-cyan-600 hover:text-cyan-300 hover:bg-cyan-950/80 border border-transparent hover:border-cyan-500/50 transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link 
                          href={`/admin/invoices/${invoice._id}/edit`}
                          className="p-2 text-cyan-600 hover:text-cyan-300 hover:bg-cyan-950/80 border border-transparent hover:border-cyan-500/50 transition-colors"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 text-red-700 hover:text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-500/50 transition-colors"
                        >
                          <Trash2 size={16} />
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

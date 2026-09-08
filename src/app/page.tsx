"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [invoiceId, setInvoiceId] = useState("");
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
        setError("Invoice not found. Please check your Invoice ID and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-xl w-full text-center mb-12">
        {store?.storeImageUrl ? (
          <img src={store.storeImageUrl} alt="Store Logo" className="w-32 h-32 mx-auto object-contain mb-6 drop-shadow-md" />
        ) : (
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full mb-6 flex items-center justify-center border border-gray-200">
            <span className="text-4xl text-gray-400">Logo</span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">{store?.storeName || "Store Name"}</h1>
        <p className="text-gray-600 text-lg">Download or print your invoice online.</p>
      </div>

      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Invoice</h2>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Invoice ID</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="e.g. INV-8F4K2P91" 
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-lg text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all uppercase"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-md transition-all text-lg"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      
      <div className="mt-16 text-gray-500 text-sm">
        <Link href="/admin/login" className="hover:text-blue-600 transition-colors font-medium">Admin Portal</Link>
      </div>
    </div>
  );
}

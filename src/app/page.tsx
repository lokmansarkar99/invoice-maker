"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Lock, Printer, ArrowRight, Menu, MapPin, Phone, Mail, User, ReceiptText } from "lucide-react";
import Link from "next/link";

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
        setError("Invoice not found. Please check your Invoice ID and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col selection:bg-blue-100">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md flex items-center justify-center">
              <ReceiptText size={24} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">QuickInvoice</span>
              <span className="hidden sm:flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100 ml-2">
                Point of Sale
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Billing Portal</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Verify Receipt</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Store Support</a>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Support Desk</div>
              <div className="font-semibold text-gray-900">{supportPhone}</div>
            </div>
            <Link href="/admin/login" className="bg-white text-gray-900 font-semibold py-2.5 px-6 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-4 focus:ring-gray-100">
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 mt-12 flex-1 w-full flex flex-col mb-16">
        
        {/* Store Information Card */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center mb-12 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto text-center md:text-left">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              {store?.storeImageUrl ? (
                <img src={store.storeImageUrl} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <ReceiptText className="text-gray-300" size={32} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 justify-center md:justify-start">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{store?.storeName || "Loading Store..."}</h2>
                <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100 flex items-center gap-1 w-fit mx-auto md:mx-0">
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{store?.address || "Loading Address..."}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{store?.phone || "Loading Phone..."}</span>
                </div>
                {store?.email && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{store.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <User size={16} className="text-gray-400" />
                  <span>{store?.proprietorName || "Loading Proprietor..."}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 bg-gray-50 border border-gray-100 p-5 rounded-xl text-center w-full md:w-auto self-stretch flex flex-col justify-center">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tax Identification / BIN</div>
            <div className="font-bold text-lg text-gray-900">{binNumber}</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white border border-gray-200 p-10 md:p-14 rounded-3xl text-center shadow-lg shadow-blue-900/5 mb-16 relative overflow-hidden">
          {/* Subtle background gradient blob */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          {/* <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 relative z-10 border border-blue-100">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Public Self-Service Terminal
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900 relative z-10">Search Your Invoice & Receipts</h1>
          {/* <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 relative z-10">
            Enter your unique Invoice ID printed on your billing voucher to securely view or download your official A4 PDF receipt.
          </p> */}
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex flex-col md:flex-row gap-3 z-10">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input 
                type="text" 
                placeholder="e.g. INV-8F4K2P91" 
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl pl-14 pr-6 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all uppercase shadow-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 disabled:bg-blue-400 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-blue-200"
            >
              {loading ? "Searching..." : "Search Invoice"} <ArrowRight size={20} />
            </button>
          </form>
          {error && <div className="text-red-600 font-medium mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block text-sm border border-red-100">{error}</div>}
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm text-gray-500 z-10 relative">
            <span>Try a demo ID:</span>
            <button onClick={() => setInvoiceId("INV-8F4K2P91")} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium">INV-8F4K2P91</button>
            <button onClick={() => setInvoiceId("INV-Q8F3L2ZT")} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium">INV-Q8F3L2ZT</button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Client-Side Private</h3>
            <p className="text-gray-500 leading-relaxed mb-6 flex-1">Every document is assembled locally on your device. Zero tracking, ensuring your purchase data remains fully private.</p>
            <div className="text-sm font-semibold text-blue-600 flex items-center justify-between pt-4 border-t border-gray-100">
              Zero-Cloud Storage <ShieldCheck size={18} />
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Store Verification</h3>
            <p className="text-gray-500 leading-relaxed mb-6 flex-1">Real-time audit verification matches digital invoices with registered fiscal Point-of-Sale cash-registers.</p>
            <div className="text-sm font-semibold text-green-600 flex items-center justify-between pt-4 border-t border-gray-100">
              NBR Compliant <ShieldCheck size={18} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Printer size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Re-print</h3>
            <p className="text-gray-500 leading-relaxed mb-6 flex-1">Retrieve clear 80mm POS slips or full-page enterprise receipts ready for insurance and accounting declarations.</p>
            <div className="text-sm font-semibold text-purple-600 flex items-center justify-between pt-4 border-t border-gray-100">
              Universal Format <Printer size={18} />
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
        <div className="max-w-5xl mx-auto px-4">
          © {new Date().getFullYear()}. System Developed by <a href={devUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">{devName}</a>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Printer,
  Download,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Mail,
  User,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoiceView({
  invoiceId,
  isAdmin = false,
}: {
  invoiceId: string;
  isAdmin?: boolean;
}) {
  const [invoice, setInvoice] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, storeRes] = await Promise.all([
          fetch(`/api/invoices/${invoiceId}`),
          fetch(`/api/store`),
        ]);
        const invJson = await invRes.json();
        const storeJson = await storeRes.json();

        if (invJson.success) {
          setInvoice(invJson.data);
        } else {
          setError(invJson.message || "Invoice not found");
        }

        if (storeJson.success) {
          setStore(storeJson.data);
        }
      } catch (err) {
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Delete Invoice? This action cannot be undone and will restore stock.",
      )
    ) {
      try {
        const res = await fetch(`/api/invoices/${invoice._id}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          router.push("/admin/invoices");
        } else {
          alert("Failed to delete invoice");
        }
      } catch (err) {
        alert("An error occurred");
      }
    }
  };

  if (loading) return <div className="p-8 text-cyan-400 light:text-slate-900 font-bold tracking-widest light:tracking-normal animate-pulse">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold tracking-widest light:tracking-normal">{error}</div>;
  if (!invoice) return <div className="p-8 text-cyan-400 light:text-slate-900 font-bold tracking-widest light:tracking-normal">Invoice not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 font-mono light:font-sans">
      {/* Actions (Hidden on Print) */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8 print:hidden border-b border-cyan-500/30 light:border-slate-300 pb-4">
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="bg-cyan-950/50 light:bg-slate-200 hover:bg-cyan-900/50 light:hover:bg-indigo-50 text-cyan-400 light:text-slate-900 font-bold py-2 px-4 border border-cyan-500/50 light:border-slate-300 hover:border-cyan-400 light:hover:border-indigo-400 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] light:shadow-md tracking-widest light:tracking-normal text-xs"
          >
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-cyan-950/50 light:bg-slate-200 hover:bg-cyan-900/50 light:hover:bg-indigo-50 text-cyan-400 light:text-slate-900 font-bold py-2 px-4 border border-cyan-500/50 light:border-slate-300 hover:border-cyan-400 light:hover:border-indigo-400 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] light:shadow-md tracking-widest light:tracking-normal text-xs"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>

        {isAdmin && (
          <div className="flex gap-4">
            <Link
              href={`/admin/invoices/${invoice._id}/edit`}
              className="bg-cyan-950/30 light:bg-white text-cyan-600 light:text-slate-700 hover:text-cyan-400 light:hover:text-indigo-600 hover:bg-cyan-950/80 font-bold py-2 px-4 border border-transparent hover:border-cyan-500/50 flex items-center gap-2 transition-colors tracking-widest light:tracking-normal text-xs"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-950/30 light:bg-red-50 text-red-700 hover:text-red-400 hover:bg-red-950/50 font-bold py-2 px-4 border border-transparent hover:border-red-500/50 flex items-center gap-2 transition-colors tracking-widest light:tracking-normal text-xs"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* A4 Print Container */}
      <div className="bg-black/80 light:bg-white text-cyan-300 light:text-slate-900 p-8 md:p-12 border border-cyan-500/50 light:border-slate-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">
        {/* Terminal decorative header for screen only */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-cyan-950/50 light:bg-slate-200 border-b border-cyan-500/50 light:border-slate-300 flex items-center px-4 print:hidden">
          <Terminal size={12} className="text-cyan-500 light:text-slate-700 mr-2" />
          <span className="text-[10px] text-cyan-500 light:text-slate-700 font-bold tracking-widest light:tracking-normal">SYS.PRINTER.SPOOL Invoice ID: {invoice.invoiceNumber}</span>
        </div>
        <div className="mt-4 print:mt-0"></div>

        {/* Print-only browser-like header */}
        <div className="hidden print:flex justify-between text-[10px] text-gray-500 mb-8 font-sans">
          <div>
            {new Date().toLocaleDateString("en-US")}{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME || "SYS_NODE"}
          </div>
          <div className="w-[100px]"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-4 items-center max-w-[60%]">
            {store?.storeImageUrl && (
              <img
                src={store.storeImageUrl}
                alt="Store Logo"
                className="w-28 h-28 object-contain mix-blend-screen print:mix-blend-normal opacity-90 print:opacity-100 filter print:filter-none drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            )}
            <div className="break-words">
              <h1 className="text-xl font-bold text-cyan-400 light:text-slate-900 print:text-black tracking-widest light:tracking-normal leading-tight mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] print:drop-shadow-none">
                {store?.storeName || "SYS_NODE_01"}
              </h1>
              {store?.proprietorName && (
                <p className="text-cyan-600 light:text-slate-700 print:text-gray-600 font-bold text-xs tracking-widest light:tracking-normal flex items-center gap-2">
                  <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
                  <User size={12} className="hidden print:block text-gray-500" />
                  {store.proprietorName}
                </p>
              )}
              {store?.address && (
                <p className="text-cyan-600 light:text-slate-700 print:text-gray-500 font-bold text-xs tracking-widest light:tracking-normal flex items-center gap-2 mt-1">
                  <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
                  <MapPin size={12} className="hidden print:block text-gray-500" />
                  {store.address}
                </p>
              )}
              {store?.phone && (
                <p className="text-cyan-600 light:text-slate-700 print:text-gray-500 font-bold text-xs tracking-widest light:tracking-normal flex items-center gap-2 mt-1">
                  <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
                  <Phone size={12} className="hidden print:block text-gray-500" />
                  {store.phone}
                </p>
              )}
              {store?.email && (
                <p className="text-cyan-600 light:text-slate-700 print:text-gray-500 font-bold text-xs tracking-widest light:tracking-normal flex items-center gap-2 mt-1">
                  <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
                  <Mail size={12} className="hidden print:block text-gray-500" />
                  {store.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-4xl sm:text-5xl font-black text-cyan-900/50 print:text-gray-300 tracking-widest light:tracking-normal mb-2 pr-1 border-b border-cyan-900 light:border-slate-300 print:border-none pb-2">
              INVOICE
            </h2>
            <div className="flex flex-col items-start gap-1 mt-2">
              <p className="text-xs text-cyan-400 light:text-slate-900 print:text-gray-600 font-bold tracking-widest light:tracking-normal whitespace-nowrap">
                <span className="text-cyan-700 light:text-slate-600 print:text-gray-400 mr-2">Invoice ID:</span> {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-cyan-400 light:text-slate-900 print:text-gray-600 font-bold tracking-widest light:tracking-normal whitespace-nowrap">
                <span className="text-cyan-700 light:text-slate-600 print:text-gray-400 mr-2">Date:</span>{" "}
                {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {isAdmin && (
                <p className="text-xs text-cyan-400 light:text-slate-900 print:text-gray-600 font-bold tracking-widest light:tracking-normal whitespace-nowrap">
                  <span className="text-cyan-700 light:text-slate-600 print:text-gray-400 mr-2">Status:</span>{" "}
                  <span className="text-cyan-300 light:text-slate-900 print:text-black">{invoice.status}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t border-cyan-900 light:border-slate-300 print:border-gray-300 mb-8" />

        {/* Customer Details */}
        <div className="mb-10 p-4 border border-cyan-900/50 bg-cyan-950/20 print:border-none print:bg-transparent print:p-0">
          <h3 className="text-[10px] font-bold text-cyan-600 light:text-slate-700 print:text-gray-400 tracking-widest light:tracking-normal mb-3">
            Billed To
          </h3>
          <p className="text-sm font-bold text-cyan-300 light:text-slate-900 print:text-gray-800 tracking-widest light:tracking-normal flex items-center gap-2">
            <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
            <User size={14} className="hidden print:block text-gray-400" />
            {invoice.customer.name}
          </p>
          {invoice.customer.address && (
            <p className="text-cyan-600 light:text-slate-700 print:text-gray-600 mt-2 text-xs font-bold tracking-widest light:tracking-normal flex items-center gap-2">
              <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
              <MapPin size={12} className="hidden print:block text-gray-400" />
              {invoice.customer.address}
            </p>
          )}
          {invoice.customer.phone && (
            <p className="text-cyan-600 light:text-slate-700 print:text-gray-600 mt-2 text-xs font-bold tracking-widest light:tracking-normal flex items-center gap-2">
              <span className="text-cyan-700 light:text-slate-600 print:hidden">{">"}</span>
              <Phone size={12} className="hidden print:block text-gray-400" />
              {invoice.customer.phone}
            </p>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full mb-10 text-left border-collapse border border-cyan-900 light:border-slate-300 print:border-none">
          <thead>
            <tr
              className="bg-cyan-950/50 light:bg-slate-200 text-cyan-500 light:text-slate-700 border-b border-cyan-900 light:border-slate-300 print:bg-[#1e293b] print:text-white"
              style={{
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              <th className="py-3 px-4 text-[10px] font-bold tracking-widest light:tracking-normal">
                Payload_ID
              </th>
              <th className="py-3 px-4 text-[10px] font-bold tracking-widest light:tracking-normal text-center">
                Mult
              </th>
              <th className="py-3 px-4 text-[10px] font-bold tracking-widest light:tracking-normal text-right">
                Base
              </th>
              <th className="py-3 px-4 text-[10px] font-bold tracking-widest light:tracking-normal text-right">
                Agg
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, i: number) => (
              <tr
                key={i}
                className={`border-b border-cyan-900/30 print:border-none ${
                  i % 2 === 0 ? "bg-black/40 print:bg-gray-50" : "bg-black/20 print:bg-white"
                }`}
                style={
                  i % 2 === 0
                    ? {
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }
                    : {}
                }
              >
                <td className="py-4 px-4 text-cyan-300 light:text-slate-900 print:text-gray-800 font-bold text-xs tracking-wider light:tracking-normal">
                  {item.name}
                </td>
                <td className="py-4 px-4 text-cyan-400 light:text-slate-900 print:text-gray-800 text-center font-bold text-xs">
                  {item.quantity}
                </td>
                <td className="py-4 px-4 text-cyan-400 light:text-slate-900 print:text-gray-800 text-right font-bold text-xs">
                  ৳{item.unitPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-cyan-400 light:text-slate-900 print:text-gray-800 text-right font-bold text-xs">
                  ৳{item.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-16">
          <div className="w-full max-w-xs p-4 border border-cyan-900/50 print:border-none print:p-0">
            <div className="flex justify-between py-2 text-xs text-cyan-600 light:text-slate-700 print:text-gray-600 font-bold tracking-widest light:tracking-normal">
              <span className="">Subtotal</span>
              <span>
                ৳{invoice.subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 text-xs text-cyan-600 light:text-slate-700 print:text-gray-600 font-bold tracking-widest light:tracking-normal border-t border-cyan-900/30 print:border-gray-100">
                <span className="">Discount</span>
                <span className="text-red-500">
                  -৳{invoice.discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-cyan-500 print:border-gray-800 mt-2">
              <span className="text-sm font-black text-cyan-400 light:text-slate-900 print:text-gray-900 tracking-widest light:tracking-normal drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] print:drop-shadow-none">
                FINAL_OUTPUT
              </span>
              <span className="text-sm font-black text-cyan-400 light:text-slate-900 print:text-gray-900 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] print:drop-shadow-none">
                ৳{invoice.grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-16 flex flex-col text-[10px] text-cyan-700 light:text-slate-600 print:text-gray-400 border-t border-cyan-900 light:border-slate-300 print:border-gray-200 w-full font-bold">
          <div className="hidden print:block font-sans">
            {typeof window !== "undefined" ? window.location.href : ""}
          </div>
          <div className="tracking-widest light:tracking-normal mb-1 flex items-center justify-between">
            <span>
              {process.env.NEXT_PUBLIC_FOOTER_TEXT ||
                "Thank you for your business!"}
            </span>
            <span className="text-cyan-900 light:text-slate-300 print:hidden"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!invoice) return <div className="p-8 text-white">Invoice not found.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Actions (Hidden on Print) */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8 print:hidden">
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Printer size={20} />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={handlePrint} // Same as print, user chooses "Save as PDF"
            className="bg-teal-500 hover:bg-teal-600 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Download size={20} />
            <span>Download PDF</span>
          </button>
        </div>

        {isAdmin && (
          <div className="flex gap-4">
            <Link
              href={`/admin/invoices/${invoice._id}/edit`}
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border border-blue-500/20"
            >
              <Edit2 size={18} />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border border-red-500/20"
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* A4 Print Container */}
      <div className="bg-white text-black p-8 md:p-12 shadow-2xl rounded-sm print:shadow-none print:p-0 relative">
        {/* Print-only browser-like header */}
        <div className="hidden print:flex justify-between text-[10px] text-gray-500 mb-8">
          <div>
            {new Date().toLocaleDateString("en-US")}{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME || "Invoice Maker"}
          </div>
          <div className="w-[100px]"></div>{" "}
          {/* Spacer to keep center balanced */}
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-4 items-center max-w-[60%]">
            {store?.storeImageUrl && (
              <img
                src={store.storeImageUrl}
                alt="Store Logo"
                className="w-28 h-28 object-contain"
              />
            )}
            <div className="break-words  ">
              <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide leading-tight mb-1">
                {store?.storeName || "Store Name"}
              </h1>
              {store?.proprietorName && (
                <p className="text-gray-600  font-medium flex items-center gap-2">
                  <User size={14} className="text-gray-500" />
                  {store.proprietorName}
                </p>
              )}
              {store?.address && (
                <p className="text-gray-500 text-sm  flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  {store.address}
                </p>
              )}
              {store?.phone && (
                <p className="text-gray-500 text-sm  flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  {store.phone}
                </p>
              )}
              {store?.email && (
                <p className="text-gray-500 text-sm  flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  {store.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-5xl font-black text-gray-300 uppercase tracking-widest mb-2 pr-1">
              INVOICE
            </h2>
            <div className="flex flex-col items-start gap-0">
              <p className="text-md text-gray-600 font-medium whitespace-nowrap">
                <span className="text-gray-400">ID:</span> {invoice.invoiceNumber}
              </p>
              <p className="text-md text-gray-600 font-medium whitespace-nowrap">
                <span className="text-gray-400">Date:</span>{" "}
                {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {isAdmin && (
                <p className="text-md text-gray-600 font-medium whitespace-nowrap">
                  <span className="text-gray-400">Status:</span>{" "}
                  <span className="font-bold">{invoice.status}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-8" />

        {/* Customer Details */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Billed To
          </h3>
          <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            {invoice.customer.name}
          </p>
          {invoice.customer.address && (
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              {invoice.customer.address}
            </p>
          )}
          {invoice.customer.phone && (
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              {invoice.customer.phone}
            </p>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full mb-10 text-left border-collapse">
          <thead>
            <tr
              className="bg-[#1e293b] text-white print:bg-[#1e293b] print:text-white"
              style={{
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-tl-sm">
                Product
              </th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-center">
                Qty
              </th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right">
                Price
              </th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right rounded-tr-sm">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, i: number) => (
              <tr
                key={i}
                className={
                  i % 2 === 0 ? "bg-gray-50 print:bg-gray-50" : "bg-white"
                }
                style={
                  i % 2 === 0
                    ? {
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }
                    : {}
                }
              >
                <td className="py-4 px-4 text-gray-800 font-medium text-sm">
                  {item.name}
                </td>
                <td className="py-4 px-4 text-gray-800 text-center text-sm">
                  {item.quantity}
                </td>
                <td className="py-4 px-4 text-gray-800 text-right text-sm">
                  ৳
                  {item.unitPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-4 text-gray-800 text-right font-medium text-sm">
                  ৳
                  {item.total.toLocaleString(undefined, {
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
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-2 text-sm text-gray-600 font-bold">
              <span className="uppercase">Subtotal</span>
              <span>
                ৳
                {invoice.subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 text-sm text-gray-600 font-bold border-t border-gray-100">
                <span className="uppercase">Discount</span>
                <span className="text-red-500">
                  -৳
                  {invoice.discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-gray-800 mt-2">
              <span className="text-lg font-black text-gray-900 uppercase">
                Total
              </span>
              <span className="text-lg font-black text-gray-900">
                ৳
                {invoice.grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 mt-16 flex flex-col text-[10px] text-gray-400 border-t border-gray-200 w-full">
          <div className="hidden print:block">
            {typeof window !== "undefined" ? window.location.href : ""}
          </div>
          <div className="uppercase tracking-widest mb-1">
            {process.env.NEXT_PUBLIC_FOOTER_TEXT ||
              "Thank you for your business!"}
          </div>
        </div>
      </div>
    </div>
  );
}

import InvoiceView from "@/components/invoice/InvoiceView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PublicInvoicePage({ params }: { params: Promise<{ invoiceNumber: string }> }) {
  const { invoiceNumber } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 text-black py-8 px-4 print:py-0 print:px-0 print:bg-white">
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Search
        </Link>
      </div>
      <InvoiceView invoiceId={invoiceNumber} isAdmin={false} />
    </div>
  );
}

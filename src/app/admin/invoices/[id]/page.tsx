import InvoiceView from "@/components/invoice/InvoiceView";

export default async function AdminInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvoiceView invoiceId={id} isAdmin={true} />;
}

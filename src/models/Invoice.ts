import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  customer: {
    name: string;
    address?: string;
    phone?: string;
  };
  items: IInvoiceItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  status: "PAID" | "DUE" | "PARTIAL DUE" | "CANCELLED";
  dueDate?: Date;
  advanceAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
}, { _id: false });

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  customer: {
    name: { type: String, required: true, index: true },
    address: { type: String },
    phone: { type: String, index: true },
  },
  items: [InvoiceItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  grandTotal: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["PAID", "DUE", "PARTIAL DUE", "CANCELLED"], default: "PAID" },
  dueDate: { type: Date },
  advanceAmount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

delete mongoose.models.Invoice;
export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

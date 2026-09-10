import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import { z } from "zod";

const invoiceItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});

const invoiceSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
  items: z.array(invoiceItemSchema).min(1),
  discount: z.number().min(0).default(0),
  status: z.enum(["PAID", "DUE", "PARTIAL DUE", "CANCELLED"]).default("PAID"),
  dueDate: z.string().optional().nullable(),
  advanceAmount: z.number().min(0).default(0).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    // We can search by _id or invoiceNumber (for public)
    const invoice = await Invoice.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { invoiceNumber: id }],
    });

    if (!invoice) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = await params;
    await connectToDatabase();

    const invoice = await Invoice.findById(id).session(session);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Return items to stock
    for (const item of invoice.items) {
      const product = await Product.findById(item.productId).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    await Invoice.findByIdAndDelete(id).session(session);
    await session.commitTransaction();

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    await session.abortTransaction();
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  } finally {
    session.endSession();
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = invoiceSchema.parse(body);

    await connectToDatabase();

    const invoice = await Invoice.findById(id).session(session);
    if (!invoice) throw new Error("Invoice not found");

    // 1. Revert original stock
    for (const item of invoice.items) {
      const product = await Product.findById(item.productId).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    // 2. Deduct new stock and recalculate totals
    let subtotal = 0;
    const finalItems = [];

    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`Product ${item.name} not found`);

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });

      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      finalItems.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal,
      });
    }

    let grandTotal = subtotal - validatedData.discount;
    if (grandTotal < 0) grandTotal = 0;

    invoice.customer = validatedData.customer;
    invoice.items = finalItems;
    invoice.subtotal = subtotal;
    invoice.discount = validatedData.discount;
    invoice.grandTotal = grandTotal;
    invoice.status = validatedData.status;
    invoice.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : undefined;
    invoice.advanceAmount = validatedData.advanceAmount || 0;

    await invoice.save({ session });
    await session.commitTransaction();

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    await session.abortTransaction();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 400 });
  } finally {
    session.endSession();
  }
}

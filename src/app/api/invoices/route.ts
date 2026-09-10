import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import { z } from "zod";
import crypto from "crypto";

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

// Generate a random unique ID (e.g. INV-8F4K2P91)
function generateInvoiceId() {
  return "INV-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    await connectToDatabase();

    let query: any = {};
    if (search) {
      query = {
        $or: [
          { invoiceNumber: { $regex: search, $options: "i" } },
          { "customer.name": { $regex: search, $options: "i" } },
          { "customer.phone": { $regex: search, $options: "i" } },
        ],
      };
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const validatedData = invoiceSchema.parse(body);

    await connectToDatabase();

    // 1. Calculate totals securely on the backend
    let subtotal = 0;
    const finalItems = [];

    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save({ session });

      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      finalItems.push({
        productId: item.productId,
        name: product.name, // Use actual DB name
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal,
      });
    }

    let grandTotal = subtotal - validatedData.discount;
    if (grandTotal < 0) grandTotal = 0;

    // Generate unique ID
    let isUnique = false;
    let invoiceNumber = "";
    while (!isUnique) {
      invoiceNumber = generateInvoiceId();
      const existing = await Invoice.findOne({ invoiceNumber }).session(session);
      if (!existing) isUnique = true;
    }

    const invoice = new Invoice({
      invoiceNumber,
      customer: validatedData.customer,
      items: finalItems,
      subtotal,
      discount: validatedData.discount,
      grandTotal,
      status: validatedData.status,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      advanceAmount: validatedData.advanceAmount || 0,
    });

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

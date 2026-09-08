import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  standardPrice: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    await connectToDatabase();
    
    const product = await Product.findByIdAndUpdate(id, validatedData, { new: true });
    if (!product) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

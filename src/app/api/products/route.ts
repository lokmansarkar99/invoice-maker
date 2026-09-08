import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  standardPrice: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    await connectToDatabase();
    
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    await connectToDatabase();
    
    const product = await Product.create(validatedData);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.issues }, { status: 400 });
    }
    console.error("POST Product Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

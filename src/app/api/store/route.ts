import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Store } from "@/models/Store";
import { z } from "zod";

const storeSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  proprietorName: z.string().min(1, "Proprietor name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  storeImageUrl: z.string().optional(),
});

export async function GET() {
  try {
    await connectToDatabase();
    // Assuming there's only one store for Version 1
    const store = await Store.findOne();
    return NextResponse.json({ success: true, data: store });
  } catch (error) {
    console.error("GET Store Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const validatedData = storeSchema.parse(body);

    await connectToDatabase();
    
    // Find first store, or create if it doesn't exist
    let store = await Store.findOne();
    if (store) {
      Object.assign(store, validatedData);
      await store.save();
    } else {
      store = await Store.create(validatedData);
    }

    return NextResponse.json({ success: true, data: store });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.issues }, { status: 400 });
    }
    console.error("PATCH Store Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

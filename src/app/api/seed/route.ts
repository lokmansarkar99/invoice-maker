import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "@/models/Admin";
import connectToDatabase from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    
    // You can customize the credentials below
    const email = "admin@example.com";
    const password = "adminpassword";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ message: `Admin user with email ${email} already exists!` });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      passwordHash,
    });

    await newAdmin.save();
    return NextResponse.json({ message: `Successfully created admin user: ${email} with password: ${password}` });
  } catch (error) {
    console.error("Error seeding admin:", error);
    return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
  }
}

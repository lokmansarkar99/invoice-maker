"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Admin } from "@/models/Admin";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await connectToDatabase();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return { error: "Invalid credentials" };
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (isValid) {
      const expires = new Date(Date.now() + 10 * 60 * 60 * 1000);
      const session = await encrypt({ user: "admin", email: admin.email, expires });

      (await cookies()).set("session", session, { 
        expires, 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production" 
      });
      return { success: true };
    } else {
      return { error: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Internal Server Error" };
  }
}

export async function logoutAction() {
  (await cookies()).set("session", "", { expires: new Date(0) });
  redirect("/admin/login");
}

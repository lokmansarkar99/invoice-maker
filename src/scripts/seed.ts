import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const MONGODB_URI = process.env.MONGODB_URI as string;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const email = process.env.ADMIN_EMAIL as string;
    const password = process.env.ADMIN_PASS as string;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists!`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      passwordHash,
    });

    await newAdmin.save();
    console.log(`Successfully created admin user: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();

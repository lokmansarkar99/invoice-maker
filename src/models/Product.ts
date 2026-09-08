import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  standardPrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  standardPrice: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

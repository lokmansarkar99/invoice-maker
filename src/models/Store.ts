import mongoose, { Schema, Document } from "mongoose";

export interface IStore extends Document {
  storeName: string;
  proprietorName: string;
  address: string;
  phone: string;
  storeImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema: Schema = new Schema({
  storeName: { type: String, required: true },
  proprietorName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  storeImageUrl: { type: String },
}, { timestamps: true });

export const Store = mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

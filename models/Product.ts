import mongoose, { Schema, model, models } from "mongoose";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  category: string;
  fabric?: string;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent?: number;
  source: "fabric" | "catalog";
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    fabric: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    isNew: { type: Boolean, default: false },
    rating: { type: Number },
    reviewCount: { type: Number },
    discountPercent: { type: Number },
    source: { type: String, enum: ["fabric", "catalog", "handmade"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProductSchema.index({ fabric: 1 });
ProductSchema.index({ isNew: 1 });
ProductSchema.index({ source: 1 });

export const Product = models.Product ?? model<IProduct>("Product", ProductSchema);

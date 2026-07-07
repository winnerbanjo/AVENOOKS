import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
  isBestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.MenuItem || model<IMenuItem>('MenuItem', MenuItemSchema);

import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  whatsappNumber: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryArea?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentReceiptUrl?: string;
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  category: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, default: '' },
    whatsappNumber: { type: String, required: true, trim: true },
    deliveryType: { type: String, enum: ['pickup', 'delivery'], required: true },
    deliveryAddress: { type: String, default: '' },
    deliveryArea: { type: String, default: '' },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentReceiptUrl: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>('Order', OrderSchema);

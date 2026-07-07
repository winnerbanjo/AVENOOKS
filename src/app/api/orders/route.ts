import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Simple header-based admin authentication check
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      whatsappNumber,
      deliveryType,
      deliveryAddress,
      deliveryArea,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentReceiptUrl,
    } = body;

    if (!customerName || !customerPhone || !whatsappNumber || !deliveryType || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOrder = await Order.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      whatsappNumber,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : '',
      deliveryArea: deliveryType === 'delivery' ? deliveryArea : '',
      items,
      subtotal,
      deliveryFee: deliveryType === 'delivery' ? (deliveryFee || 0) : 0,
      total,
      paymentStatus: paymentReceiptUrl ? 'paid' : 'pending', // If they uploaded a screenshot, we flag as paid or pending validation
      paymentReceiptUrl: paymentReceiptUrl || '',
      orderStatus: 'pending',
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

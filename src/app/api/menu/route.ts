import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await dbConnect();
    const items = await MenuItem.find({}).sort({ category: 1, name: 1 });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { name, price, category, description, imageUrl, isBestseller } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    const newItem = await MenuItem.create({
      name,
      price: Number(price),
      category,
      description: description || '',
      imageUrl: imageUrl || '',
      isBestseller: !!isBestseller,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

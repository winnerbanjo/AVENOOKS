import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/MenuItem';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { name, price, category, description, imageUrl, isBestseller, password } = body;

    // simple admin auth
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await MenuItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    if (name) item.name = name;
    if (price !== undefined) item.price = Number(price);
    if (category) item.category = category;
    if (description !== undefined) item.description = description;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (isBestseller !== undefined) item.isBestseller = isBestseller;

    await item.save();
    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}

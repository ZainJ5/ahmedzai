import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Category from '../../models/Category';
import path from 'path';
import fs from 'fs';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); 
    
    const query = type ? { type } : {};
    
    const categories = await Category.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const name = formData.get('name');
    const type = formData.get('type') || 'product'; 
    const thumbnailFile = formData.get('thumbnail');
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }
    
    if (type !== 'product' && type !== 'truck') {
      return NextResponse.json(
        { success: false, message: 'Category type must be either "product" or "truck"' },
        { status: 400 }
      );
    }
    
    let thumbnailPath = '/placeholder-category.png';
    
    if (thumbnailFile && thumbnailFile.size > 0) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(thumbnailFile.name);
      const filename = `${uniqueSuffix}${fileExtension}`;
      
      const publicPath = path.join(process.cwd(), 'public', 'categories');
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }
      
      const filePath = path.join(publicPath, filename);
      fs.writeFileSync(filePath, buffer);
      
      thumbnailPath = `/categories/${filename}`;
    }
    
    const category = await Category.create({
      name,
      type,
      thumbnail: thumbnailPath
    });
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
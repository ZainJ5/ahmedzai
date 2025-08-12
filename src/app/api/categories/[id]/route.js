import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Category from '../../../models/Category';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }
    
    const formData = await request.formData();
    const name = formData.get('name');
    const type = formData.get('type');
    const thumbnailFile = formData.get('thumbnail');
    
    const updateData = { updatedAt: Date.now() };
    if (name) updateData.name = name;
    
    if (type) {
      if (type !== 'product' && type !== 'truck') {
        return NextResponse.json(
          { success: false, message: 'Category type must be either "product" or "truck"' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (category.thumbnail && !category.thumbnail.includes('placeholder-category')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', category.thumbnail);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (deleteErr) {
          console.error('Error deleting old thumbnail:', deleteErr);
        }
      }
      
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
      
      updateData.thumbnail = `/categories/${filename}`;
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }
    
    if (category.thumbnail && !category.thumbnail.includes('placeholder-category')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', category.thumbnail);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (deleteErr) {
        console.error('Error deleting thumbnail file:', deleteErr);
      }
    }
    
    await Category.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
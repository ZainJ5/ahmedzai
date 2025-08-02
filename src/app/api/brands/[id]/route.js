import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Brand from '../../../models/Brand';
import { brandUpload, multerMiddleware } from '../../../lib/multerConfig';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch brand', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }
    
    const formData = await request.formData();
    const name = formData.get('name');
    const thumbnailFile = formData.get('thumbnail');
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Brand name is required' },
        { status: 400 }
      );
    }
    
    const updateData = { name, updatedAt: Date.now() };
    
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (existingBrand.thumbnail && !existingBrand.thumbnail.includes('placeholder')) {
        try {
          const oldFilePath = path.join(process.cwd(), 'public', existingBrand.thumbnail);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
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
      
      const publicPath = path.join(process.cwd(), 'public', 'brands');
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }
      
      const filePath = path.join(publicPath, filename);
      fs.writeFileSync(filePath, buffer);
      
      updateData.thumbnail = `/brands/${filename}`;
    }
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Brand updated successfully',
      data: updatedBrand
    });
    
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update brand', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }
    
    if (brand.thumbnail && !brand.thumbnail.includes('placeholder')) {
      try {
        const filePath = path.join(process.cwd(), 'public', brand.thumbnail);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (deleteErr) {
        console.error('Error deleting thumbnail file:', deleteErr);
      }
    }
    
    await Brand.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete brand', error: error.message },
      { status: 500 }
    );
  }
}
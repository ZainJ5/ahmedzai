import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import HeroSlide from '../../../models/HeroSlider';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const heroSlide = await HeroSlide.findById(id);
    
    if (!heroSlide) {
      return NextResponse.json(
        { success: false, message: 'Hero slide not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: heroSlide });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const heroSlide = await HeroSlide.findById(id);
    
    if (!heroSlide) {
      return NextResponse.json(
        { success: false, message: 'Hero slide not found' },
        { status: 404 }
      );
    }
    
    const formData = await request.formData();
    
    const updateData = {};
    
    if (formData.has('position')) {
      updateData.position = parseInt(formData.get('position'), 10);
    }
    
    const mediaFile = formData.get('media');
    if (mediaFile && mediaFile instanceof File) {
      if (!mediaFile.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, message: 'Only images are allowed' },
          { status: 400 }
        );
      }

      const oldFilePath = path.join(process.cwd(), 'public', heroSlide.mediaUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(mediaFile.name);
      const fileName = `hero-${uniqueSuffix}${fileExtension}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'hero');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
      
      updateData.mediaUrl = `/hero/${fileName}`;
    }
    
    const updatedHeroSlide = await HeroSlide.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedHeroSlide });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const heroSlide = await HeroSlide.findById(id);
    
    if (!heroSlide) {
      return NextResponse.json(
        { success: false, message: 'Hero slide not found' },
        { status: 404 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'public', heroSlide.mediaUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await HeroSlide.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Hero slide deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
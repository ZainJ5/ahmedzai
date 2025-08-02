import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import HeroSlide from '../../models/HeroSlider';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    await dbConnect();
    
    const heroSlides = await HeroSlide.find({}).sort({ position: 1 });
    
    return NextResponse.json({ success: true, data: heroSlides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const mediaFile = formData.get('media');
    const position = formData.get('position') || 0;
    
    if (!mediaFile) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Verify it's an image
    if (!mediaFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only images are allowed' },
        { status: 400 }
      );
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
    
    const mediaUrl = `/hero/${fileName}`;
    
    const heroSlide = await HeroSlide.create({
      mediaUrl,
      mediaType: 'image',
      position: parseInt(position, 10)
    });
    
    return NextResponse.json(
      { success: true, data: heroSlide },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
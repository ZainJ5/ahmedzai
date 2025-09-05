import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import HeroSlide from '../../models/HeroSlider';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function saveFile(file, folder = 'hero') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExtension = path.extname(file.name);
  const filename = `hero-${uniqueSuffix}${fileExtension}`;
  
  const key = `${folder}/${filename}`;
  
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  };
  
  await s3Client.send(new PutObjectCommand(params));
  
  return `${process.env.R2_PUBLIC_BASE_URL}${key}`;
}

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
    
    if (!mediaFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only images are allowed' },
        { status: 400 }
      );
    }
    
    const mediaUrl = await saveFile(mediaFile);
    
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
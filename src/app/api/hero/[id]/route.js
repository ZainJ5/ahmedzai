import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import HeroSlide from '../../../models/HeroSlider';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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

async function deleteFile(mediaUrl) {
  try {
    if (!mediaUrl) return;
    
    const key = mediaUrl.replace(process.env.R2_PUBLIC_BASE_URL, '');
    
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    };
    
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting file from R2:', error);
  }
}

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

      if (heroSlide.mediaUrl) {
        await deleteFile(heroSlide.mediaUrl);
      }
      
      updateData.mediaUrl = await saveFile(mediaFile);
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
    
    if (heroSlide.mediaUrl) {
      await deleteFile(heroSlide.mediaUrl);
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
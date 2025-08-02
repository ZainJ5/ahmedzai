import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Brand from '../../models/Brand';
import { brandUpload, multerMiddleware } from '../../lib/multerConfig';
import path from 'path';

const runMiddleware = (req, middleware) => {
  return new Promise((resolve, reject) => {
    middleware(req, {}, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch brands', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    const name = formData.get('name');
    const thumbnailFile = formData.get('thumbnail');
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Brand name is required' },
        { status: 400 }
      );
    }
    
    if (!thumbnailFile) {
      return NextResponse.json(
        { success: false, message: 'Brand logo is required' },
        { status: 400 }
      );
    }
    
    const bytes = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(thumbnailFile.name);
    const filename = `${uniqueSuffix}${fileExtension}`;
    
    const publicPath = path.join(process.cwd(), 'public', 'brands');
    const fs = require('fs');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    const filePath = path.join(publicPath, filename);
    fs.writeFileSync(filePath, buffer);
    
    const brand = await Brand.create({
      name,
      thumbnail: `/brands/${filename}`
    });
    
    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create brand', error: error.message },
      { status: 500 }
    );
  }
}
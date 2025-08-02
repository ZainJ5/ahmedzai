import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Blog from '../../models/Blogs';
import path from 'path';
import fs from 'fs';

async function saveFile(file, folder = 'blogs') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExtension = path.extname(file.name);
  const filename = `${uniqueSuffix}${fileExtension}`;
  
  const publicPath = path.join(process.cwd(), 'public', folder);
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  
  const filePath = path.join(publicPath, filename);
  fs.writeFileSync(filePath, buffer);
  
  return `/${folder}/${filename}`;
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 3;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const blogs = await Blog.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      content: formData.get('content'),
    };
    
    const requiredFields = ['title', 'description', 'content'];
    for (const field of requiredFields) {
      if (!blogData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    const thumbnailFile = formData.get('thumbnail');
    if (thumbnailFile) {
      const thumbnailPath = await saveFile(thumbnailFile);
      blogData.thumbnail = thumbnailPath;
    }
    
    const blog = await Blog.create(blogData);
    
    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog', error: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Blog from '../../../models/Blogs';
import fs from 'fs';
import path from 'path';
import { saveFile } from '../../../lib/fileUtils';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
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
      const thumbnailPath = await saveFile(thumbnailFile, 'blogs');
      blogData.thumbnail = thumbnailPath;
      
      const existingBlog = await Blog.findById(id);
      if (existingBlog && existingBlog.thumbnail) {
        const oldPath = path.join(process.cwd(), 'public', existingBlog.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    
    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    if (blog.thumbnail) {
      const thumbnailPath = path.join(process.cwd(), 'public', blog.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    await Blog.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog', error: error.message },
      { status: 500 }
    );
  }
}
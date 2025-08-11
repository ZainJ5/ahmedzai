import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import path from 'path';
import fs from 'fs';

async function saveFile(file, folder = 'products') {
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

function deleteFile(filePath) {
  try {
    if (!filePath) return;
    
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('make', 'name');
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    const formData = await request.formData();
    
    const updateData = {
      updatedAt: Date.now()
    };
    
    const textFields = [
      'title', 'model', 'fuelType', 
      'chassis', 'color', 'axleConfiguration', 'vehicleGrade', 'description'
    ];
    
    for (const field of textFields) {
      if (formData.has(field)) {
        updateData[field] = formData.get(field) || '';
      }
    }
    
    const numericFields = [
      'unitPrice', 'discountPercentage', 'year', 'quantity', 'weight', 
      'mileage'
    ];
    
    for (const field of numericFields) {
      if (formData.has(field)) {
        const value = parseFloat(formData.get(field));
        if (!isNaN(value)) {
          updateData[field] = value;
        }
      }
    }
    
    if (formData.has('mileageUnit')) {
      updateData.mileageUnit = formData.get('mileageUnit');
    }
    
    const refFields = ['category', 'make'];
    for (const field of refFields) {
      if (formData.has(field)) {
        updateData[field] = formData.get(field);
      }
    }
    
    try {
      const featuresString = formData.get('features');
      if (featuresString) {
        updateData.features = JSON.parse(featuresString);
      }
    } catch (e) {
      console.error('Error parsing features JSON:', e);
      return NextResponse.json(
        { success: false, message: 'Invalid features format' },
        { status: 400 }
      );
    }
    
    const thumbnailFile = formData.get('thumbnail');
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (existingProduct.thumbnail) {
        deleteFile(existingProduct.thumbnail);
      }
      updateData.thumbnail = await saveFile(thumbnailFile);
    }
    
    const newImageFiles = formData.getAll('images');
    const existingImagePaths = formData.getAll('existingImages') || [];
    
    const imagesToDelete = existingProduct.images.filter(
      (img) => !existingImagePaths.includes(img)
    );
    imagesToDelete.forEach(deleteFile);
    
    const newImagePaths = [];
    for (const imageFile of newImageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imagePath = await saveFile(imageFile);
        newImagePaths.push(imagePath);
      }
    }
    
    updateData.images = [...existingImagePaths, ...newImagePaths];
    
    if (!updateData.thumbnail && !existingProduct.thumbnail) {
      if (updateData.images.length > 0) {
        updateData.thumbnail = updateData.images[0];
      } else {
        return NextResponse.json(
          { success: false, message: 'A thumbnail image is required.' },
          { status: 400 }
        );
      }
    }
    
    if (updateData.images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one product image is required.' },
        { status: 400 }
      );
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('make', 'name');
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.thumbnail) {
      deleteFile(product.thumbnail);
    }
    
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        deleteFile(imagePath);
      });
    }
    
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product', error: error.message },
      { status: 500 }
    );
  }
}
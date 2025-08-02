import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
import Category from '../../models/Category';
import Brand from '../../models/Brand';
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

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const searchTerm = searchParams.get('search');
    
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minWeight = searchParams.get('minWeight');
    const maxWeight = searchParams.get('maxWeight');
    const year = searchParams.get('year');
    
    let query = {};
    
    if (categoryParam) {
      const categories = categoryParam.split(',');
      if (categories.length > 1) {
        query.category = { $in: categories };
      } else {
        query.category = categoryParam;
      }
    }
    
    if (brandParam) {
      const brands = brandParam.split(',');
      if (brands.length > 1) {
        query.make = { $in: brands };
      } else {
        query.make = brandParam;
      }
    }
    
    if (minPrice || maxPrice) {
      query.unitPrice = {};
      if (minPrice) query.unitPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.unitPrice.$lte = parseFloat(maxPrice);
    }
    
    if (minWeight || maxWeight) {
      query.weight = {};
      if (minWeight) query.weight.$gte = parseFloat(minWeight);
      if (maxWeight) query.weight.$lte = parseFloat(maxWeight);
    }
    
    if (year && year !== '') {
      query.year = parseInt(year);
    }
    
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { model: { $regex: searchTerm, $options: 'i' } },
        { features: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('make', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    const productData = {
      title: formData.get('title'),
      category: formData.get('category'),
      make: formData.get('make'),
      unitPrice: parseFloat(formData.get('unitPrice')),
      discountPercentage: parseFloat(formData.get('discountPercentage') || 0),
      year: parseInt(formData.get('year')),
      model: formData.get('model'),
      quantity: parseInt(formData.get('quantity')),
      weight: parseFloat(formData.get('weight')),
      features: formData.get('features')
    };
    
    const requiredFields = ['title', 'category', 'make', 'unitPrice', 'year', 'model', 'quantity', 'weight', 'features'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    const thumbnailFile = formData.get('thumbnail');
    if (!thumbnailFile) {
      return NextResponse.json(
        { success: false, message: 'Thumbnail image is required' },
        { status: 400 }
      );
    }
    
    const thumbnailPath = await saveFile(thumbnailFile);
    productData.thumbnail = thumbnailPath;
    
    const imageFiles = formData.getAll('images');
    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one product image is required' },
        { status: 400 }
      );
    }
    
    const imagePaths = [];
    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const imagePath = await saveFile(imageFile);
        imagePaths.push(imagePath);
      }
    }
    
    if (imagePaths.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one valid product image is required' },
        { status: 400 }
      );
    }
    
    productData.images = imagePaths;
    
    const product = await Product.create(productData);
    
    await product.populate('category', 'name');
    await product.populate('make', 'name');
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product', error: error.message },
      { status: 500 }
    );
  }
}
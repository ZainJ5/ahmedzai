import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
import Category from '@/app/models/Category';
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

async function saveFile(file, folder = 'products') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExtension = path.extname(file.name);
  const filename = `${uniqueSuffix}${fileExtension}`;
  
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
    const yearFrom = searchParams.get('yearFrom');
    const yearTo = searchParams.get('yearTo');
    const fuelType = searchParams.get('fuelType');
    const chassis = searchParams.get('chassis');
    const color = searchParams.get('color');
    const axleConfiguration = searchParams.get('axleConfiguration');
    const vehicleGrade = searchParams.get('vehicleGrade');
    const model = searchParams.get('model');
    const minMileage = searchParams.get('minMileage');
    const maxMileage = searchParams.get('maxMileage');
    const tag = searchParams.get('tag');
    
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
    
    if (yearFrom || yearTo) {
      query.year = {};
      if (yearFrom) query.year.$gte = parseInt(yearFrom);
      if (yearTo) query.year.$lte = parseInt(yearTo);
    }
    
    if (fuelType && fuelType !== '') {
      query.fuelType = fuelType;
    }
    
    if (chassis && chassis !== '') {
      query.chassis = { $regex: chassis, $options: 'i' };
    }
    
    if (color && color !== '') {
      query.color = { $regex: color, $options: 'i' };
    }
    
    if (axleConfiguration && axleConfiguration !== '') {
      query.axleConfiguration = axleConfiguration;
    }
    
    if (vehicleGrade && vehicleGrade !== '') {
      query.vehicleGrade = vehicleGrade;
    }
    
    if (model && model !== '') {
      query.model = { $regex: model, $options: 'i' };
    }
    
    if (minMileage || maxMileage) {
      query.mileage = {};
      if (minMileage) query.mileage.$gte = parseFloat(minMileage);
      if (maxMileage) query.mileage.$lte = parseFloat(maxMileage);
    }
    
    if (tag && tag !== '') {
      query.tag = tag;
    }
    
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { model: { $regex: searchTerm, $options: 'i' } },
        { chassis: { $regex: searchTerm, $options: 'i' } },
        { color: { $regex: searchTerm, $options: 'i' } },
        { axleConfiguration: { $regex: searchTerm, $options: 'i' } },
        { vehicleGrade: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
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
      description: formData.get('description') || '',
      fuelType: formData.get('fuelType'),
      
      mileage: parseFloat(formData.get('mileage') || 0),
      mileageUnit: formData.get('mileageUnit') || 'km/l',
      
      chassis: formData.get('chassis'),
      color: formData.get('color'),
      axleConfiguration: formData.get('axleConfiguration'),
      vehicleGrade: formData.get('vehicleGrade'),
      
      tag: formData.get('tag') || undefined
    };
    
    try {
      const featuresString = formData.get('features');
      if (featuresString) {
        productData.features = JSON.parse(featuresString);
      } else {
        productData.features = {
          camera360: false,
          airBags: false,
          airCondition: false,
          alloyWheels: false,
          abs: false,
          sunRoof: false,
          autoAC: false,
          backCamera: false,
          backSpoiler: false,
          doubleMuffler: false,
          fogLights: false,
          tv: false,
          hidLights: false,
          keylessEntry: false,
          leatherSeats: false,
          navigation: false,
          parkingSensors: false,
          doubleAC: false,
          powerSteering: false,
          powerWindows: false,
          pushStart: false,
          radio: false,
          retractableMirrors: false,
          roofRail: false
        };
      }
    } catch (e) {
      console.error('Error parsing features JSON:', e);
      return NextResponse.json(
        { success: false, message: 'Invalid features format' },
        { status: 400 }
      );
    }
    
    const requiredFields = [
      'title', 'category', 'make', 'year', 'model', 
      'quantity', 'weight', 'fuelType', 'mileage', 'chassis',
      'color', 'axleConfiguration', 'vehicleGrade'
    ];
    
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    if (productData.tag && productData.tag !== 'Trucks') {
      return NextResponse.json(
        { success: false, message: 'Tag must be "Trucks" if specified' },
        { status: 400 }
      );
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
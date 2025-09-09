import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Product from '@/app/models/Product';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

function isVpsPath(path) {
  return path && (path.startsWith('/products/') || path.startsWith('products/'));
}

async function migrateFileToR2(vpsPath, folder = 'products') {
  try {
    const relativePath = vpsPath.startsWith('/') ? vpsPath.slice(1) : vpsPath;
    
    const filePath = path.join(process.cwd(), 'public', relativePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    
    const filename = path.basename(filePath);
    const fileExtension = path.extname(filename);
    const contentType = getContentTypeFromExtension(fileExtension);
    
    const key = `${folder}/${filename}`;
    
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key
      }));
      return `${process.env.R2_PUBLIC_BASE_URL}${key}`;
    } catch (error) {
    }
    
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    };
    
    await s3Client.send(new PutObjectCommand(params));
    
    return `${process.env.R2_PUBLIC_BASE_URL}${key}`;
  } catch (error) {
    console.error(`Error migrating file ${vpsPath}:`, error);
    throw error;
  }
}

function getContentTypeFromExtension(extension) {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp'
  };
  
  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    const productsToUpdate = await Product.find({
      $or: [
        { thumbnail: { $regex: '^/?products/' } }, 
        { images: { $elemMatch: { $regex: '^/?products/' } } }
      ]
    }).skip(skip).limit(limit);
    
    if (productsToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products found that need image migration',
        migrated: 0
      });
    }
    
    const results = {
      successful: [],
      failed: []
    };
    
    for (const product of productsToUpdate) {
      try {
        const productResult = {
          productId: product._id,
          title: product.title,
          migratedImages: []
        };
        
        if (isVpsPath(product.thumbnail)) {
          try {
            const oldThumbnail = product.thumbnail;
            const newThumbnailUrl = await migrateFileToR2(product.thumbnail);
            product.thumbnail = newThumbnailUrl;
            productResult.migratedImages.push({
              type: 'thumbnail',
              oldPath: oldThumbnail,
              newPath: newThumbnailUrl
            });
          } catch (error) {
            productResult.migratedImages.push({
              type: 'thumbnail',
              oldPath: product.thumbnail,
              error: error.message
            });
          }
        }
        
        if (product.images && product.images.length > 0) {
          for (let i = 0; i < product.images.length; i++) {
            if (isVpsPath(product.images[i])) {
              try {
                const oldImage = product.images[i];
                const newImageUrl = await migrateFileToR2(product.images[i]);
                product.images[i] = newImageUrl;
                productResult.migratedImages.push({
                  type: 'image',
                  index: i,
                  oldPath: oldImage,
                  newPath: newImageUrl
                });
              } catch (error) {
                productResult.migratedImages.push({
                  type: 'image',
                  index: i,
                  oldPath: product.images[i],
                  error: error.message
                });
              }
            }
          }
        }
        
        await product.save({ validateBeforeSave: false });
        
        results.successful.push(productResult);
      } catch (error) {
        results.failed.push({
          productId: product._id,
          title: product.title,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Image migration completed',
      processed: productsToUpdate.length,
      successful: results.successful.length,
      failed: results.failed.length,
      details: results
    });
    
  } catch (error) {
    console.error('Error in image migration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to migrate images', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const limit = parseInt(body.limit || 10);
    const skip = parseInt(body.skip || 0);
    
    const productsToUpdate = await Product.find({
      $or: [
        { thumbnail: { $regex: '^/?products/' } }, 
        { images: { $elemMatch: { $regex: '^/?products/' } } }
      ]
    }).skip(skip).limit(limit);
    
    if (productsToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products found that need image migration',
        migrated: 0
      });
    }
    
    const results = {
      successful: [],
      failed: []
    };
    
    for (const product of productsToUpdate) {
      try {
        const productResult = {
          productId: product._id,
          title: product.title,
          migratedImages: []
        };
        
        if (isVpsPath(product.thumbnail)) {
          try {
            const oldThumbnail = product.thumbnail;
            const newThumbnailUrl = await migrateFileToR2(product.thumbnail);
            product.thumbnail = newThumbnailUrl;
            productResult.migratedImages.push({
              type: 'thumbnail',
              oldPath: oldThumbnail,
              newPath: newThumbnailUrl
            });
          } catch (error) {
            productResult.migratedImages.push({
              type: 'thumbnail',
              oldPath: product.thumbnail,
              error: error.message
            });
          }
        }
        
        if (product.images && product.images.length > 0) {
          for (let i = 0; i < product.images.length; i++) {
            if (isVpsPath(product.images[i])) {
              try {
                const oldImage = product.images[i];
                const newImageUrl = await migrateFileToR2(product.images[i]);
                product.images[i] = newImageUrl;
                productResult.migratedImages.push({
                  type: 'image',
                  index: i,
                  oldPath: oldImage,
                  newPath: newImageUrl
                });
              } catch (error) {
                productResult.migratedImages.push({
                  type: 'image',
                  index: i,
                  oldPath: product.images[i],
                  error: error.message
                });
              }
            }
          }
        }
        
        await product.save({ validateBeforeSave: false });
        
        results.successful.push(productResult);
      } catch (error) {
        results.failed.push({
          productId: product._id,
          title: product.title,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Image migration completed',
      processed: productsToUpdate.length,
      successful: results.successful.length,
      failed: results.failed.length,
      details: results
    });
    
  } catch (error) {
    console.error('Error in image migration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to migrate images', error: error.message },
      { status: 500 }
    );
  }
}
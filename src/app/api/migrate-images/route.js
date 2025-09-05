import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Product from '@/app/models/Product';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Function to check if a path is a VPS path
function isVpsPath(path) {
  return path && (path.startsWith('/products/') || path.startsWith('products/'));
}

// Function to upload a file from VPS to R2
async function migrateFileToR2(vpsPath, folder = 'products') {
  try {
    // Remove leading slash if present
    const relativePath = vpsPath.startsWith('/') ? vpsPath.slice(1) : vpsPath;
    
    // Construct the full file path on VPS
    const filePath = path.join(process.cwd(), 'public', relativePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read file content
    const fileBuffer = fs.readFileSync(filePath);
    
    // Get file name from path
    const filename = path.basename(filePath);
    const fileExtension = path.extname(filename);
    const contentType = getContentTypeFromExtension(fileExtension);
    
    // Set target key in R2 (keep the same file name for consistency)
    const key = `${folder}/${filename}`;
    
    // Check if file already exists in R2 to avoid redundant uploads
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key
      }));
      // File exists, just return the URL
      return `${process.env.R2_PUBLIC_BASE_URL}${key}`;
    } catch (error) {
      // File doesn't exist, proceed with upload
    }
    
    // Upload to R2
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
    
    const productsToUpdate = await Product.find({
      $or: [
        { thumbnail: { $regex: '^/products/' } }, 
        { images: { $elemMatch: { $regex: '^/products/' } } }
      ]
    }).limit(limit);
    
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
            const newThumbnailUrl = await migrateFileToR2(product.thumbnail);
            product.thumbnail = newThumbnailUrl;
            productResult.migratedImages.push({
              type: 'thumbnail',
              oldPath: product.thumbnail,
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
                const newImageUrl = await migrateFileToR2(product.images[i]);
                productResult.migratedImages.push({
                  type: 'image',
                  index: i,
                  oldPath: product.images[i],
                  newPath: newImageUrl
                });
                product.images[i] = newImageUrl;
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
        
        await product.save();
        
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
    
    const productsToUpdate = await Product.find({
      $or: [
        { thumbnail: { $regex: '^/products/' } }, 
        { images: { $elemMatch: { $regex: '^/products/' } } }
      ]
    }).limit(limit);
    
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
            const newThumbnailUrl = await migrateFileToR2(product.thumbnail);
            product.thumbnail = newThumbnailUrl;
            productResult.migratedImages.push({
              type: 'thumbnail',
              oldPath: product.thumbnail,
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
                const newImageUrl = await migrateFileToR2(product.images[i]);
                productResult.migratedImages.push({
                  type: 'image',
                  index: i,
                  oldPath: product.images[i],
                  newPath: newImageUrl
                });
                product.images[i] = newImageUrl;
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
        
        await product.save();
        
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
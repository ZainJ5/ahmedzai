import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function createMulterUpload(folderPath) {
  const fullPath = path.join(process.cwd(), 'public', folderPath);
  ensureDirectoryExists(fullPath);
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image or video files are allowed'), false);
    }
  };
  
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
}

export const categoryUpload = createMulterUpload('categories');
export const brandUpload = createMulterUpload('brands');
export const productUpload = createMulterUpload('products');
export const heroUpload = createMulterUpload('hero');

export async function processFileUpload(request, uploadMiddleware) {
  try {
    const formData = await new Promise((resolve, reject) => {
      const handler = uploadMiddleware.single('media');
      
      handler(request, { headers: request.headers }, (error) => {
        if (error) {
          return reject(error);
        }
        resolve(request.file);
      });
    });
    
    return { success: true, file: formData };
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: error.message };
  }
}
import fs from 'fs';
import path from 'path';

export async function saveFile(file, folder = 'blogs') {
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
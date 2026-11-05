import fs from 'fs';
import path from 'path';
import { UploadFolder } from '../config/upload';

export const getPublicUploadUrl = (folder: UploadFolder, filename: string): string => {
  return `/uploads/${folder}/${filename}`;
};

export const deleteUploadedFile = (publicUrl?: string | null): void => {
  if (!publicUrl?.startsWith('/uploads/')) return;

  const absolutePath = path.join(process.cwd(), publicUrl.replace(/^\//, ''));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback, MulterError, StorageEngine } from 'multer';
import path from 'path';
import { getUploadDir } from '../config/upload';
import { env } from '../config/env';
import { ApiError } from '../utils/apiResponse';

export const MIME_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

export type UploadOptions = {
  folder: string;
  fieldName: string;
  allowedMimeTypes?: readonly string[];
  maxFileSize?: number;
  multiple?: boolean;
  maxCount?: number;
};

export class UploadMiddleware {
  upload = (options: UploadOptions) => {
    const {
      folder,
      fieldName,
      allowedMimeTypes = MIME_TYPES.IMAGE,
      maxFileSize = env.maxFileSize,
      multiple = false,
      maxCount = 5,
    } = options;

    const storage = this.createStorage(folder);
    const fileFilter = this.createFileFilter(allowedMimeTypes);

    const uploader = multer({
      storage,
      limits: { fileSize: maxFileSize, ...(multiple && { files: maxCount }) },
      fileFilter,
    });

    const middleware = multiple ? uploader.array(fieldName, maxCount) : uploader.single(fieldName);

    return (req: Request, res: Response, next: NextFunction): void => {
      middleware(req, res, (err) => {
        if (err) return next(this.mapMulterError(err, maxFileSize));
        next();
      });
    };
  };

  private createStorage = (folder: string): StorageEngine =>
    multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, getUploadDir(folder)),
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });

  private createFileFilter =
    (allowedMimeTypes: readonly string[]) =>
    (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
        return;
      }
      cb(new ApiError(400, `File type not allowed. Accepted: ${allowedMimeTypes.join(', ')}`));
    };

  private mapMulterError(err: unknown, maxFileSize: number): Error {
    if (err instanceof ApiError) return err;

    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return new ApiError(400, `File too large. Max size is ${maxFileSize / (1024 * 1024)}MB.`);
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return new ApiError(400, 'Too many files uploaded.');
      }
      return new ApiError(400, err.message);
    }

    return err instanceof Error ? err : new Error('File upload failed.');
  }
}

export const uploadMiddleware = new UploadMiddleware();

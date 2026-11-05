import fs from 'fs';
import path from 'path';
import { env } from './env';

export const UPLOAD_DIRS = {
  profiles: 'profiles',
  notes: 'notes',
} as const;

export type UploadFolder = keyof typeof UPLOAD_DIRS;

export const getUploadDir = (folder: UploadFolder | string): string => {
  const subPath = UPLOAD_DIRS[folder as UploadFolder] ?? folder;
  const absolutePath = path.join(env.uploadRoot, subPath);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }

  return absolutePath;
};

export const ensureUploadDirs = (): void => {
  Object.values(UPLOAD_DIRS).forEach((folder) => getUploadDir(folder));
};

import dotenv from 'dotenv';

dotenv.config({ override: true });

const required = ['MONGODB_URI', 'JWT_SECRET'] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '12', 10),
  uploadRoot: process.env.UPLOAD_ROOT || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || String(5 * 1024 * 1024), 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isVercel: !!process.env.VERCEL,
  superAdminName: process.env.SUPER_ADMIN_NAME || 'Super Admin',
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com',
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || 'superadmin123',
};

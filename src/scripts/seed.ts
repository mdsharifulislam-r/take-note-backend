import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { USERS_RULES } from '../constants/users.rules';
import { User } from '../modules/user/user.model';
import { Note } from '../modules/note/note.model';
import { Post } from '../modules/user/post.model';

type SeedUserInput = {
  name: string;
  email: string;
  password: string;
  role: (typeof USERS_RULES)[keyof typeof USERS_RULES];
  interests: string[];
};

const seedUser = async (data: SeedUserInput) => {
  const existing = await User.findOne({ email: data.email });

  if (existing) {
    console.log(`User ${data.email} already exists.`);
    return existing;
  }

  const hashedPassword = await bcrypt.hash(data.password, env.saltRounds);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    interests: data.interests,
  });

  console.log(`User ${data.email} created.`);
  return user;
};

const seedNote = async (title: string, content: string, authorId: Types.ObjectId) => {
  const existing = await Note.findOne({ title, author: authorId });

  if (existing) {
    console.log(`Note "${title}" already exists.`);
    return existing;
  }

  const note = await Note.create({ title, content, author: authorId });
  console.log(`Note "${title}" created.`);
  return note;
};

const seedPost = async (title: string, content: string, authorId: Types.ObjectId) => {
  const existing = await Post.findOne({ title, author: authorId });

  if (existing) {
    console.log(`Post "${title}" already exists.`);
    return existing;
  }

  const post = await Post.create({ title, content, author: authorId });
  console.log(`Post "${title}" created.`);
  return post;
};

export const seedDatabase = async (): Promise<void> => {
  console.log('Running initial seed check...');

  const superAdmin = await seedUser({
    name: env.superAdminName,
    email: env.superAdminEmail,
    password: env.superAdminPassword,
    role: USERS_RULES.SUPER_ADMIN,
    interests: ['management', 'system'],
  });

  const admin = await seedUser({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: USERS_RULES.ADMIN,
    interests: ['management', 'reading', 'chess'],
  });

  const alice = await seedUser({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'user123',
    role: USERS_RULES.USER,
    interests: ['chess', 'reading', 'hiking'],
  });

  const bob = await seedUser({
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'user123',
    role: USERS_RULES.USER,
    interests: ['reading', 'coding', 'music'],
  });

  await seedNote('Meeting Notes', 'Discuss project timeline.', alice._id);
  await seedNote('Grocery List', 'Milk, eggs, bread.', alice._id);
  await seedNote('Book Ideas', 'Sci-fi novel about time travel.', bob._id);

  await seedPost('Hello World', 'My first post!', alice._id);
  await seedPost('Chess Tips', 'Control the center early.', alice._id);
  await seedPost('Code Review', 'Always write tests.', bob._id);

  console.log('Seed check completed.');
  console.log(`Super Admin: ${env.superAdminEmail}`);
  console.log(`Super Admin ID: ${superAdmin._id}`);
  console.log(`Admin ID:       ${admin._id}`);
};

const runSeedScript = async (): Promise<void> => {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB for seeding...');

  try {
    await seedDatabase();
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  runSeedScript().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

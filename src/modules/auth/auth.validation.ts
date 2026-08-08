import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required.').max(100),
    email: z.string().trim().email('A valid email is required.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    interests: z.array(z.string().trim().min(1)).optional().default([]),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('A valid email is required.'),
    password: z.string().min(1, 'Password is required.'),
  }),
});

const interestsField = z.preprocess(
  (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return undefined;
  },
  z.array(z.string().trim().min(1)).optional()
);

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name cannot be empty.').max(100).optional(),
    email: z.string().trim().email('A valid email is required.').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters.').optional(),
    interests: interestsField,
  }),
});

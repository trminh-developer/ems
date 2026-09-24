import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  password: z.string().min(6).optional(),
  dateOfBirth: z.string().refine((val) => val === '' || !isNaN(Date.parse(val)), 'Invalid date format').optional(),
  bio: z.string().max(500).optional(),
  coverPhoto: z.string().optional(),
  avatar: z.string().optional(),
  photos: z.array(z.string()).optional(),
  isOnline: z.boolean().optional(),
  profession: z.string().max(100).optional(),
  education: z.string().max(100).optional(),
  relationshipGoal: z.enum(['LONG_TERM', 'SHORT_TERM', 'FRIENDSHIP', 'NOT_SURE'] as const).optional(),
  
  interests: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    icon: z.string().optional(),
    category: z.string().optional()
  }).passthrough()).optional(),

  location: z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  }).optional(),

  datingPreference: z.object({
    preferredGender: z.array(z.enum(['male', 'female', 'other'] as const)).optional(),
    ageRange: z.object({
      min: z.number().min(18).optional(),
      max: z.number().max(100).optional()
    }).optional(),
    maxDistance: z.number().optional(),
    relationshipGoal: z.enum(['LONG_TERM', 'SHORT_TERM', 'FRIENDSHIP', 'NOT_SURE'] as const).optional()
  }).optional()
});

import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
});

export const updateProfileSchema = z.object({
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/, 'Username chỉ gồm chữ, số, dấu chấm, gạch dưới và gạch ngang.').optional(),
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().max(50).optional(),
  appLogo: z.string().max(1500000).refine(
    (value) => value === '' || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value),
    'Logo phải là ảnh PNG, JPEG, WebP hoặc GIF, tối đa 1 MB.',
  ).optional(),
  password: z.string().min(6).nullish(),
  dateOfBirth: z
    .string()
    .refine(
      (val) => val === "" || !isNaN(Date.parse(val)),
      "Invalid date format",
    )
    .nullish(),
  bio: z.string().max(500).nullish(),
  coverPhoto: z.string().nullish(),
  avatar: z.string().nullish(),
  photos: z.array(z.string()).nullish(),
  isOnline: z.boolean().nullish(),
  profession: z.string().max(100).nullish(),
  education: z.string().max(100).nullish(),
  relationshipGoal: z
    .enum(["LONG_TERM", "SHORT_TERM", "FRIENDSHIP", "NOT_SURE"] as const)
    .or(z.literal(""))
    .nullish(),

  interests: z
    .array(
      z
        .object({
          id: z.string().nullish(),
          name: z.string(),
          icon: z.string().nullish(),
          category: z.string().nullish(),
        })
        .passthrough(),
    )
    .nullish(),

  location: z
    .object({
      city: z.string().nullish(),
      country: z.string().nullish(),
      latitude: z.number().nullish(),
      longitude: z.number().nullish(),
    })
    .nullish(),

  datingPreference: z
    .object({
      preferredGender: z
        .array(z.enum(["male", "female", "other"] as const))
        .nullish(),
      ageRange: z
        .object({
          min: z.number().min(18).nullish(),
          max: z.number().max(100).nullish(),
        })
        .nullish(),
      maxDistance: z.number().nullish(),
      relationshipGoal: z
        .enum(["LONG_TERM", "SHORT_TERM", "FRIENDSHIP", "NOT_SURE"] as const)
        .or(z.literal(""))
        .nullish(),
    })
    .nullish(),
});

import { z } from "zod";

// Base message response schemas
export const apiMessageResponseSchema = z.object({
  message: z.string(),
  requestId: z.string().optional(),
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    statusCode: z.number(),
    code: z.string().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
    timestamp: z.string().optional(),
    requestId: z.string().optional(),
  }),
});

export const apiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

// Movie/Title schemas
export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  posterUrl: z.string().url(),
  trailerUrl: z.string().url().optional(),
  releaseDate: z.string().datetime(),
  rating: z.number().min(0).max(10),
  genres: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const moviesSchema = z.array(movieSchema);

export const movieDetailSchema = movieSchema.extend({
  reviews: z
    .array(
      z.object({
        id: z.string(),
        rating: z.number(),
        comment: z.string(),
        userId: z.string(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
        likes: z.number().optional(),
        createdAt: z.string().datetime(),
      })
    )
    .optional(),
  aggregateRating: z
    .object({
      averageRating: z.number(),
      totalReviews: z.number(),
    })
    .optional(),
});

// Review schemas
export const reviewSchema = z.object({
  id: z.string(),
  titleId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  likes: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createReviewSchema = z.object({
  titleId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

// User schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  emailVerified: z.boolean(),
  role: z.enum(["USER", "ADMIN"]),
  image: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
});

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

// Types
export type Movie = z.infer<typeof movieSchema>;
export type MovieDetail = z.infer<typeof movieDetailSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type User = z.infer<typeof userSchema>;
export type SignUp = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;
export type VerifyOTP = z.infer<typeof verifyOTPSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

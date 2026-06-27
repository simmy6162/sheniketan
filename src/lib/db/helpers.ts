import mongoose, { Schema, Document } from 'mongoose';

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Helper to create consistent API responses
 */
export function createResponse<T>(
  success: boolean,
  message: string,
  data?: T
): IApiResponse<T> {
  return {
    success,
    message,
    ...(data && { data }),
  };
}

/**
 * Error response helper
 */
export function createErrorResponse(message: string): IApiResponse {
  return {
    success: false,
    message,
  };
}

/**
 * Success response helper
 */
export function createSuccessResponse<T>(message: string, data?: T): IApiResponse<T> {
  return {
    success: true,
    message,
    ...(data && { data }),
  };
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Converts string ID to ObjectId
 */
export function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

/**
 * Generic error handler for API routes
 */
export function handleDatabaseError(error: unknown): IApiResponse {
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      const validationError = error as any;
      const messages = Object.values(validationError.errors || {})
        .map((err: any) => err?.message || 'Validation error')
        .join(', ');
      return createErrorResponse(`Validation Error: ${messages}`);
    }

    if (error.message && error.message.includes('E11000')) {
      return createErrorResponse('Duplicate entry: This record already exists');
    }

    return createErrorResponse(`Database Error: ${error.message}`);
  }

  return createErrorResponse('An unexpected error occurred');
}

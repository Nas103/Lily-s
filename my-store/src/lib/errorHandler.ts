/**
 * Error handling utilities for API routes
 * Sanitizes error messages to prevent exposing internal details to clients
 */

interface ErrorResponse {
  error: string;
  status: number;
}

/**
 * Get user-friendly error message from an error
 * Never exposes internal implementation details
 */
export function getSafeErrorMessage(error: any, defaultMessage: string = "Something went wrong. Please try again."): string {
  // In production, never expose internal error details
  const isProduction = process.env.NODE_ENV === "production";

  // Handle Prisma errors
  if (error?.code) {
    switch (error.code) {
      case "P1001":
        return "Unable to connect to the database. Please try again later.";
      case "P1008":
        return "Database operation timed out. Please try again.";
      case "P2021":
        return "Database is not properly configured. Please contact support.";
      case "P2025":
        return "The requested record was not found.";
      case "P2002":
        return "This email is already registered. Please sign in instead.";
      case "P2003":
        return "Invalid data provided. Please check your input.";
      default:
        return isProduction ? defaultMessage : `Database error (${error.code}). Please try again.`;
    }
  }

  // Handle error messages
  const errorMessage = error?.message || String(error || "");

  // Check for common database connection errors
  if (
    errorMessage.includes("Tenant or user not found") ||
    errorMessage.includes("FATAL") ||
    errorMessage.includes("authentication failed") ||
    errorMessage.includes("Can't reach database")
  ) {
    return "Unable to connect to the database. Please try again later or contact support if the problem persists.";
  }

  // Check for network errors
  if (
    errorMessage.includes("ECONNREFUSED") ||
    errorMessage.includes("ETIMEDOUT") ||
    errorMessage.includes("ENOTFOUND")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // Check for validation errors (these are safe to show)
  if (
    errorMessage.includes("Invalid") ||
    errorMessage.includes("required") ||
    errorMessage.includes("format") ||
    errorMessage.includes("must be")
  ) {
    return errorMessage; // Validation errors are user-friendly
  }

  // Check for authentication errors (these are safe to show)
  if (
    errorMessage.includes("Unauthorized") ||
    errorMessage.includes("Invalid email or password") ||
    errorMessage.includes("already exists")
  ) {
    return errorMessage; // Auth errors are user-friendly
  }

  // For any other errors, return a safe default message
  // In development, we can show more details, but in production, always use default
  if (isProduction) {
    return defaultMessage;
  }

  // In development, show a bit more context but still sanitize
  if (errorMessage.length > 200) {
    return defaultMessage; // Too long, might contain sensitive info
  }

  // Remove file paths and internal details
  const sanitized = errorMessage
    .replace(/C:\\[^\s]+/g, "[path]") // Remove Windows paths
    .replace(/\/[^\s]+\.(ts|js|tsx|jsx):\d+/g, "[file]") // Remove file paths
    .replace(/__TURBOPACK__[^\s]+/g, "[module]") // Remove Turbopack references
    .replace(/\[root-of-the-server\][^\s]+/g, "[server]") // Remove server chunk references
    .replace(/at\s+[^\s]+\s+\([^)]+\)/g, "") // Remove stack trace locations
    .trim();

  // If after sanitization it's still too technical, use default
  if (
    sanitized.includes("invocation") ||
    sanitized.includes("Prisma") ||
    sanitized.includes("TURBOPACK") ||
    sanitized.includes("module")
  ) {
    return defaultMessage;
  }

  return sanitized || defaultMessage;
}

/**
 * Handle API route errors consistently
 * Returns NextResponse with user-friendly error message
 */
export async function handleApiError(
  error: any,
  context: string,
  defaultMessage: string = "Something went wrong. Please try again.",
  status: number = 500
) {
  const safeMessage = getSafeErrorMessage(error, defaultMessage);
  
  // Log full error details server-side (never sent to client)
  console.error(`[${context}] Error:`, {
    message: error?.message || String(error),
    code: error?.code,
    name: error?.name,
    stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    safeMessage, // What we're sending to client
  });

  const { NextResponse } = await import("next/server");
  return NextResponse.json(
    { error: safeMessage },
    { status }
  );
}


/**
 * Utility: Custom API Error class
 * Standardizes error status codes and messages.
 */
export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

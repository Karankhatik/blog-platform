import httpStatus from 'http-status';

/**
 * Extendable Error class used as a base for specific error types.
 * @extends Error
 */
class ExtendableError extends Error {
  public status: number;
  public isPublic: boolean;

  constructor(message: string, status: number, isPublic: boolean) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param message - Error message.
   * @param status - HTTP status code of error, defaults to 500 Internal Server Error.
   * @param isPublic - Whether the message should be visible to user or not, defaults to true.
   */
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = true
  ) {
    super(message, status, isPublic);
  }
}

export default APIError;

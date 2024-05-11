// errorMessages.ts

/**
 * Contains constants for error messages used throughout the application.
 * 
 * This centralized approach for managing error messages enhances maintainability,
 * enables easy updates, and supports potential internationalization efforts.
 */
export const ERROR_MESSAGES = {
    // Represents a generic error message for unexpected issues during form validation.
    UNEXPECTED_VALIDATION_ERROR: 'An unexpected error occurred during validation.',

    // Represents a generic error message for unexpected issues during the authentication process.
    UNEXPECTED_AUTHENTICATION_ERROR: 'An unexpected error occurred during authentication.',

    // Represents an error message displayed when user credentials do not match stored credentials.
    INVALID_CREDENTIALS: 'Invalid credentials',

    // Represents a generic catch-all error message for miscellaneous errors that don't fit more specific categories.
    SOMETHING_WENT_WRONG: 'Something went wrong!',
};

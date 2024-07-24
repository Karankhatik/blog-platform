import { RegistrationForm, LoginForm } from "@/types/validation";

/**
 * Maps form field names to their respective validation rules.
 */
interface ValidationRules {
  [key: string]: (value: string, formData: FormDataValue) => ValidatorResponse | Promise<ValidatorResponse>;
}

/**
 * Defines the structure for form data, which can be one of several different form types.
 */
type FormDataValue = LoginForm | RegistrationForm | PasswordResetForm | ResetPasswordEmailForm;


/**
 * Represents the possible response from a validation rule.
 * @typedef {string | boolean} ValidatorResponse - A boolean value indicates success (true) or failure (false), while a string indicates failure with an error message.
 */
type ValidatorResponse = string | boolean;


/** 
 * Describes the form data structure for a login form.
 */
export interface ResetPasswordEmailForm {
  email: string;
}

/**
 * Describes the form data structure for a password reset form.
 */
interface PasswordResetForm {
  password: string;
  confirmPassword: string;
}

/**
 * Common validation rules shared across different forms.
 */
const commonValidationRules: ValidationRules = {
  /**
   * Validates an email address.
   * @param {string} value - The email address to validate.
   * @returns {ValidatorResponse} True if valid, otherwise an error message.
   */
  email: async (value) => {
    const email = value.trim().toLowerCase();
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if(email.length === 0) {
      return "Please enter an email address";
    }

    if (email.length > 254) {
      return "Email address must be 254 characters or fewer";
    }

    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    return true;
  },
  /**
   * Validates a password's length.
   * @param {string} value - The password to validate.
   * @returns {ValidatorResponse} True if valid, otherwise an error message.
   */
  password: (value) => {
    if (value.length === 0) return "Please enter a password";
    if (value.length < 6) return "Password must be at least 6 characters long";
    if (value.length > 16) return "Password must be no more than 16 characters long";
    return true;
  },
  /**
    * Validates a name string.
    * @param {string} value - The name to validate.
    * @returns {ValidatorResponse} True if valid, otherwise an error message.
    */
  name: (value) => {
    const name = value.trim();

    const minLength = 3;
    const maxLength = 100;

    if (name.length === 0) return "Please enter a name";

    if (name.length < minLength) return `Name must be at least ${minLength} characters long`;

    if (name.length > maxLength) return `Name must be no more than ${maxLength} characters long`;

    return true;
  },
  /**
   * Validates an OTP (One-Time Password).
   * @param {string} value - The OTP to validate.
   * @returns {ValidatorResponse} True if valid, otherwise an error message.
   */
  otp: (value) => {
    const otp = value.trim();
    const otpLength = 6; // Assuming OTP is a 6-digit code

    if (otp.length === 0) return "Please enter the OTP";
    if (otp.length !== otpLength) return `OTP must be ${otpLength} digits long`;

    // Check if the OTP is numeric
    if (!/^\d+$/.test(otp)) return "OTP must contain only numbers";

    return true;
  },
};

/**
 * Specific validation rules for resetting a password, including a rule to confirm password match.
 */
const registrationValidationRules: ValidationRules = {
  ...commonValidationRules,
  confirmPassword: (value, formData) => {
    if ('password' in formData && value !== formData?.password) return "Passwords do not match";
    return true;
  },
};

/**
 * Validates form data against a set of validation rules.
 * @param {FormDataValue} formData - The data submitted from the form.
 * @param {ValidationRules} rules - The validation rules to apply.
 * @returns {Promise<{isValid: boolean, errors: { [key: string]: string }}>} An object indicating whether the form is valid and containing any validation errors.
 */
async function validateForm(formData: FormDataValue, rules: ValidationRules): Promise<{ isValid: boolean; errors: { [key: string]: string } }> {
  let errors: { [key: string]: string } = {};
  let isValid = true;

  for (const [key, value] of Object.entries(formData)) {
    const rule = rules[key];
    if (rule) {
      try {
        const result = await Promise.resolve(rule(value, formData));
        if (result !== true) {
          isValid = false;
          errors[key] = result as string;
        }
      } catch (error) {
        isValid = false;        
        errors[key] = "An unexpected error occurred during validation";
      }
    }
  }

  return { isValid, errors };
}

export { validateForm, commonValidationRules, registrationValidationRules };

// Example usage
/*
async function handleRegistration(formData: RegistrationForm) {
  const { isValid, errors } = await validateForm(formData, commonValidationRules);

  if (isValid) {
    console.log("Registration data is valid. Proceed with registration logic.");
    // Proceed with further processing, like saving the data or sending it to an API.
  } else {
    console.error("Validation errors:", errors);
    // Handle the errors in the UI, such as displaying error messages next to the relevant input fields.
  }
}
*/
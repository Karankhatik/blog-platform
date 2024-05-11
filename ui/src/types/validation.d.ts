/**
 * Describes the form data structure for a registration form.
 */
export interface RegistrationForm {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }
  
  /**
  * Describes the form data structure for a login form.
  */
  export interface LoginForm {
    email: string;
    password: string;
  }

  export interface ResetPasswordEmailForm {
    email: string;
  }

   export interface PasswordResetForm {
     otp: string;
     password: string;
     email: string;
   }
  
  
  
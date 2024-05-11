export const validationInput = (value: string, type: 'email' | 'password' | 'name'): string => {
    // Define validation functions for each type
    const validators = {
        email: (emailValue: string): string => {
            if (!emailValue.trim()) return 'Email is required';
            if (!/\S+@\S+\.\S+/.test(emailValue)) return 'Email is invalid';
            return '';
        },
        password: (passwordValue: string): string => {
            if (!passwordValue) return 'Password is required';
            if (passwordValue.length < 6) return 'Password must be at least 6 characters';
            return '';
        },
        name: (nameValue: string): string => {
            if (!nameValue.trim()) return 'Name is required';
            if (nameValue.length < 4) return 'Name must be at least 4 characters';            
            return '';
        }
    };

    // Invoke the appropriate validator based on the input type
    const validator = validators[type];
    return validator ? validator(value) : `Invalid type: ${type}`;
};

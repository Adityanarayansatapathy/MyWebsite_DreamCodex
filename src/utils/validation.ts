import { VALIDATION } from './apiConfig';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!VALIDATION.EMAIL_PATTERN.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
    }
    if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
      errors.push(`Password must be no more than ${VALIDATION.PASSWORD_MAX_LENGTH} characters long`);
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Name is required');
  } else {
    if (name.length < VALIDATION.NAME_MIN_LENGTH) {
      errors.push(`Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters long`);
    }
    if (name.length > VALIDATION.NAME_MAX_LENGTH) {
      errors.push(`Name must be no more than ${VALIDATION.NAME_MAX_LENGTH} characters long`);
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!VALIDATION.PHONE_PATTERN.test(phone)) {
    errors.push('Please enter a valid phone number (10-15 digits, with optional + prefix)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBusinessCategory = (category: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!category) {
    errors.push('Business category is required');
  } else if (category.trim().length === 0) {
    errors.push('Please select a valid business category');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }
  
  if (!password) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSignupForm = (
  name: string,
  email: string,
  phoneNumber: string,
  businessCategory: string,
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];
  
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }
  
  const phoneValidation = validatePhoneNumber(phoneNumber);
  if (!phoneValidation.isValid) {
    errors.push(...phoneValidation.errors);
  }
  
  const categoryValidation = validateBusinessCategory(businessCategory);
  if (!categoryValidation.isValid) {
    errors.push(...categoryValidation.errors);
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  
  const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
  if (!passwordMatchValidation.isValid) {
    errors.push(...passwordMatchValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFileUpload = (file: File): ValidationResult => {
  const errors: string[] = [];
  
  // Check file size
  if (file.size > 5 * 1024 * 1024) { // 5MB
    errors.push('File size must be less than 5MB');
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please upload JPEG, PNG, GIF, or PDF files only');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to sanitize input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Utility function to format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with +, keep it; otherwise, ensure it's just digits
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  return cleaned.replace(/[^\d]/g, '');
};
import { z } from 'zod';

// Common validation patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const nameRegex = /^[a-zA-Z\s'-]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
const pincodeRegex = /^[0-9]{4,10}$/;

// Profile validation schema
export const profileSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  userName: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(usernameRegex, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
    .toLowerCase(),
  phone: z.union([
    z.string().regex(phoneRegex, 'Please enter a valid phone number'),
    z.literal('')
  ]).optional(),
  country: z.string()
    .min(2, 'Please select a country')
    .max(100, 'Country name is too long')
});

// Address validation schema
export const addressSchema = z.object({
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]{2,50}$/, 'City can only contain letters, spaces, hyphens, and apostrophes'),
  pincode: z.string()
    .regex(pincodeRegex, 'Please enter a valid pincode (4-10 digits)'),
  phone: z.string()
    .regex(phoneRegex, 'Please enter a valid phone number'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal(''))
});

// Product validation schema
export const productSchema = z.object({
  title: z.string()
    .min(3, 'Product title must be at least 3 characters')
    .max(100, 'Product title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Product description must be at least 10 characters')
    .max(2000, 'Product description must be less than 2000 characters'),
  category: z.string()
    .min(1, 'Please select a category')
    .refine(val => ['men', 'women', 'kids', 'accessories', 'footwear'].includes(val), 
      'Please select a valid category'),
  brand: z.string()
    .min(1, 'Please select a brand')
    .refine(val => ['nike', 'adidas', 'puma', 'levi', 'zara', 'h&m', 'coofandy', 'J.VER'].includes(val), 
      'Please select a valid brand'),
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999.99, 'Price must be less than $999,999.99'),
  salePrice: z.number()
    .min(0, 'Sale price must be 0 or greater')
    .max(999999.99, 'Sale price must be less than $999,999.99')
    .optional()
    .or(z.literal(0)),
  totalStock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(99999, 'Stock must be less than 100,000')
});

// Review validation schema
export const reviewSchema = z.object({
  reviewMessage: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters'),
  reviewValue: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars')
});

// Legacy registration schema (for non-Auth0 users)
export const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  userName: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(usernameRegex, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
    .toLowerCase(),
  phone: z.string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  country: z.string()
    .min(2, 'Please select a country')
    .max(100, 'Country name is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required')
});

// Input field hints for better user experience
export const fieldHints = {
  // Profile form hints
  firstName: "Enter your first name (e.g., John, Mary-Jane, O'Connor)",
  lastName: "Enter your last name (e.g., Smith, Johnson-Wilson, D'Angelo)",
  userName: "Choose a unique username (e.g., john_doe, user123, my_username)",
  email: "Enter your email address (e.g., john.doe@example.com)",
  phone: "Enter your phone number (e.g., +1234567890, 1234567890)",
  country: "Select your country from the dropdown",
  
  // Address form hints
  address: "Enter your full address (e.g., 123 Main St, Apt 4B)",
  city: "Enter your city name (e.g., New York, Los Angeles, London)",
  pincode: "Enter your postal/ZIP code (e.g., 12345, 90210, SW1A 1AA)",
  
  // Product form hints
  title: "Enter product title (e.g., Men's Cotton T-Shirt)",
  description: "Describe the product features and details",
  price: "Enter price in dollars (e.g., 29.99, 150.00)",
  category: "Select product category",
  brand: "Enter brand name (e.g., Nike, Adidas, Zara)",
  stock: "Enter available quantity (e.g., 100, 50)",
  
  // Review form hints
  reviewValue: "Rate the product from 1 to 5 stars",
  reviewMessage: "Share your experience with this product"
};

// Input sanitization function
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/&/g, '&amp;') // Escape ampersands
    .replace(/"/g, '&quot;') // Escape quotes
    .replace(/'/g, '&#x27;') // Escape apostrophes
    .replace(/\//g, '&#x2F;'); // Escape forward slashes
};

// Validation helper functions
export const validateField = (schema, fieldName, value) => {
  try {
    const fieldSchema = schema.shape[fieldName];
    if (!fieldSchema) return { isValid: true, error: null };
    
    fieldSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    // Handle different types of validation errors
    if (error.errors && error.errors.length > 0) {
      return { isValid: false, error: error.errors[0].message };
    } else if (error.message) {
      return { isValid: false, error: error.message };
    } else {
      return { isValid: false, error: 'Invalid input' };
    }
  }
};

export const validateForm = (schema, data) => {
  try {
    const result = schema.parse(data);
    return { isValid: true, data: result, errors: null };
  } catch (error) {
    const errors = {};
    
    // Handle different types of validation errors
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach(err => {
        if (err.path && err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      });
    } else if (error.message) {
      // If it's a simple error without the errors array, use the message
      errors.general = error.message;
    } else {
      // Fallback for unknown error types
      errors.general = 'Validation failed';
    }
    
    return { isValid: false, data: null, errors };
  }
};

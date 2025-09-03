/**
 * Server-side input validation utilities
 * Provides comprehensive validation for all user inputs
 */

// Email validation with security considerations
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  // Remove whitespace
  email = email.trim();

  // Check length
  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  if (email.length < 3) {
    return { valid: false, error: 'Email is too short' };
  }

  // Check format
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  // Additional security checks
  if (email.includes('..')) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (email.startsWith('.') || email.endsWith('.')) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

// Password validation with security requirements
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  // Check length
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (maximum 128 characters)' };
  }

  // Check for common weak patterns
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'password123', 
    'admin', 'letmein', 'welcome', '123456789', 'password1'
  ];

  if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
    return { valid: false, error: 'Password contains common patterns and is not secure' };
  }

  // Check complexity
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const complexityCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (complexityCount < 3) {
    return { 
      valid: false, 
      error: 'Password must contain at least 3 of: lowercase, uppercase, numbers, special characters' 
    };
  }

  // Determine strength
  let strength = 'weak';
  if (complexityCount === 4 && password.length >= 12) {
    strength = 'strong';
  } else if (complexityCount >= 3 && password.length >= 10) {
    strength = 'medium';
  }

  return { valid: true, strength };
}

// Username validation
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  username = username.trim();

  // Check length
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 30) {
    return { valid: false, error: 'Username must be no more than 30 characters long' };
  }

  // Check format (alphanumeric, underscore, hyphen only)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  // Check for reserved words
  const reservedWords = [
    'admin', 'administrator', 'root', 'system', 'api', 'www', 'mail', 'ftp',
    'test', 'demo', 'guest', 'anonymous', 'null', 'undefined', 'support'
  ];

  if (reservedWords.includes(username.toLowerCase())) {
    return { valid: false, error: 'This username is reserved and cannot be used' };
  }

  return { valid: true };
}

// Display name validation
export function validateDisplayName(displayName: string): { valid: boolean; error?: string } {
  if (!displayName || typeof displayName !== 'string') {
    return { valid: false, error: 'Display name is required' };
  }

  displayName = displayName.trim();

  // Check length
  if (displayName.length < 1) {
    return { valid: false, error: 'Display name cannot be empty' };
  }

  if (displayName.length > 50) {
    return { valid: false, error: 'Display name must be no more than 50 characters long' };
  }

  // Check for inappropriate content (basic)
  const inappropriateWords = ['admin', 'system', 'root', 'null', 'undefined'];
  if (inappropriateWords.some(word => displayName.toLowerCase().includes(word))) {
    return { valid: false, error: 'Display name contains inappropriate content' };
  }

  // Check for excessive special characters
  const specialCharCount = (displayName.match(/[^a-zA-Z0-9\s]/g) || []).length;
  if (specialCharCount > displayName.length * 0.3) {
    return { valid: false, error: 'Display name contains too many special characters' };
  }

  return { valid: true };
}

// URL validation for redirects and profile links
export function validateUrl(url: string, allowedDomains: string[] = []): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  url = url.trim();

  // Check if it's a relative URL (starts with /)
  if (url.startsWith('/')) {
    // Relative URLs are generally safe
    if (url.length > 2000) {
      return { valid: false, error: 'URL is too long' };
    }
    return { valid: true };
  }

  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Check domain if allowedDomains is provided
    if (allowedDomains.length > 0) {
      const hostname = urlObj.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      
      if (!isAllowed) {
        return { valid: false, error: 'URL domain is not allowed' };
      }
    }

    // Check length
    if (url.length > 2000) {
      return { valid: false, error: 'URL is too long' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// File validation for uploads
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File cannot be empty' };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Only image files are allowed' };
  }

  // Check specific image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }

  // Check filename
  if (file.name.length > 255) {
    return { valid: false, error: 'Filename is too long' };
  }

  // Check for dangerous extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs'];
  const fileName = file.name.toLowerCase();
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: 'File type is not allowed' };
  }

  return { valid: true };
}

// Generic text input validation
export function validateTextInput(
  text: string, 
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    allowHtml?: boolean;
    fieldName?: string;
  } = {}
): { valid: boolean; error?: string; sanitized?: string } {
  const {
    required = false,
    minLength = 0,
    maxLength = 1000,
    allowHtml = false,
    fieldName = 'Input'
  } = options;

  if (!text || typeof text !== 'string') {
    if (required) {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true, sanitized: '' };
  }

  // Trim whitespace
  let sanitized = text.trim();

  // Check length
  if (sanitized.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters long` };
  }

  if (sanitized.length > maxLength) {
    return { valid: false, error: `${fieldName} must be no more than ${maxLength} characters long` };
  }

  // HTML handling
  if (!allowHtml) {
    // Remove HTML tags for security
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Check for null bytes and other dangerous characters
  if (sanitized.includes('\0')) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }

  return { valid: true, sanitized };
}

// Rate limit validation helper
export function validateRateLimit(identifier: string, action: string): { allowed: boolean; error?: string } {
  // This would integrate with the existing rate limit system
  // For now, return a basic validation
  if (!identifier || !action) {
    return { allowed: false, error: 'Invalid rate limit parameters' };
  }

  return { allowed: true };
}

// Comprehensive form validation
export function validateRegistrationForm(data: {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error!;
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error!;
  }

  // Validate password confirmation
  if (data.confirmPassword !== undefined) {
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  // Validate display name if provided
  if (data.displayName) {
    const displayNameValidation = validateDisplayName(data.displayName);
    if (!displayNameValidation.valid) {
      errors.displayName = displayNameValidation.error!;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Login form validation
export function validateLoginForm(data: {
  email: string;
  password: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Basic email validation (less strict for login)
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!data.email.includes('@')) {
    errors.email = 'Please enter a valid email address';
  }

  // Basic password validation (just check if present)
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 1) {
    errors.password = 'Password cannot be empty';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

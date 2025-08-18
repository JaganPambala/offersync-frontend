// Email validation with proper regex
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Phone number validation (Indian format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
  return phoneRegex.test(phone);
};

// Name validation
export const validateName = (name) => {
  const errors = [];
  
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (name.length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name can only contain letters and spaces');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Company name validation
export const validateCompanyName = (name) => {
  const errors = [];
  
  if (name.length < 2) {
    errors.push('Company name must be at least 2 characters long');
  }
  if (name.length > 100) {
    errors.push('Company name cannot exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// PAN validation
export const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Aadhaar validation
export const isValidAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

// Form field validation
export const validateField = (fieldName, value) => {
  switch (fieldName) {
    case 'pan':
      if (!value) {
        return { isValid: false, error: 'PAN number is required' };
      }
      return {
        isValid: isValidPAN(value),
        error: isValidPAN(value) ? '' : 'Please enter a valid 10-character PAN number (e.g., ABCDE1234F)'
      };
    
    case 'aadhaar':
      if (!value) return { isValid: true, error: '' }; // Aadhaar is optional
      return {
        isValid: isValidAadhaar(value),
        error: isValidAadhaar(value) ? '' : 'Please enter a valid 12-digit Aadhaar number'
      };

    case 'email':
      return {
        isValid: isValidEmail(value),
        error: isValidEmail(value) ? '' : 'Please enter a valid email address'
      };
    
    case 'password':
      const passwordValidation = validatePassword(value);
      return {
        isValid: passwordValidation.isValid,
        error: passwordValidation.isValid ? '' : passwordValidation.errors[0]
      };
    
    case 'phone':
      if (!value) return { isValid: true, error: '' }; // Phone is optional
      return {
        isValid: isValidPhone(value),
        error: isValidPhone(value) ? '' : 'Please enter a valid Indian phone number'
      };
    
    case 'name':
      const nameValidation = validateName(value);
      return {
        isValid: nameValidation.isValid,
        error: nameValidation.isValid ? '' : nameValidation.errors[0]
      };
    
    case 'companyName':
      const companyValidation = validateCompanyName(value);
      return {
        isValid: companyValidation.isValid,
        error: companyValidation.isValid ? '' : companyValidation.errors[0]
      };

    case 'city':
    case 'state':
      return {
        isValid: value.length >= 2,
        error: value.length >= 2 ? '' : `${fieldName} must be at least 2 characters long`
      };

    default:
      return { isValid: true, error: '' };
  }
}; 
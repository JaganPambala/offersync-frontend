import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Building, MapPin, Phone } from 'lucide-react'
import { useSelector, useDispatch } from "react-redux";
import { setSignupField, setAuthenticated } from "../../redux/slices/authSlice";
import { useSignupMutation } from '../../redux/api/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { navigationLinks } from '../../utils/constants';
import { validateField } from '../../utils/validation';
import FormError from '../../components/common/FormError';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signup = useSelector((state) => state.auth.signup);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({});

  const [signupMutation, { isLoading }] = useSignupMutation();

  // Validate field on change
  const validateFormField = (name, value) => {
    let validation = { isValid: true, error: '' };

    // Special validation for confirm password
    if (name === 'confirmPassword') {
      if (value !== signup.password) {
        validation = { isValid: false, error: 'Passwords do not match' };
      }
    } else {
      validation = validateField(name, value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: validation.error
    }));
    return validation.isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setSignupField({ field: name, value }));
    
    // Validate if field has been touched
    if (touched[name]) {
      validateFormField(name, value);
    }

    // Validate confirm password when password changes
    if (name === 'password' && touched.confirmPassword) {
      validateFormField('confirmPassword', signup.confirmPassword);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateFormField(name, value);
  };

  const validateForm = () => {
    const requiredFields = [
      'name',
      'email',
      'password',
      'confirmPassword',
      'whatsappNumber',
      'companyName',
      'industry',
      'companySize',
      'city',
      'state',
      'role'
    ];

    const newErrors = {};
    let isValid = true;

    // Validate all required fields
    requiredFields.forEach(field => {
      const value = signup[field];
      if (!value) {
        newErrors[field] = 'This field is required';
        isValid = false;
      } else {
        const validation = validateFormField(field, value);
        if (!validation) {
          isValid = false;
        }
      }
    });

    // Additional password match validation
    if (signup.password !== signup.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Mark all fields as touched
    const allFields = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      whatsappNumber: true,
      companyName: true,
      industry: true,
      companySize: true,
      city: true,
      state: true,
      role: true
    };
    setTouched(allFields);

    if (!validateForm()) {
      setFormError('Please fix all errors before submitting.');
      return;
    }

    try {
      const userDetails = {
        name: signup.name,
        email: signup.email,
        password: signup.password,
        whatsapp: {
          phoneNumber: signup.whatsappNumber
        },
        company: {
          name: signup.companyName,
          industry: signup.industry,
          size: signup.companySize,
          location: {
            city: signup.city,
            state: signup.state
          }
        },
        role: signup.role
      };

      await signupMutation(userDetails).unwrap();
      navigate(navigationLinks.login.path);
    } catch (err) {
      console.error("Signup error:", err);
      setFormError(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  // Clear form error when inputs change
  useEffect(() => {
    if (formError) {
      setFormError('');
    }
  }, [signup]);

  const companySizes = ['Startup', "Small", "Medium", "Large"];
  const hrRoles = ["HR Executive", "Senior HR", "HR Manager", "HR Director"];

  const renderInput = (name, label, type = 'text', placeholder = '', icon = null) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} *
      </label>
      <div className="mt-1 relative">
        <input
          type={type}
          id={name}
          name={name}
          required
          value={signup[name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`appearance-none block w-full px-3 py-2 border ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
            icon ? 'pl-10' : ''
          }`}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <FormError error={touched[name] && errors[name]} />
      </div>
    </div>
  );

  const renderSelect = (name, label, options) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} *
      </label>
      <select
        id={name}
        name={name}
        required
        value={signup[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`mt-1 block w-full border ${
          errors[name] ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <FormError error={touched[name] && errors[name]} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">OS</span>
            </div>
            <span className="ml-3 text-3xl font-bold text-gray-900">OfferSync</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your HR account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={navigationLinks.login.path} className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 card p-8">
          {formError && (
            <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
              <FormError error={formError} />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderInput('name', 'Full Name', 'text', 'Priya Sharma')}
                {renderInput('email', 'Email Address', 'email', 'priya@techcorpa.com')}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      value={signup.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`block w-full border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <FormError error={touched.password && errors.password} />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={signup.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`block w-full border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <FormError error={touched.confirmPassword && errors.confirmPassword} />
                  </div>
                </div>

                {renderInput('whatsappNumber', 'WhatsApp Number', 'tel', '+91-9876543210', <Phone className="h-5 w-5 text-gray-400" />)}
                {renderSelect('role', 'HR Role', hrRoles)}
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderInput('companyName', 'Company Name', 'text', 'TechCorpA', <Building className="h-5 w-5 text-gray-400" />)}
                {renderInput('industry', 'Industry', 'text', 'Technology')}
                {renderSelect('companySize', 'Company Size', companySizes)}
                {renderInput('city', 'City', 'text', 'Bangalore', <MapPin className="h-5 w-5 text-gray-400" />)}
                {renderInput('state', 'State', 'text', 'Karnataka', <MapPin className="h-5 w-5 text-gray-400" />)}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
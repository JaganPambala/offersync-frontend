import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFormField, resetForm, transformFormToBackend } from '../redux/slices/offerSlice';
import { useCreateOfferMutation } from '../redux/api/offerApiSlice';
import { navigationLinks } from '../utils/constants';
import { validateFormData } from '../redux/slices/offerSlice';

const OfferCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.offer.formData);
  const [createOffer, { isLoading }] = useCreateOfferMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    } else {
      finalValue = value;
    }

    dispatch(setFormField({
      field: name,
      value: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    const { isValid, errors } = validateFormData(formData);
    if (!isValid) {
      console.log('Errors:', errors);
      setError(errors);
      return;
    }

    try {
      const transformedData = transformFormToBackend(formData);
      console.log('Submitting data:', transformedData);
      const response = await createOffer(transformedData).unwrap();
      navigate(navigationLinks.offers.path);
    } catch (error) {
      console.error('Failed to create offer:', error);
      setError(error.data?.message || 'Failed to create offer. Please try again.');
    }
  };

  const formSteps = [
    {
      title: 'Personal Information',
      fields: [
        { 
          name: 'name', 
          label: 'Full Name', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'pan', 
          label: 'PAN Number', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'aadhaar', 
          label: 'Aadhaar Number', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'email', 
          label: 'Email', 
          type: 'email', 
          required: true 
        },
        { 
          name: 'phone', 
          label: 'Phone', 
          type: 'tel', 
          required: true 
        },
        { 
          name: 'whatsappNumber', 
          label: 'WhatsApp Number', 
          type: 'tel' 
        }
      ]
    },
    {
      title: 'Location',
      fields: [
        { 
          name: 'cityLocation', 
          label: 'City', 
          type: 'text' 
        },
        { 
          name: 'stateLocation', 
          label: 'State', 
          type: 'text' 
        },
        { 
          name: 'countryLocation', 
          label: 'Country', 
          type: 'text',
          defaultValue: 'India',
          disabled: true 
        }
      ]
    },
    {
      title: 'Professional Profile',
      fields: [
        { 
          name: 'currentCompany', 
          label: 'Current Company', 
          type: 'text' 
        },
        { 
          name: 'currentRole', 
          label: 'Current Role', 
          type: 'text' 
        },
        { 
          name: 'totalExperience', 
          label: 'Total Experience (months)', 
          type: 'number',
          min: 0 
        },
        { 
          name: 'skills', 
          label: 'Skills (comma-separated)', 
          type: 'text',
          placeholder: 'e.g., JavaScript, React, Node.js' 
        },
        { 
          name: 'salaryRangeMin', 
          label: 'Current Salary - Minimum', 
          type: 'number',
          min: 0 
        },
        { 
          name: 'salaryRangeMax', 
          label: 'Current Salary - Maximum', 
          type: 'number',
          min: 0 
        },
        { 
          name: 'noticePeriod', 
          label: 'Notice Period (days)', 
          type: 'number',
          min: 0,
          defaultValue: 30 
        },
        { 
          name: 'immediateJoiner', 
          label: 'Immediate Joiner', 
          type: 'checkbox' 
        }
      ]
    },
    {
      title: 'Position & Compensation',
      fields: [
        { 
          name: 'positionTitle', 
          label: 'Position Title', 
          type: 'text',
          required: true 
        },
        { 
          name: 'positionLevel', 
          label: 'Position Level', 
          type: 'select',
          options: ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director'],
          defaultValue: 'Mid' 
        },
        { 
          name: 'baseCompensation', 
          label: 'Base Salary', 
          type: 'number',
          required: true,
          min: 0 
        },
        { 
          name: 'variableCompensation', 
          label: 'Variable Pay', 
          type: 'number',
          min: 0 
        },
        { 
          name: 'stocksCompensation', 
          label: 'Stocks Value', 
          type: 'number',
          min: 0 
        },
        { 
          name: 'bonusCompensation', 
          label: 'Bonus', 
          type: 'number',
          min: 0 
        },
        { 
          name: 'compensationCurrency', 
          label: 'Currency', 
          type: 'text',
          defaultValue: 'INR',
          disabled: true 
        }
      ]
    },
    {
      title: 'Timeline',
      fields: [
        { 
          name: 'validTill', 
          label: 'Valid Till', 
          type: 'date',
          required: true 
        },
        { 
          name: 'expectedJoinDate', 
          label: 'Expected Join Date', 
          type: 'date' 
        },
        { 
          name: 'followUpDate', 
          label: 'Follow Up Date', 
          type: 'date' 
        }
      ]
    },
    {
      title: 'Status & Competition',
      fields: [
        { 
          name: 'status', 
          label: 'Status', 
          type: 'select',
          options: ['DRAFT', 'ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN', 'ON_HOLD', 'JOINED'],
          defaultValue: 'DRAFT' 
        },
        { 
          name: 'priority', 
          label: 'Priority', 
          type: 'select',
          options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
          defaultValue: 'MEDIUM' 
        },
        { 
          name: 'isCompetitive', 
          label: 'Is Competitive?', 
          type: 'checkbox' 
        },
        { 
          name: 'competitorCount', 
          label: 'Number of Competitors', 
          type: 'number',
          min: 0,
          show: formData => formData.isCompetitive 
        },
        { 
          name: 'marketRank', 
          label: 'Market Rank', 
          type: 'select',
          options: ['LEADING', 'COMPETITIVE', 'BELOW_MARKET'],
          defaultValue: 'COMPETITIVE',
          show: formData => formData.isCompetitive 
        },
        { 
          name: 'collaborationNeeded', 
          label: 'Collaboration Needed', 
          type: 'checkbox',
          show: formData => formData.isCompetitive 
        }
      ]
    },
    {
      title: 'Consent',
      fields: [
        { 
          name: 'consentDataSharing', 
          label: 'Consent to Data Sharing', 
          type: 'checkbox' 
        },
        { 
          name: 'consentWhatsapp', 
          label: 'Consent to WhatsApp Contact', 
          type: 'checkbox' 
        },
        { 
          name: 'consentMarketing', 
          label: 'Consent to Marketing Emails', 
          type: 'checkbox' 
        }
      ]
    }
  ];

  const renderField = (field) => {
    const value = formData[field.name] ?? ''; // Use nullish coalescing to default to empty string

    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          name={field.name}
          value={value}
          onChange={handleInputChange}
          required={field.required}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          id={field.name}
          name={field.name}
          checked={!!value} // Convert to boolean
          onChange={handleInputChange}
          required={field.required}
          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      );
    }

    return (
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleInputChange}
        required={field.required}
        min={field.min}
        max={field.max}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Offer</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {formSteps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center ${
                index === activeStep ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index === activeStep ? 'bg-primary-100 text-primary-600' : 'bg-gray-100'}
              `}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Step Fields */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">{formSteps[activeStep].title}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {formSteps[activeStep].fields.map((field) => (
              field.show === undefined || field.show(formData) ? (
                <div key={field.name}>
                  <label 
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                  {field.helperText && (
                    <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                  )}
                </div>
              ) : null
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setActiveStep(prev => prev - 1)}
            disabled={activeStep === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          
          {activeStep === formSteps.length - 1 ? (
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Creating...' : 'Create Offer'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveStep(prev => prev + 1)}
              className="btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OfferCreate; 
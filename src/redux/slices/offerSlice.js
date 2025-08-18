import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    // Personal Info
    name: '',
    pan: '',
    aadhaar: '',
    email: '',
    phone: '',
    whatsappNumber: '',

    // Location
    cityLocation: '',
    stateLocation: '',
    countryLocation: 'India',

    // Professional Profile
    currentCompany: '',
    currentRole: '',
    totalExperience: '',  // Changed from 0 to ''
    skills: [],
    salaryRangeMin: '',  // Changed from 0 to ''
    salaryRangeMax: '',  // Changed from 0 to ''
    noticePeriod: '',    // Changed from 0 to ''
    immediateJoiner: false,

    // Position
    positionTitle: '',
    positionLevel: 'Mid',

    // Compensation
    baseCompensation: '',    // Changed from 0 to ''
    variableCompensation: '', // Changed from 0 to ''
    stocksCompensation: '',   // Changed from 0 to ''
    bonusCompensation: '',    // Changed from 0 to ''
    compensationCurrency: 'INR',

    // Timeline
    validTill: '',
    expectedJoinDate: '',
    followUpDate: '',

    // Status & Priority
    status: 'DRAFT',
    priority: 'MEDIUM',

    // Competition
    isCompetitive: false,
    competitorCount: '',  // Changed from 0 to ''
    marketRank: 'COMPETITIVE',
    collaborationNeeded: false,

    // Consent
    consentDataSharing: false,
    consentWhatsapp: false,
    consentMarketing: false,

    // Tags
    tags: '',  // Changed from [] to ''
  },
  error: null,
  isLoading: false,
};

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setFormField,
  resetForm,
  setError,
  setLoading,
} = offerSlice.actions;

export const transformFormToBackend = (formData) => {
  const toNumber = (value) => value === '' ? 0 : Number(value);
  
  return {
    // Personal Info
    name: formData.name?.trim(),
    pan: formData.pan,
    aadhaar: formData.aadhaar,
    email: formData.email?.toLowerCase(),
    phone: formData.phone,
    whatsappNumber: formData.whatsappNumber,

    // Location
    location: {
      city: formData.cityLocation,
      state: formData.stateLocation,
      country: formData.countryLocation || 'India'
    },

    // Professional Profile
    currentCompany: formData.currentCompany || '',
    currentRole: formData.currentRole || '',
    totalExperience: toNumber(formData.totalExperience),
    skills: typeof formData.skills === 'string' ? 
      (formData.skills ? formData.skills.split(',').map(s => s.trim()) : []) : 
      (formData.skills || []),
    salaryRange: {
      min: toNumber(formData.salaryRangeMin),
      max: toNumber(formData.salaryRangeMax)
    },
    noticePeriod: toNumber(formData.noticePeriod) || 30,
    immediateJoiner: Boolean(formData.immediateJoiner),

    // Position
    position: {
      title: formData.positionTitle,
      level: formData.positionLevel || 'Mid'
    },

    // Compensation
    compensation: {
      base: toNumber(formData.baseCompensation),
      variable: toNumber(formData.variableCompensation),
      stocks: toNumber(formData.stocksCompensation),
      bonus: toNumber(formData.bonusCompensation),
      currency: formData.compensationCurrency || 'INR'
    },

    // Timeline
    timeline: {
      offerDate: new Date().toISOString(),
      validTill: formData.validTill,
      expectedJoinDate: formData.expectedJoinDate,
      followUpDate: formData.followUpDate
    },

    // Status & Priority
    status: formData.status || 'DRAFT',
    priority: formData.priority || 'MEDIUM',

    // Competition
    competition: {
      isCompetitive: Boolean(formData.isCompetitive),
      competitorCount: toNumber(formData.competitorCount),
      marketRank: formData.marketRank || 'COMPETITIVE',
      collaborationNeeded: Boolean(formData.collaborationNeeded)
    },

    // Consent
    consent: {
      dataSharing: Boolean(formData.consentDataSharing),
      whatsappContact: Boolean(formData.consentWhatsapp),
      marketingEmails: Boolean(formData.consentMarketing),
      consentDate: new Date().toISOString()
    }
  };
};

// Helper function to validate the form data
export const validateFormData = (formData) => {
  const errors = {};

  // Required fields validation
  const requiredFields = [
    'name',
    'pan',
    'aadhaar',
    'email',
    'phone',
    'positionTitle',
    'baseCompensation',
    'validTill'
  ];

  requiredFields.forEach(field => {
    if (!formData[field]) {
      errors[field] = 'This field is required';
    }
  });

  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Name length validation
  if (formData.name && formData.name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Numeric validations
  if (formData.totalExperience && formData.totalExperience < 0) {
    errors.totalExperience = 'Experience cannot be negative';
  }

  if (formData.noticePeriod && formData.noticePeriod < 0) {
    errors.noticePeriod = 'Notice period cannot be negative';
  }

  // Salary range validation
  if (Number(formData.salaryRangeMin) > Number(formData.salaryRangeMax)) {
    errors.salaryRangeMin = 'Minimum salary cannot be greater than maximum salary';
  }

  // Date validations
  const now = new Date();
  if (formData.validTill && new Date(formData.validTill) < now) {
    errors.validTill = 'Valid till date cannot be in the past';
  }

  if (formData.expectedJoinDate && new Date(formData.expectedJoinDate) < now) {
    errors.expectedJoinDate = 'Expected join date cannot be in the past';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default offerSlice.reducer; 
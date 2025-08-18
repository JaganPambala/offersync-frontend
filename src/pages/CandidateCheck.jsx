import React, { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, MessageCircle, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { useCheckForCandidateMutation } from '../redux/api/candidateApiSlice';
import { setCandidateFormField, setCandidateCheckResult, clearCandidateCheckResult } from '../redux/slices/candidateSlice';
import { useNavigate } from 'react-router-dom';
import { navigationLinks } from '../utils/constants';
import { validateField } from '../utils/validation';
import FormError from '../components/common/FormError';

const CandidateCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.candidate.formData);
  const { message, hasDuplicates, candidates, recommendations } = useSelector((state) => state.candidate);
  const [checkForCandidate, { error: apiError, isLoading: apiLoading }] = useCheckForCandidateMutation();
  const [isChecking, setIsChecking] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Validate field on change
  const validateFormField = (name, value) => {
    const validation = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: validation.error
    }));
    return validation.isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCandidateFormField({ field: name, value }));
    
    // Validate if field has been touched
    if (touched[name]) {
      validateFormField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateFormField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // PAN is required
    const panValidation = validateField('pan', formData.pan);
    if (!panValidation.isValid) {
      newErrors.pan = panValidation.error;
      isValid = false;
    }

    // Optional fields - validate only if they have values
    if (formData.aadhaar) {
      const aadhaarValidation = validateField('aadhaar', formData.aadhaar);
      if (!aadhaarValidation.isValid) {
        newErrors.aadhaar = aadhaarValidation.error;
        isValid = false;
      }
    }

    if (formData.email) {
      const emailValidation = validateField('email', formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error;
        isValid = false;
      }
    }

    if (formData.phone) {
      const phoneValidation = validateField('phone', formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Mark all fields as touched
    setTouched({
      pan: true,
      aadhaar: true,
      email: true,
      phone: true
    });

    if (!validateForm()) {
      setFormError('Please fix all errors before submitting.');
      return;
    }

    setIsChecking(true);
    // Clear previous results
    dispatch(clearCandidateCheckResult());
    
    try {
      const response = await checkForCandidate(formData).unwrap();
      // Add delay for UI feedback
      await delay(600);
      dispatch(setCandidateCheckResult(response));
    } catch (err) {
      console.error("Error checking candidate:", err);
      setFormError(err?.data?.message || "Failed to check candidate. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const isBusy = isChecking || apiLoading;

  const generateWhatsAppLink = (hr, candidateName) => {
    const name = hr?.name || 'HR';
    const number = hr?.whatsapp || '';
    const message = `Hi ${name}! I'm from TechCorpA. I see we both have offers for ${candidateName ?? 'the candidate'}. Can we coordinate timing?`;
    return `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderInput = (id, label, type = 'text', placeholder = '', required = false) => (
    <div key={id}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        value={formData[id] || ''}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`mt-1 block w-full border ${
          errors[id] ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
      />
      <FormError error={touched[id] && errors[id]} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidate Check</h1>
        <p className="mt-1 text-sm text-gray-500">
          Verify candidate information and check for duplicate offers
        </p>
      </div>

      {/* API Error Handling */}
      {(apiError || formError) && (
        <div className="card p-4 border-red-200 bg-red-50 mb-4">
          <FormError error={formError || apiError?.data?.message || apiError?.error || 'Unknown error'} />
        </div>
      )}

      {/* Search Form */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {renderInput('pan', 'PAN Number', 'text', 'ABCDE1234F', true)}
            {renderInput('aadhaar', 'Aadhaar Number', 'text', '123456789012')}
            {renderInput('email', 'Email', 'email', 'candidate@email.com')}
            {renderInput('phone', 'Phone Number', 'tel', '+91-9876543210')}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isBusy || !formData.pan}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {isBusy ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Checking...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Candidate
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results - New Candidate (no duplicates) */}
      {hasDuplicates === false && (
        <div className="card p-6 border-green-200 bg-green-50">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">New Candidate - All Clear!</h3>
              <p className="mt-2 text-sm text-green-700">{message || 'No duplicates found. Safe to proceed with offer.'}</p>
              <div className="mt-4">
                <button 
                  onClick={() => navigate(navigationLinks.offerCreate.path)} 
                  className="btn-primary"
                >
                  Create Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results - Duplicate Candidates */}
      {hasDuplicates === true && candidates?.length > 0 && (
        <div className="space-y-6">
          {/* Alert */}
          <div className="card p-6 border-yellow-200 bg-yellow-50">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Duplicate Candidate Found</h3>
                <p className="mt-2 text-sm text-yellow-700">{message}</p>
              </div>
            </div>
          </div>

          {/* Candidate Profiles */}
          {candidates.map((candidateData) => (
            <div key={candidateData.candidate.id} className="space-y-6">
              {/* Candidate Profile */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Profile</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{candidateData.candidate.name}</h4>
                      <p className="text-sm text-gray-500">
                        {candidateData.candidate.currentRole} at {candidateData.candidate.currentCompany}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Experience: {candidateData.candidate.totalExperience} year(s)
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {candidateData.candidate.location.city}, {candidateData.candidate.location.state}
                      </p>
                    </div>
                    <span className="badge-warning">{candidateData.candidate.status}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidateData.candidate.skills.map((skill) => (
                      <span key={skill} className="badge-info">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Existing Offers */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Existing Offers ({candidateData.metrics.totalOffers})
                </h3>
                <div className="space-y-4">
                  {candidateData.existingOffers.map((offer) => (
                    <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-gray-900">{offer.hr.company}</h4>
                            <span className="badge-success">{offer.status}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{offer.position.title}</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatCurrency(offer.compensation.total)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Base: {formatCurrency(offer.compensation.base)} | 
                            Variable: {formatCurrency(offer.compensation.variable)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{offer.hr.name}</div>
                          <div className="text-xs text-gray-400">{offer.hr.whatsapp}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <a
                          href={generateWhatsAppLink(offer.hr, candidateData.candidate.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp text-sm px-3 py-1"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp {offer.hr.name}
                        </a>
                        <button className="btn-secondary text-sm px-3 py-1">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        recommendation.type === 'INFO' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {recommendation.type === 'INFO' ? (
                          <MessageCircle className="h-5 w-5 text-blue-500 mr-3" />
                        ) : (
                          <Users className="h-5 w-5 text-gray-500 mr-3" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            recommendation.type === 'INFO' ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {recommendation.message}
                          </p>
                        </div>
                      </div>
                      {recommendation.action === 'WHATSAPP_COORDINATION' && recommendation.hrContacts?.length > 0 && (
                        <button className="btn-whatsapp text-sm">Start Group Chat</button>
                      )}
                      {recommendation.action === 'COMPETITIVE_OFFER' && (
                        <button 
                          onClick={() => navigate(`/candidate/${candidateData.candidate.id}/offer`)}
                          className="btn-secondary text-sm"
                        >
                          Create Competitive Offer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateCheck;

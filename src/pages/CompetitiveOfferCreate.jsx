import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFormField, resetForm } from '../redux/slices/offerSlice';
import { useCreateCompetitiveOfferMutation } from '../redux/api/offerApiSlice';

const CompetitiveOfferCreate = () => {
  const { id: candidateId } = useParams(); // Get candidateId from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.offer.formData);
  const [createCompetitiveOffer, { isLoading }] = useCreateCompetitiveOfferMutation();

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue;

    if (type === 'number') {
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
    try {
      const offerData = {
        position: {
          title: formData.positionTitle,
          level: formData.positionLevel
        },
        compensation: {
          base: Number(formData.baseCompensation),
          variable: Number(formData.variableCompensation),
          stocks: Number(formData.stocksCompensation),
          bonus: Number(formData.bonusCompensation),
          currency: formData.compensationCurrency || 'INR'
        },
        timeline: {
          validTill: formData.validTill,
          expectedJoinDate: formData.expectedJoinDate,
          followUpDate: formData.followUpDate
        },
        priority: formData.priority || 'HIGH',
      };

      await createCompetitiveOffer({
        candidateId,
        data: offerData
      }).unwrap();

      dispatch(resetForm());
      navigate('/offers'); // Navigate back to offers list after success
    } catch (error) {
      console.error('Failed to create competitive offer:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Competitive Offer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a competitive offer based on market conditions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Position Details */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Position Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="positionTitle"
                value={formData.positionTitle || ''}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position Level
              </label>
              <select
                name="positionLevel"
                value={formData.positionLevel || 'Mid'}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Compensation Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Salary
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="baseCompensation"
                value={formData.baseCompensation || ''}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Variable Pay
              </label>
              <input
                type="number"
                name="variableCompensation"
                value={formData.variableCompensation || ''}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stocks Value
              </label>
              <input
                type="number"
                name="stocksCompensation"
                value={formData.stocksCompensation || ''}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bonus
              </label>
              <input
                type="number"
                name="bonusCompensation"
                value={formData.bonusCompensation || ''}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Timeline</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valid Till
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="validTill"
                value={formData.validTill || ''}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expected Join Date
              </label>
              <input
                type="date"
                name="expectedJoinDate"
                value={formData.expectedJoinDate || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Follow Up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority || 'HIGH'}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Creating...' : 'Create Competitive Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompetitiveOfferCreate; 
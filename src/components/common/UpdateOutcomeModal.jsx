import React, { useState } from 'react';
import { Calendar, X, CheckCircle, Clock } from 'lucide-react';

const UpdateOutcomeModal = ({ communication, onClose, onSubmit }) => {
  const [outcomeType, setOutcomeType] = useState('');
  const [formData, setFormData] = useState({
    postponedOfferId: '',
    withdrawnOfferId: '',
    newJoinDate: '',
    reason: '',
    description: '',
    actions: ['Company A to get candidate response by [date]', 'Company B will hold offer until [date]']
  });

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Example offer data structure
  const offers = [
    {
      id: '1',
      company: 'Your Company',
      position: 'Software Engineer',
      expectedJoinDate: '2024-03-01',
      salary: '₹15,00,000'
    },
    {
      id: '2',
      company: communication.otherParty.company,
      position: 'Software Engineer',
      expectedJoinDate: '2024-03-15',
      salary: '₹16,00,000'
    }
  ];

  const OfferCard = ({ offer, isSelected, onSelect }) => (
    <div 
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className={`w-4 h-4 rounded-full border-2 ${
            isSelected 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-300'
          }`}>
            {isSelected && (
              <CheckCircle className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{offer.company}</div>
          <div className="text-sm text-gray-600">{offer.position}</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Join Date: {formatDate(offer.expectedJoinDate)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              CTC: {offer.salary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Outcome</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            type: outcomeType,
            ...formData
          });
        }} className="space-y-6">
          {/* Outcome Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Outcome Type
            </label>
            <select
              value={outcomeType}
              onChange={(e) => setOutcomeType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select type...</option>
              <option value="TIMELINE_AGREED">Timeline Agreement</option>
              <option value="CANDIDATE_WITHDREW">Candidate Withdrawal</option>
            </select>
          </div>

          {outcomeType === 'TIMELINE_AGREED' && (
            <>
              {/* Timeline Agreement Form Fields */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select offer to postpone
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      isSelected={formData.postponedOfferId === offer.id}
                      onSelect={() => setFormData({
                        ...formData,
                        postponedOfferId: offer.id
                      })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Join Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.newJoinDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      newJoinDate: e.target.value
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </>
          )}

          {outcomeType === 'CANDIDATE_WITHDREW' && (
            <>
              {/* Withdrawn Offer Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select withdrawn offer
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      isSelected={formData.withdrawnOfferId === offer.id}
                      onSelect={() => setFormData({
                        ...formData,
                        withdrawnOfferId: offer.id
                      })}
                    />
                  ))}
                </div>
              </div>

              {/* Withdrawal Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Reason
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({
                    ...formData,
                    reason: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select reason...</option>
                  <option value="accepted_other">Accepted other offer</option>
                  <option value="better_opportunity">Better opportunity elsewhere</option>
                  <option value="personal">Personal reasons</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Withdrawal Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    description: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Provide additional details about the withdrawal..."
                  required
                />
              </div>
            </>
          )}

          {/* Common Description Field */}
          {outcomeType === 'TIMELINE_AGREED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agreement Details
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({
                  ...formData,
                  description: e.target.value
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Describe the timeline agreement details..."
                required
              />
            </div>
          )}

          {/* Action Items (only for Timeline Agreement) */}
          {outcomeType === 'TIMELINE_AGREED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Items
              </label>
              <div className="space-y-3">
                {formData.actions.map((action, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={action}
                      onChange={(e) => {
                        const newActions = [...formData.actions];
                        newActions[index] = e.target.value;
                        setFormData({
                          ...formData,
                          actions: newActions
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter action item..."
                    />
                    {index === formData.actions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          actions: [...formData.actions, '']
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!outcomeType}
            >
              Update Outcome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOutcomeModal; 
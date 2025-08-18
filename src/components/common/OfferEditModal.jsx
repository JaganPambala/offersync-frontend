import React, { useState } from 'react'
import { X, Calendar } from 'lucide-react'

const OfferEditModal = ({ offer, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: offer?.status || 'ON_HOLD',
    validTill: offer?.timeline?.validTill?.split('T')[0] || '',
    followUpDate: offer?.timeline?.followUpDate?.split('T')[0] || '',
  })

  const statusOptions = [
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'EXPIRED', label: 'Expired' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate({
      id: offer.id,
      status: formData.status,
      timeline: {
        validTill: formData.validTill,
        followUpDate: formData.followUpDate
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Offer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900">{offer.position.title}</h3>
          <p className="text-sm text-gray-500">{offer.position.level}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valid Till</label>
            <div className="mt-1 relative">
              <input
                type="date"
                value={formData.validTill}
                onChange={(e) => setFormData(prev => ({ ...prev, validTill: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Follow Up Date</label>
            <div className="mt-1 relative">
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OfferEditModal 
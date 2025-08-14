import React, { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, MessageCircle, ExternalLink, Users } from 'lucide-react'
import { candidateData } from '../data/sampleData'

const CandidateCheck = () => {
  const [formData, setFormData] = useState({
    pan: '',
    aadhaar: '',
    email: '',
    phone: ''
  })
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<'none' | 'new' | 'duplicate'>('none')

  const handleSubmit = async () => {
    e.preventDefault()
    setIsChecking(true)
    
    // Simulate API call
    setTimeout(() => {
      // Demo: Show duplicate if PAN is "ABCDE1234F"
      if (formData.pan === 'ABCDE1234F') {
        setCheckResult('duplicate')
      } else {
        setCheckResult('new')
      }
      setIsChecking(false)
    }, 1500)
  }

  const handleInputChange = () => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateWhatsAppLink = (hrContact) => {
    const message = `Hi ${hrContact.name}! I'm from TechCorpA. I see we both have offers for ${candidateData.duplicateCandidate.name}. Can we coordinate timing?`
    return `https://wa.me/${hrContact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidate Check</h1>
        <p className="mt-1 text-sm text-gray-500">
          Verify candidate information and check for duplicate offers
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                PAN Number *
              </label>
              <input
                type="text"
                id="pan"
                name="pan"
                required
                value={formData.pan}
                onChange={handleInputChange}
                placeholder="ABCDE1234F"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Try "ABCDE1234F" to see duplicate detection</p>
            </div>

            <div>
              <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                Aadhaar Number
              </label>
              <input
                type="text"
                id="aadhaar"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                placeholder="123456789012"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="candidate@email.com"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91-9876543210"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChecking || !formData.pan}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {isChecking ? (
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

      {/* Results */}
      {checkResult === 'new' && (
        <div className="card p-6 border-green-200 bg-green-50">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">New Candidate - All Clear!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>No duplicate offers found. You can proceed with creating an offer.</p>
              </div>
              <div className="mt-4">
                <button className="btn-primary">
                  Create Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {checkResult === 'duplicate' && (
        <div className="space-y-6">
          {/* Alert */}
          <div className="card p-6 border-yellow-200 bg-yellow-50">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Duplicate Candidate Found</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This candidate has existing offers. Consider coordination with other HRs before proceeding.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Profile */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Profile</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{candidateData.duplicateCandidate.name}</h4>
                  <p className="text-sm text-gray-500">
                    {candidateData.duplicateCandidate.profile.currentRole} at {candidateData.duplicateCandidate.profile.currentCompany}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Experience: {candidateData.duplicateCandidate.profile.totalExperience} months
                  </p>
                </div>
                <span className="badge-warning">
                  {candidateData.duplicateCandidate.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {candidateData.duplicateCandidate.profile.skills.map((skill) => (
                    <span key={skill} className="badge-info">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Expected Salary: ₹{candidateData.duplicateCandidate.profile.salaryRange.min.toLocaleString()} - ₹{candidateData.duplicateCandidate.profile.salaryRange.max.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Existing Offers */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Offers ({candidateData.duplicateCandidate.existingOffers.length})</h3>
            <div className="space-y-4">
              {candidateData.duplicateCandidate.existingOffers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{offer.company}</h4>
                        <span className="badge-success">{offer.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{offer.position}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        ₹{offer.compensation.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{offer.hrContact.name}</div>
                      <div className="text-xs text-gray-400">{offer.hrContact.whatsappNumber}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <a
                      href={generateWhatsAppLink(offer.hrContact)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp text-sm px-3 py-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp {offer.hrContact.name}
                    </a>
                    <button className="btn-secondary text-sm px-3 py-1">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Coordinate with Other HRs</p>
                    <p className="text-sm text-blue-700">Start WhatsApp discussion to avoid candidate confusion</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-whatsapp text-sm">
                    Start Group Chat
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Create Competitive Offer</p>
                    <p className="text-sm text-gray-600">Proceed anyway with a competitive package</p>
                  </div>
                </div>
                <button className="btn-secondary text-sm">
                  Create Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateCheck 
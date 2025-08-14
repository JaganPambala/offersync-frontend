import React, { useState } from 'react'
import { 
  FileText, 
  Filter, 
  Search, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Calendar
} from 'lucide-react'
import { offersData } from '../data/sampleData.js'

const Offers= () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOffers = offersData.filter(offer => {
    const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      offer.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.position.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const getDaysUntilExpiry = (dateString) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const generateWhatsAppLink = (candidateName) => {
    const message = `Hi! I'd like to discuss the offer for ${candidateName}. Can we coordinate?`
    return `https://wa.me/?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your job offers in one place
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="btn-primary">
            <FileText className="h-4 w-4 mr-2" />
            Create Offer
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="EXPIRED">Expired</option>
            </select>

            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === 'table' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Offers</dt>
                <dd className="text-lg font-medium text-gray-900">{offersData.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {offersData.filter(offer => offer.status === 'ACTIVE').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Accepted</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {offersData.filter(offer => offer.status === 'ACCEPTED').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Competitive</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {offersData.filter(offer => offer.competition.isCompetitive).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className={`card p-6 ${offer.competition.isCompetitive ? 'border-orange-200 bg-orange-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{offer.candidate.name}</h3>
                    <span className={`badge ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                    <span className={`badge ${getPriorityColor(offer.priority)}`}>
                      {offer.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{offer.position.title}</p>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    {formatCurrency(offer.compensation.total)}
                  </p>

                  {offer.competition.isCompetitive && (
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-700">
                        {offer.competition.competitorCount} competing offers
                      </span>
                    </div>
                  )}

                  {offer.timeline.validTill && (
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Expires in {getDaysUntilExpiry(offer.timeline.validTill)} days
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {offer.competition.isCompetitive && (
                  <a
                    href={generateWhatsAppLink(offer.candidate.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-sm flex-1 justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Coordinate
                  </a>
                )}
                <button className="btn-secondary text-sm flex-1 justify-center">
                  View Details
                </button>
                <button className="btn-primary text-sm flex-1 justify-center">
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compensation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className={offer.competition.isCompetitive ? 'bg-orange-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{offer.candidate.name}</div>
                        <div className="text-sm text-gray-500">{offer.candidate.status}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{offer.position.title}</div>
                      <div className="text-sm text-gray-500">{offer.position.level}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(offer.compensation.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusColor(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.competition.isCompetitive ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-700">
                            {offer.competition.competitorCount} competitors
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {offer.competition.isCompetitive && (
                          <a
                            href={generateWhatsAppLink(offer.candidate.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-whatsapp-600 hover:text-whatsapp-900"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                        <button className="text-primary-600 hover:text-primary-900">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No offers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'ALL' ? 'Try adjusting your search or filters.' : 'Get started by creating a new offer.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Offers

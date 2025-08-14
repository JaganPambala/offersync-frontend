import React, { useState } from 'react'
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { communicationsData } from '../data/sampleData'

const Communications = () => {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const filteredCommunications = communicationsData.filter(comm => {
    const matchesStatus = statusFilter === 'ALL' || comm.status === statusFilter
    const matchesRole = roleFilter === 'ALL' || comm.role === roleFilter
    return matchesStatus && matchesRole
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      case 'INITIATED': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <Clock className="h-4 w-4" />
      case 'RESOLVED': return <CheckCircle className="h-4 w-4" />
      case 'INITIATED': return <MessageCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getRoleColor = (role) => {
    return role === 'INITIATOR' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Less than 1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const generateWhatsAppLink = (communication) => {
    const message = `Hi ${communication.otherParty.name}! Following up on our discussion about ${communication.candidate.name}.`
    return `https://wa.me/?text=${encodeURIComponent(message)}`
  }

  const summaryStats = {
    total: communicationsData.length,
    active: communicationsData.filter(c => c.status === 'ACTIVE').length,
    resolved: communicationsData.filter(c => c.status === 'RESOLVED').length,
    averageResponseTime: 35 // minutes
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Communications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage HR coordination conversations
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="btn-whatsapp">
            <MessageCircle className="h-4 w-4 mr-2" />
            New Communication
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Communications</dt>
                <dd className="text-lg font-medium text-gray-900">{summaryStats.total}</dd>
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
                <dd className="text-lg font-medium text-gray-900">{summaryStats.active}</dd>
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
                <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                <dd className="text-lg font-medium text-gray-900">{summaryStats.resolved}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Response</dt>
                <dd className="text-lg font-medium text-gray-900">{summaryStats.averageResponseTime}m</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="RESOLVED">Resolved</option>
              <option value="INITIATED">Initiated</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="ALL">All Roles</option>
              <option value="INITIATOR">Initiated by Me</option>
              <option value="RECIPIENT">Received</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communications List */}
      <div className="space-y-4">
        {filteredCommunications.map((communication) => (
          <div key={communication.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {communication.candidate.name}
                  </h3>
                  <span className={`badge ${getStatusColor(communication.status)} flex items-center gap-1`}>
                    {getStatusIcon(communication.status)}
                    {communication.status}
                  </span>
                  <span className={`badge ${getRoleColor(communication.role)}`}>
                    {communication.role}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {communication.role === 'INITIATOR' ? 'To:' : 'From:'} {communication.otherParty.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{communication.otherParty.company}</span>
                  </div>
                </div>

                {communication.outcome && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-medium text-green-900 mb-1">Resolution Outcome</h4>
                    <p className="text-sm text-green-800">{communication.outcome.description}</p>
                    {communication.outcome.actions && communication.outcome.actions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-900 mb-1">Agreed Actions:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          {communication.outcome.actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-green-600">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatTimeAgo(communication.createdAt)}
                  </div>
                  {communication.metrics.responseTimeMinutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Response: {communication.metrics.responseTimeMinutes}m
                    </div>
                  )}
                  {communication.metrics.resolutionTimeHours && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Resolved: {communication.metrics.resolutionTimeHours}h
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={generateWhatsAppLink(communication)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
                <button className="btn-secondary text-sm">
                  View Details
                </button>
                {communication.status === 'ACTIVE' && (
                  <button className="btn-primary text-sm">
                    Update Outcome
                  </button>
                )}
              </div>
            </div>

            {/* Progress Timeline for Active Communications */}
            {communication.status === 'ACTIVE' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Communication Progress</span>
                  <span className="text-gray-500">Awaiting response...</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCommunications.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No communications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter !== 'ALL' || roleFilter !== 'ALL' 
              ? 'Try adjusting your filters.' 
              : 'Start coordinating with other HRs when you find duplicate candidates.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Communications 
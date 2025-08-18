import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { dashboardData } from '../data/sampleData'
import { navigationLinks } from '../utils/constants'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  // Get user from Redux state
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  console.log("user", user);
  console.log("token", token);
  const { overview, whatsappMetrics, recentActivity } = dashboardData

  // Function to get greeting based on time of day
  const getGreeting = () => {
    // Get local time using toLocaleString
    const hour = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false })
    const hourNumber = parseInt(hour)
    
    if (hourNumber >= 5 && hourNumber < 12) return 'Good morning'
    if (hourNumber >= 12 && hourNumber < 17) return 'Good afternoon'
    if (hourNumber >= 17 && hourNumber < 22) return 'Good evening'
    return 'Good night'
  }

  // Welcome message based on user data
  const getWelcomeMessage = () => {
    if (user?.name) {
      return `${getGreeting()}, ${user.name}! 👋`
    }
    return `${getGreeting()}, Welcome to OfferSync! 👋`
  }

  // Company and role info based on user data
  const getSubtitle = () => {
    if (user?.role) {
      return `${user.role}${user.company?.name ? ` • ${user.company.name}` : ''}`
    }
    return 'Your HR collaboration platform'
  }

  const stats = [
    {
      name: 'Total Offers',
      value: overview.totalOffers,
      change: '+12%',
      changeType: 'increase',
      icon: FileText,
      color: 'blue'
    },
    {
      name: 'Active Offers',
      value: overview.activeOffers,
      change: '+4',
      changeType: 'increase',
      icon: Clock,
      color: 'yellow'
    },
    {
      name: 'Success Rate',
      value: `${overview.successRate}%`,
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'WhatsApp Communications',
      value: whatsappMetrics.totalCommunications,
      change: '+6',
      changeType: 'increase',
      icon: MessageCircle,
      color: 'green'
    }
  ]

  const quickActions = [
    {
      name: 'Check Candidate',
      description: 'Verify candidate duplicates',
      href: navigationLinks.candidateCheck.path,
      icon: Users,
      color: 'bg-primary-600'
    },
    {
      name: 'View Offers',
      description: 'Manage active offers',
      href: navigationLinks.offers.path,
      icon: FileText,
      color: 'bg-green-600'
    },
    {
      name: 'Communications',
      description: 'WhatsApp coordination',
      href: navigationLinks.communications.path,
      icon: MessageCircle,
      color: 'bg-whatsapp-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {getWelcomeMessage()}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="self-center flex-shrink-0 h-4 w-4" />
                      ) : (
                        <ArrowDown className="self-center flex-shrink-0 h-4 w-4" />
                      )}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className={`${action.color} rounded-lg inline-flex p-3 ring-4 ring-white`}>
                  <action.icon className="h-6 w-6 text-white" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* WhatsApp Metrics */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">WhatsApp Collaboration</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Response Rate</span>
              <span className="text-sm font-medium text-gray-900">{whatsappMetrics.resolutionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-whatsapp-500 h-2 rounded-full" style={{ width: `${whatsappMetrics.resolutionRate}%` }}></div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Avg Response Time</span>
              <span className="text-sm font-medium text-gray-900">{whatsappMetrics.averageResponseTime} min</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Success Rate</span>
              <span className="text-sm font-medium text-gray-900">{whatsappMetrics.collaborationSuccessRate}%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.message}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          activity.type === 'OFFER_CREATED' ? 'bg-blue-500' :
                          activity.type === 'WHATSAPP_RESOLVED' ? 'bg-whatsapp-500' :
                          'bg-green-500'
                        }`}>
                          {activity.type === 'OFFER_CREATED' && <FileText className="h-4 w-4 text-white" />}
                          {activity.type === 'WHATSAPP_RESOLVED' && <MessageCircle className="h-4 w-4 text-white" />}
                          {activity.type === 'CANDIDATE_ACCEPTED' && <CheckCircle className="h-4 w-4 text-white" />}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.message}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 
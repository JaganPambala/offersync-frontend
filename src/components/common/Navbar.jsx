import React, { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { currentUser, notificationsData } from '../../data/sampleData'

const Navbar = ({ setSidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const unreadNotifications = notificationsData.filter(n => !n.isRead).length

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="w-full flex md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                {/* Search icon can go here */}
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                    Notifications ({unreadNotifications} unread)
                  </div>
                  {notificationsData.slice(0, 5).map((notification) => (
                    <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={currentUser.company.logo}
                alt={currentUser.name}
              />
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar

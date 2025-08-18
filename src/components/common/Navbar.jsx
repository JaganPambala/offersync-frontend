import React, { useState } from 'react'
import { Menu, Bell, LogOut, User, Settings, LogIn } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { currentUser, notificationsData } from '../../data/sampleData'
import { navigationLinks } from '../../utils/constants'

const Navbar = ({ setSidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get user from Redux state instead of sample data
  const user = useSelector((state) => state.auth.user)
  const unreadNotifications = notificationsData.filter(n => !n.isRead).length

  const handleLogout = () => {
    dispatch(logout())
    navigate(navigationLinks.login.path)
  }

  const handleLogin = () => {
    navigate(navigationLinks.login.path);
  };

  // Function to get user's initials or first letter
  const getInitials = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  }

  // Function to generate a background color based on name
  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-400';
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500'
    ];
    // Use the first character's char code to pick a color
    const colorIndex = name.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  }

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
          {/* Only show notifications for authenticated users */}
          {user && (
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
          )}

          {/* Profile section */}
          <div className="ml-3 relative flex items-center gap-2">
            {!user && (
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-3 py-1.5 border border-primary-500 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </button>
            )}
            <button
              className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => user && setProfileOpen(!profileOpen)}
            >
              {user ? (
                <>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(user.name)}`}
                    aria-hidden="true"
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user.name}
                  </span>
                </>
              ) : (
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <User className="h-5 w-5" />
                </div>
              )}
            </button>

            {/* Profile Dropdown Menu - only show when user is authenticated */}
            {user && profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {/* User Info Section */}
                  <div className="px-4 py-2 text-xs text-gray-500 border-b">
                    <div>{user.email}</div>
                    <div className="font-medium">{user.company?.name}</div>
                    <div>{user.role}</div>
                  </div>
                  
                  {/* Dropdown Items */}
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </a>
                  
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </a>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar

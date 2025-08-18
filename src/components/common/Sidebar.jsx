import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageCircle,
  X
} from 'lucide-react'
import { navigationLinks } from '../../utils/constants'

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile = false }) => {
  const location = useLocation()

  const navigation = [
    { name: navigationLinks.dashboard.name, href: navigationLinks.dashboard.path, icon: LayoutDashboard },
    { name: navigationLinks.candidateCheck.name, href: navigationLinks.candidateCheck.path, icon: Users },
    { name: navigationLinks.offers.name, href: navigationLinks.offers.path, icon: FileText },
    { name: navigationLinks.communications.name, href: navigationLinks.communications.path, icon: MessageCircle },
  ]

  const SidebarContent = () => (
    <>
      <div className="flex-shrink-0 flex items-center px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OS</span>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">OfferSync</span>
        </div>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 ${isMobile ? 'text-base' : 'text-sm'} font-medium rounded-md`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <item.icon className={`${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'} ${isMobile ? 'mr-4 h-6 w-6' : 'mr-3 h-5 w-5'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </>
  )

  if (isMobile) {
    return (
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard':    'Dashboard',
  '/contacts':     'My Contacts',
  '/contacts/add': 'Add Contact',
  '/profile':      'My Profile',
}

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] || 'SCM'

  return (
    <header
      className="sticky top-0 z-10"
      style={{
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-menu-btn"
            onClick={onMenuClick}
            className="lg:hidden btn-ghost p-2 -ml-1"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Avatar with gradient ring */}
          <div className="flex items-center gap-2.5 ml-1">
            <div
              className="w-9 h-9 rounded-full p-0.5 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
            >
              {user?.profilePic ? (
                <img src={user.profilePic} alt="avatar"
                  className="w-full h-full rounded-full object-cover" />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: '#1e1e2e' }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}

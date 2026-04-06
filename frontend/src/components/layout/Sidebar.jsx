import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Users, UserPlus,
  User, LogOut, X,
  ChevronRight, Contact
} from 'lucide-react'

const links = [
  { to: '/dashboard',   icon: Home,      label: 'Dashboard' },
  { to: '/contacts',    icon: Users,      label: 'Contacts' },
  { to: '/contacts/add', icon: UserPlus,  label: 'Add Contact' },
  { to: '/profile',     icon: User,       label: 'Profile' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${expanded ? 'w-60' : 'w-[72px]'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0f0f1a 0%, #0a0a0f 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo Header */}
        <div className={`flex items-center ${expanded ? 'justify-between px-4' : 'justify-center'} py-5 relative`} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div 
            className={`flex items-center gap-3 overflow-hidden ${!expanded ? 'cursor-pointer' : ''}`}
            onClick={() => { if (!expanded) setExpanded(true) }}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!expanded ? 'hover:scale-105 transition-transform' : ''}`}
              style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
            >
              <Contact className="text-white w-5 h-5" />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-white text-lg tracking-tight whitespace-nowrap overflow-hidden"
                >
                  SCM
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop expand/collapse */}
          <button
            onClick={() => setExpanded(e => !e)}
            className={`hidden lg:flex p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${!expanded ? '!hidden' : ''}`}
            style={{ color: '#64748b' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: '#64748b' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              end={to === '/contacts'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden
                ${isActive ? 'sidebar-active' : 'sidebar-inactive'}`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.1))',
                borderLeft: '3px solid #6366f1',
                paddingLeft: '9px',
                color: '#a5b4fc',
              } : {
                color: '#64748b',
                borderLeft: '3px solid transparent',
              }}
              onMouseEnter={e => {
                if (!e.currentTarget.style.borderLeftColor.includes('99')) {
                  e.currentTarget.style.color = '#cbd5e1'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.borderLeftColor.includes('99')) {
                  e.currentTarget.style.color = '#64748b'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color: isActive ? '#a5b4fc' : 'inherit' }} />
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Tooltip on collapsed */}
                  {!expanded && (
                    <div
                      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                 opacity-0 group-hover:opacity-100 pointer-events-none z-50
                                 whitespace-nowrap transition-all duration-200"
                      style={{
                        background: '#1e1e2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#e2e8f0',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Avatar + Logout */}
        <div className="px-3 pb-5 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          {/* User info */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl overflow-hidden">
            {/* Avatar with gradient ring */}
            <div className="relative flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full p-0.5"
                style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: '#1e1e2e' }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#10b981', borderColor: '#0a0a0f' }}
              />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs truncate" style={{ color: '#475569' }}>{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden relative group"
            style={{ color: '#f87171' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </aside>
    </>
  )
}

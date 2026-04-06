import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineSparkles } from 'react-icons/hi2'
import { MdOutlineContacts } from 'react-icons/md'

const features = [
  { icon: '📇', label: 'Smart Contacts' },
  { icon: '🔍', label: 'Instant Search' },
  { icon: '⭐', label: 'Favorites System' },
  { icon: '☁️', label: 'Cloud Sync' },
]

export default function LoginPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await authService.login(form.email, form.password)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        {/* Ambient blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-10 right-0 w-60 h-60 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5"
          style={{ background: 'radial-gradient(ellipse, #818cf8, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
          >
            <MdOutlineContacts className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SCM</span>
        </div>

        {/* Hero text */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineSparkles className="w-5 h-5" style={{ color: '#a5b4fc' }} />
            <span className="text-sm font-medium" style={{ color: '#a5b4fc' }}>Smart Contact Manager</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your contacts<br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              smarter &amp; faster
            </span>
          </h2>
          <p className="text-base mb-8" style={{ color: '#64748b' }}>
            One place for all your professional and personal connections.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm" style={{ color: '#334155' }}>© 2025 Smart Contact Manager</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
            >
              <MdOutlineContacts className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: '#f1f5f9' }}>SCM</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#f8fafc' }}>Welcome back</h1>
            <p className="text-sm mt-1.5" style={{ color: '#475569' }}>Sign in to your account to continue</p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: '#12121a',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="label">Email address</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#475569' }} />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(v => ({ ...v, email: '' })) }}
                    placeholder="you@example.com"
                    className={`input-field pl-9 ${errors.email ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#475569' }} />
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setErrors(v => ({ ...v, password: '' })) }}
                    placeholder="••••••••"
                    className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569' }}
                  >
                    {showPwd ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3"
              >
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: '#475569' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#a5b4fc' }}>
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

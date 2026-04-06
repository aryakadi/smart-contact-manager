import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import {
  HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeSlash,
} from 'react-icons/hi2'
import { MdOutlineContacts } from 'react-icons/md'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd]       = useState(false)
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim())    e.name = 'Name is required'
    if (!email)          e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email format'
    if (!password)       e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (password !== confirmPwd)  e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await authService.register(name.trim(), email, password)
      login(data.user, data.token)
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <MdOutlineContacts className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">SCM</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Join thousands who<br />organize smarter
          </h2>
          <p className="mt-4 text-primary-200 text-lg">
            Start managing your contacts with a free account today.
          </p>
        </div>
        <p className="text-primary-300 text-sm">© 2025 Smart Contact Manager</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <MdOutlineContacts className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">SCM</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Fill in the details below to get started</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="label">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                  placeholder="John Doe"
                  className={`input-field pl-9 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label">Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                  placeholder="you@example.com"
                  className={`input-field pl-9 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPwd ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="label">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-confirm"
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => { setConfirmPwd(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })) }}
                  placeholder="Repeat password"
                  className={`input-field pl-9 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button id="register-submit" type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

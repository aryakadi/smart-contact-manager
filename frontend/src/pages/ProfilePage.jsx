import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import userService from '../services/userService'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'
import { HiOutlineEnvelope, HiOutlineCalendar } from 'react-icons/hi2'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName]         = useState(user?.name || '')
  const [avatar, setAvatar]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [stats, setStats]       = useState(null)

  useEffect(() => {
    userService.getDashboard()
      .then(d => setStats(d))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    setLoading(true)
    try {
      const updated = await userService.updateProfile(name.trim(), avatar)
      updateUser(updated)
      setAvatar(null)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account information</p>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-100 dark:ring-primary-900/30" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600
                            flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              <HiOutlineEnvelope className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            {joinDate && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                <HiOutlineCalendar className="w-3.5 h-3.5" />
                <span>Joined {joinDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats?.totalContacts ?? '—'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Total Contacts</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Active</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Account Status</p>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageUpload value={user?.profilePic} onChange={setAvatar} label="Profile Picture" />

          <div>
            <label htmlFor="profile-name" className="label">Full Name</label>
            <input
              id="profile-name"
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              className="input-field bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
              value={user?.email || ''}
              disabled
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <button id="profile-save" type="submit" disabled={loading} className="btn-primary">
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

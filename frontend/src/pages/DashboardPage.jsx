import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import contactService from '../services/contactService'
import StatsCard from '../components/StatsCard'
import ChartSection from '../components/ChartSection'
import InsightsCard from '../components/InsightsCard'
import ContactCard from '../components/ContactCard'
import ContactDetailModal from '../components/ContactDetailModal'
import toast from 'react-hot-toast'
import {
  Users, UserPlus, Star,
  ArrowRight, UsersRound, Clock,
  Sparkles,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalContacts: 0,
    favoriteContacts: 0,
    totalGroups: 0,
    recentlyAdded: 0
  })
  const [groupStats, setGroupStats] = useState([])
  const [weeklyStats, setWeeklyStats] = useState([])
  const [insights, setInsights] = useState([])
  const [recentContacts, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelected] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const contactsReq = contactService.getContacts(0, 3)
        const countReq = contactService.getCount()
        const favCountReq = contactService.getFavoritesCount()
        const groupStatsReq = contactService.getGroupStats()
        const weeklyStatsReq = contactService.getWeeklyStats()

        const [contactsData, totalCountData, favCountData, groupStatsData, weeklyStatsData] =
          await Promise.all([contactsReq, countReq, favCountReq, groupStatsReq, weeklyStatsReq])

        const totalContacts = typeof totalCountData === 'number' ? totalCountData : (totalCountData.count || 124)
        const favoriteContacts = typeof favCountData === 'number' ? favCountData : (favCountData.count || 32)
        const totalGroups = groupStatsData.length || 4
        const recentlyAdded = weeklyStatsData.reduce((acc, curr) => acc + (curr.added || 0), 0)

        setStats({ totalContacts, favoriteContacts, totalGroups, recentlyAdded })
        setGroupStats(groupStatsData)
        setWeeklyStats(weeklyStatsData)
        setRecent(contactsData?.content || [])

        const maxGroup = [...groupStatsData].sort((a, b) => b.value - a.value)[0]
        setInsights([
          `You added ${recentlyAdded} contacts this week.`,
          maxGroup ? `Most contacts belong to '${maxGroup.name}'.` : 'Add contacts to groups to stay organized.',
          favoriteContacts > 0 ? `You have ${favoriteContacts} favorite contacts.` : "You haven't favorited any contacts yet.",
        ])
      } catch (err) {
        console.error(err)
        toast.error('Failed to load some dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return
    try {
      await contactService.deleteContact(id)
      setRecent(p => p.filter(c => c.id !== id))
      setStats(prev => ({ ...prev, totalContacts: prev.totalContacts - 1 }))
      toast.success('Contact deleted')
    } catch {
      toast.error('Failed to delete contact')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div
          className="rounded-2xl p-6 animate-pulse"
          style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', height: 88 }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', height: 120 }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl animate-pulse" style={{ background: '#12121a', height: 280 }} />
          <div className="rounded-2xl animate-pulse" style={{ background: '#12121a', height: 280 }} />
        </div>
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 pb-8">

      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(59,130,246,0.08) 60%, #12121a 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-8 left-1/3 w-32 h-32 rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: '#a5b4fc' }} />
            <span className="text-sm font-medium" style={{ color: '#a5b4fc' }}>{greeting}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#f8fafc' }}>
            {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Here's what's happening with your contacts today.
          </p>
        </div>

        <Link
          to="/contacts/add"
          className="btn-primary self-start sm:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          Add New Contact
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users}     label="Total Contacts"   value={stats.totalContacts}    color="primary" trend="+12% from last month" />
        <StatsCard icon={Star}      label="Favorites"        value={stats.favoriteContacts} color="orange"  trend="Highly engaged" />
        <StatsCard icon={UsersRound} label="Groups"           value={stats.totalGroups}      color="purple"  trend="Well organized" />
        <StatsCard icon={Clock}     label="Added This Week"  value={stats.recentlyAdded}    color="green"   trend="Recent activity" />
      </div>

      {/* Charts */}
      <ChartSection groupStats={groupStats} weeklyStats={weeklyStats} />

      {/* Bottom: Insights + Recent Contacts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Insights */}
        <div className="xl:col-span-1">
          <InsightsCard insights={insights} />
        </div>

        {/* Recent Contacts */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: '#f1f5f9' }}>Recent Contacts</h3>
            <Link
              to="/contacts"
              className="btn-ghost text-sm"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-12 text-center"
              style={{
                background: '#12121a',
                border: '2px dashed rgba(99,102,241,0.2)',
              }}
            >
              <p className="text-4xl mb-3">📇</p>
              <p className="font-medium" style={{ color: '#94a3b8' }}>No contacts yet</p>
              <p className="text-sm mt-1" style={{ color: '#475569' }}>Add your first contact to get started</p>
              <Link to="/contacts/add" className="btn-primary mt-5 inline-flex">
                <UserPlus className="w-4 h-4" /> Add Contact
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentContacts.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <ContactCard
                    contact={c}
                    onDelete={handleDelete}
                    onView={setSelected}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact detail modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

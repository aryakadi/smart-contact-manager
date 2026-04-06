import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import contactService from '../services/contactService'
import ContactCard from '../components/ContactCard'
import ContactDetailModal from '../components/ContactDetailModal'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import toast from 'react-hot-toast'
import { HiOutlineUserPlus, HiOutlineArrowDownTray, HiOutlineStar, HiStar } from 'react-icons/hi2'

const PAGE_SIZE = 9

export default function ContactsPage() {
  const [contacts, setContacts]     = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage]             = useState(0)
  const [loading, setLoading]       = useState(true)
  const [searchQuery, setQuery]     = useState('')
  const [searchField, setSearchField] = useState('name')
  const [selectedContact, setSelectedContact] = useState(null)
  const [exporting, setExporting]   = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('All')

  const debounceRef = useRef(null)

  const fetchContacts = useCallback(async (f, q, p, isFav) => {
    setLoading(true)
    try {
      let data
      if (isFav) {
        data = await contactService.getFavorites(p, PAGE_SIZE)
      } else if (q) {
        data = await contactService.searchContacts(f, q, p, PAGE_SIZE)
      } else {
        data = await contactService.getContacts(p, PAGE_SIZE)
      }
      setContacts(data.content || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalElements || 0)
    } catch {
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedGroup !== 'All') {
      fetchContacts('group', selectedGroup, page, showFavorites)
    } else {
      fetchContacts(searchField, searchQuery, page, showFavorites)
    }
  }, [page, searchField, searchQuery, showFavorites, selectedGroup, fetchContacts])

  const handleSearch = (q) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      setQuery(q)
      if (q) { setShowFavorites(false); setSelectedGroup('All') }
    }, 400)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact? This action cannot be undone.')) return
    try {
      await contactService.deleteContact(id)
      toast.success('Contact deleted')
      fetchContacts(searchField, searchQuery, page, showFavorites)
    } catch {
      toast.error('Failed to delete contact')
    }
  }

  const handleToggleFavorite = async (contact) => {
    try {
      const updatedContact = { ...contact, favorite: !contact.favorite }
      setContacts(prev => prev.map(c => c.id === contact.id ? updatedContact : c))
      await contactService.updateContact(contact.id, updatedContact)
      if (showFavorites && contact.favorite) {
        fetchContacts(searchField, searchQuery, page, showFavorites)
      }
    } catch {
      toast.error('Failed to update favorite status')
      fetchContacts(searchField, searchQuery, page, showFavorites)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const data = await contactService.getContacts(0, 10000)
      const contactsList = data.content || []
      if (contactsList.length === 0) { toast.error('No contacts to export'); return }
      const headers = ['Name', 'Email', 'Phone', 'Address', 'Description', 'LinkedIn', 'Gmail Link']
      const rows = contactsList.map(c => [
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        `"${(c.description || '').replace(/"/g, '""')}"`,
        `"${(c.linkedinLink || '').replace(/"/g, '""')}"`,
        `"${(c.gmailLink || '').replace(/"/g, '""')}"`,
      ])
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Contacts exported successfully!')
    } catch {
      toast.error('Failed to export contacts')
    } finally {
      setExporting(false)
    }
  }

  const groups = ['All', 'Work', 'Family', 'College', 'Friends']

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
            {showFavorites ? 'Favorite Contacts' : 'My Contacts'}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
            {totalItems} contact{totalItems !== 1 ? 's' : ''} total
          </p>
        </div>

        <div className="flex gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => { setPage(0); setQuery(''); setShowFavorites(!showFavorites) }}
            className={`btn-secondary ${showFavorites ? 'ring-2 ring-yellow-400/50' : ''}`}
            style={showFavorites ? { borderColor: 'rgba(234,179,8,0.4)', color: '#fbbf24' } : {}}
          >
            {showFavorites ? <HiStar className="w-4 h-4 text-yellow-400" /> : <HiOutlineStar className="w-4 h-4" />}
            {showFavorites ? 'Show All' : 'Favorites'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-secondary"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <Link to="/contacts/add" className="btn-primary">
            <HiOutlineUserPlus className="w-4 h-4" /> Add Contact
          </Link>
        </div>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="space-y-4"
      >
        <div className="max-w-md">
          <SearchBar
            onSearch={handleSearch}
            onFieldChange={(field) => { setSearchField(field); setPage(0) }}
            selectedField={searchField}
            placeholder={`Search by ${searchField}…`}
          />
        </div>

        {/* Group filter pills */}
        <div className="flex flex-wrap gap-2">
          {groups.map(group => (
            <button
              key={group}
              onClick={() => { setSelectedGroup(group); setPage(0); setQuery(''); setShowFavorites(false) }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={selectedGroup === group ? {
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748b',
              }}
              onMouseEnter={e => {
                if (selectedGroup !== group) {
                  e.currentTarget.style.color = '#94a3b8'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                }
              }}
              onMouseLeave={e => {
                if (selectedGroup !== group) {
                  e.currentTarget.style.color = '#64748b'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }
              }}
            >
              {group}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Contact grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse"
              style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.04)', height: 160 }}
            />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-16 text-center"
          style={{
            background: '#12121a',
            border: '2px dashed rgba(99,102,241,0.2)',
          }}
        >
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-lg" style={{ color: '#94a3b8' }}>
            {searchQuery ? 'No contacts found' : 'No contacts yet'}
          </p>
          <p className="text-sm mt-2" style={{ color: '#475569' }}>
            {searchQuery ? 'Try a different search term' : 'Add your first contact to get started'}
          </p>
          {!searchQuery && (
            <Link to="/contacts/add" className="btn-primary mt-6 inline-flex">
              <HiOutlineUserPlus className="w-4 h-4" /> Add Contact
            </Link>
          )}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <ContactCard
                  contact={c}
                  onDelete={handleDelete}
                  onView={setSelectedContact}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  )
}

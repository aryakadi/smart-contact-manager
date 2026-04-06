import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineStar, HiStar } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Badge from './Badge'

export default function ContactCard({ contact, onDelete, onView, onToggleFavorite }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: '#12121a',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onClick={() => onView && onView(contact)}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15)'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
      }}
    >
      {/* Subtle bg radial glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.06), transparent 60%)' }}
      />

      {/* Top row: avatar + name + actions */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {contact.image ? (
              <img
                src={contact.image}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(#12121a, #12121a) padding-box, linear-gradient(135deg, #6366f1, #3b82f6) border-box',
                }}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
              >
                {contact.name?.[0]?.toUpperCase()}
              </div>
            )}
            {contact.favorite && (
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: '#f59e0b' }}
              >
                <HiStar className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold truncate" style={{ color: '#f1f5f9' }}>{contact.name}</h3>
            {contact.email && (
              <p className="text-xs truncate mt-0.5" style={{ color: '#475569' }}>{contact.email}</p>
            )}
          </div>
        </div>

        {/* Action buttons - visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(contact) }}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ color: contact.favorite ? '#f59e0b' : '#475569' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.color = '#f59e0b' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = contact.favorite ? '#f59e0b' : '#475569' }}
            title={contact.favorite ? "Unfavorite" : "Favorite"}
          >
            {contact.favorite ? <HiStar className="w-4 h-4" /> : <HiOutlineStar className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/contacts/edit/${contact.id}`) }}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ color: '#475569' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#a5b4fc' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
            title="Edit"
          >
            <HiOutlinePencilSquare className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(contact.id) }}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ color: '#475569' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
            title="Delete"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="relative space-y-2 text-sm">
        {contact.phone && (
          <div className="flex items-center gap-2.5" style={{ color: '#64748b' }}>
            <HiOutlinePhone className="w-4 h-4 flex-shrink-0" style={{ color: '#6366f1' }} />
            <span className="truncate">{contact.phone}</span>
          </div>
        )}
        {contact.address && (
          <div className="flex items-center gap-2.5" style={{ color: '#64748b' }}>
            <HiOutlineMapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#6366f1' }} />
            <span className="truncate">{contact.address}</span>
          </div>
        )}
        {contact.description && (
          <p className="text-xs line-clamp-2 mt-1" style={{ color: '#475569' }}>{contact.description}</p>
        )}
      </div>
    </motion.div>
  )
}

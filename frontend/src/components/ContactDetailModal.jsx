import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineXMark,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa'

const backdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
}

const panel = {
  hidden:  { opacity: 0, scale: 0.92, y: 36 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26 },
  },
  exit: { opacity: 0, scale: 0.94, y: 24, transition: { duration: 0.18 } },
}

export default function ContactDetailModal({ contact, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const email = contact.email || contact.gmailLink || null
  const gmailUrl = email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
    : null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)' }}
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden"
          style={{
            background: '#14141f',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)',
          }}
        >
          {/* Header gradient area */}
          <div
            className="relative flex flex-col items-center pt-8 pb-6 px-6"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #3b82f6 100%)',
            }}
          >
            {/* Decorative circles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                style={{ background: 'rgba(255,255,255,0.2)' }} />
              <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full opacity-10"
                style={{ background: 'rgba(255,255,255,0.3)' }} />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
              title="Close"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="relative z-10">
              {contact.image ? (
                <img
                  src={contact.image}
                  alt={contact.name}
                  className="w-20 h-20 rounded-full object-cover mb-3 ring-4 ring-white/30 shadow-lg"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full mb-3 flex items-center justify-center text-white font-extrabold text-3xl ring-4 ring-white/30 shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                >
                  {contact.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="relative z-10 text-xl font-bold text-white drop-shadow">{contact.name}</h2>

            {contact.description && (
              <span
                className="relative z-10 mt-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white/90"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <HiOutlineTag className="w-3 h-3" />
                {contact.description}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-4">
            {/* Detail rows */}
            <div className="space-y-2.5 text-sm">
              {email && (
                <DetailRow
                  icon={<HiOutlineEnvelope className="w-4 h-4" style={{ color: '#f87171' }} />}
                  label="Email"
                  value={email}
                  accent="rgba(239,68,68,0.15)"
                />
              )}
              {contact.phone && (
                <DetailRow
                  icon={<HiOutlinePhone className="w-4 h-4" style={{ color: '#34d399' }} />}
                  label="Phone"
                  value={contact.phone}
                  accent="rgba(16,185,129,0.15)"
                />
              )}
              {contact.address && (
                <DetailRow
                  icon={<HiOutlineMapPin className="w-4 h-4" style={{ color: '#fb923c' }} />}
                  label="Address"
                  value={contact.address}
                  accent="rgba(249,115,22,0.15)"
                />
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-auto inline-flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm min-w-[120px] active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <HiOutlinePhone className="w-4 h-4 flex-shrink-0" />
                  Call
                </a>
              )}
              {contact.phone && (
                <a
                  href={`https://wa.me/${contact.phone.replace(/[^0-9+]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-auto inline-flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm min-w-[120px] active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <FaWhatsapp className="w-4 h-4 flex-shrink-0" />
                  WhatsApp
                </a>
              )}
              {gmailUrl && (
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-auto inline-flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm min-w-[120px] active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(239,68,68,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <HiOutlineEnvelope className="w-4 h-4 flex-shrink-0" />
                  Gmail
                  <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5 opacity-75 flex-shrink-0" />
                </a>
              )}
              {contact.linkedinLink && (
                <a
                  href={contact.linkedinLink.startsWith('http') ? contact.linkedinLink : `https://${contact.linkedinLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-auto inline-flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm min-w-[120px] active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #0077b5, #0a66c2)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0,119,181,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,119,181,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,119,181,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <FaLinkedin className="w-4 h-4 flex-shrink-0" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function DetailRow({ icon, label, value, accent }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-3 py-2.5"
      style={{ background: accent || 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider leading-none mb-1" style={{ color: '#475569' }}>
          {label}
        </p>
        <p className="font-medium break-all leading-snug" style={{ color: '#e2e8f0' }}>{value}</p>
      </div>
    </div>
  )
}

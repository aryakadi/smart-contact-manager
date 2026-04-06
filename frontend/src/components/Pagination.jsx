import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  const btnBase = {
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ ...btnBase, color: '#64748b', background: 'transparent' }}
        onMouseEnter={e => { if (currentPage > 0) { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)' } }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}
      >
        <HiOutlineChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page) => {
        const show = page === 0 || page === totalPages - 1 || Math.abs(page - currentPage) <= 1
        if (!show) {
          if (page === 1 || page === totalPages - 2) {
            return <span key={page} className="px-1 text-sm" style={{ color: '#475569' }}>…</span>
          }
          return null
        }
        const isActive = page === currentPage
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200"
            style={isActive ? {
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
            } : {
              color: '#64748b',
              background: 'transparent',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#a5b4fc' } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' } }}
          >
            {page + 1}
          </button>
        )
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ ...btnBase, color: '#64748b', background: 'transparent' }}
        onMouseEnter={e => { if (currentPage < totalPages - 1) { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)' } }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}
      >
        <HiOutlineChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

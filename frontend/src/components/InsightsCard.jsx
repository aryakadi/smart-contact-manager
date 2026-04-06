import { motion } from 'framer-motion'
import { HiOutlineLightBulb, HiOutlineSparkles } from 'react-icons/hi2'

export default function InsightsCard({ insights }) {
  const safeInsights = insights?.length ? insights : [
    "You added 26 contacts this week.",
    "Most of your contacts belong to 'Work'.",
    "You haven't favored any contacts recently.",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-2xl p-6 h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, #12121a 60%)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      {/* Decorative glow blob */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
          }}
        >
          <HiOutlineSparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Smart Insights</h3>
          <p className="text-xs" style={{ color: '#475569' }}>AI-powered analysis</p>
        </div>
      </div>

      {/* Insight list */}
      <ul className="relative space-y-3">
        {safeInsights.map((insight, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl px-3.5 py-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
            >
              <span className="text-white text-[9px] font-bold">{idx + 1}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{insight}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

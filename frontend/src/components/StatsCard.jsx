import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

// Deterministic sparkline data (no random to avoid hydration issues)
const SPARKLINES = {
  primary: [{ v: 3 }, { v: 7 }, { v: 5 }, { v: 9 }, { v: 6 }, { v: 11 }, { v: 14 }],
  orange:  [{ v: 8 }, { v: 5 }, { v: 9 }, { v: 4 }, { v: 10 }, { v: 7 }, { v: 12 }],
  purple:  [{ v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 5 }],
  green:   [{ v: 1 }, { v: 3 }, { v: 2 }, { v: 5 }, { v: 4 }, { v: 7 }, { v: 6 }],
}

const COLOR_MAP = {
  primary: {
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    glow:     'rgba(99,102,241,0.5)',
    bg:       'rgba(99,102,241,0.12)',
    border:   'rgba(99,102,241,0.25)',
    spark:    '#6366f1',
    text:     '#a5b4fc',
  },
  orange: {
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    glow:     'rgba(249,115,22,0.5)',
    bg:       'rgba(249,115,22,0.12)',
    border:   'rgba(249,115,22,0.25)',
    spark:    '#f97316',
    text:     '#fdba74',
  },
  purple: {
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    glow:     'rgba(139,92,246,0.5)',
    bg:       'rgba(139,92,246,0.12)',
    border:   'rgba(139,92,246,0.25)',
    spark:    '#8b5cf6',
    text:     '#c4b5fd',
  },
  green: {
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    glow:     'rgba(16,185,129,0.5)',
    bg:       'rgba(16,185,129,0.12)',
    border:   'rgba(16,185,129,0.25)',
    spark:    '#10b981',
    text:     '#6ee7b7',
  },
}

function useCountUp(target, duration = 1200) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (typeof target !== 'number') return
    cancelAnimationFrame(rafRef.current)
    startRef.current = null

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return display
}

export default function StatsCard({ icon: Icon, label, value, color = 'primary', trend }) {
  const c = COLOR_MAP[color] || COLOR_MAP.primary
  const sparkData = SPARKLINES[color] || SPARKLINES.primary
  const displayValue = useCountUp(typeof value === 'number' ? value : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl p-5 cursor-default"
      style={{
        background: '#12121a',
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}, 0 0 30px ${c.glow.replace('0.5', '0.15')}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3)`
      }}
    >
      {/* Subtle bg tint */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${c.bg}, transparent 70%)` }}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-3">
        {/* Icon with glow */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: c.gradient,
            boxShadow: `0 8px 24px ${c.glow}`,
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Sparkline */}
        <div className="w-20 h-10 opacity-70">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={c.spark}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mt-4">
        <p className="text-sm font-medium" style={{ color: '#64748b' }}>{label}</p>
        <p
          className="text-4xl font-bold mt-1 tabular-nums"
          style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
        >
          {displayValue ?? '—'}
        </p>
        {trend && (
          <p className="text-xs font-medium mt-1.5" style={{ color: c.text }}>
            ↑ {trend}
          </p>
        )}
      </div>
    </motion.div>
  )
}

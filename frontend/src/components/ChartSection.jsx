import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
  ResponsiveContainer, Text,
} from 'recharts'
import { motion } from 'framer-motion'

const GRADIENT_COLORS = [
  ['#6366f1', '#818cf8'],
  ['#10b981', '#34d399'],
  ['#f59e0b', '#fbbf24'],
  ['#8b5cf6', '#a78bfa'],
  ['#ef4444', '#f87171'],
  ['#ec4899', '#f472b6'],
  ['#3b82f6', '#60a5fa'],
]

const FLAT_COLORS = GRADIENT_COLORS.map(([c]) => c)

const tooltipStyle = {
  background: '#1e1e2e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
  color: '#e2e8f0',
  fontSize: '13px',
  padding: '8px 12px',
}

// Center label for donut chart
function DonutCenterLabel({ cx, cy, total }) {
  return (
    <>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#f8fafc" fontSize={24} fontWeight={700} fontFamily="Inter">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="Inter">
        contacts
      </text>
    </>
  )
}

export default function ChartSection({ groupStats, weeklyStats }) {
  const safeGroupStats = groupStats?.length ? groupStats : [
    { name: 'Family', value: 4 },
    { name: 'Work', value: 12 },
    { name: 'Friends', value: 6 },
    { name: 'College', value: 8 },
  ]

  const safeWeeklyStats = weeklyStats?.length ? weeklyStats : [
    { name: 'Mon', added: 2 },
    { name: 'Tue', added: 5 },
    { name: 'Wed', added: 3 },
    { name: 'Thu', added: 8 },
    { name: 'Fri', added: 4 },
    { name: 'Sat', added: 1 },
    { name: 'Sun', added: 0 },
  ]

  const totalContacts = safeGroupStats.reduce((acc, cur) => acc + (cur.value || 0), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">

      {/* Gradient Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: '#12121a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Subtle glow in corner */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        <h3 className="text-base font-semibold mb-6" style={{ color: '#e2e8f0' }}>Contacts by Group</h3>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {GRADIENT_COLORS.map(([start, end], i) => (
                  <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={start} />
                    <stop offset="100%" stopColor={end} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={safeGroupStats}
                cx="50%"
                cy="50%"
                innerRadius={64}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {safeGroupStats.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGrad${index % GRADIENT_COLORS.length})`}
                  />
                ))}
              </Pie>
              <PieTooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={false}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
                )}
              />
              {/* Center stat - rendered via custom label */}
              <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
                fill="#f8fafc" fontSize={22} fontWeight={700} fontFamily="Inter">
                {totalContacts}
              </text>
              <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
                fill="#64748b" fontSize={11} fontFamily="Inter">
                contacts
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gradient Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: '#12121a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Subtle glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

        <h3 className="text-base font-semibold mb-6" style={{ color: '#e2e8f0' }}>Contacts Added This Week</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeWeeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
              />
              <BarTooltip
                cursor={{ fill: 'rgba(99,102,241,0.08)', radius: 8 }}
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#a5b4fc' }}
              />
              <Bar
                dataKey="added"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

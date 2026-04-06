import { HiOutlineBriefcase, HiOutlineHome, HiOutlineAcademicCap, HiOutlineUsers } from 'react-icons/hi2'

const groups = {
  Work: {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: HiOutlineBriefcase
  },
  Family: {
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    icon: HiOutlineHome
  },
  College: {
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    icon: HiOutlineAcademicCap
  },
  Friends: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800',
    icon: HiOutlineUsers
  }
}

export default function Badge({ group }) {
  if (!group || !groups[group]) return null

  const { color, icon: Icon } = groups[group]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {group}
    </span>
  )
}

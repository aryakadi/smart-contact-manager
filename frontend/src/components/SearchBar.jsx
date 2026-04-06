import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2'

export default function SearchBar({ onSearch, onFieldChange, selectedField = 'name', placeholder = 'Search contacts…' }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleChange = (e) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {onFieldChange && (
        <select
          aria-label="Search Field"
          value={selectedField}
          onChange={(e) => { onFieldChange(e.target.value); onSearch(value) }}
          className="rounded-xl px-3 py-2.5 text-sm font-medium w-full sm:w-32 cursor-pointer transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
            outline: 'none',
          }}
        >
          <option value="name"    style={{ background: '#1e1e2e' }}>Name</option>
          <option value="email"   style={{ background: '#1e1e2e' }}>Email</option>
          <option value="address" style={{ background: '#1e1e2e' }}>Address</option>
          <option value="description" style={{ background: '#1e1e2e' }}>Description</option>
        </select>
      )}

      <div className="relative flex-1">
        <HiOutlineMagnifyingGlass
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? '#a5b4fc' : '#475569' }}
        />
        <input
          id="contact-search"
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="input-field pl-9 pr-9"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: '#475569' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569' }}
          >
            <HiOutlineXMark className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

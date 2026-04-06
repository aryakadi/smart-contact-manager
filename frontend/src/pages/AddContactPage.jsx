import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import contactService from '../services/contactService'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'
import { HiOutlineArrowLeft } from 'react-icons/hi2'

const EMPTY = {
  name: '', email: '', phone: '', address: '',
  description: '', linkedinLink: '', gmailLink: '', group: ''
}

export default function AddContactPage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState(EMPTY)
  const [image, setImage]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(v => ({ ...v, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await contactService.createContact(form, image)
      toast.success('Contact added successfully!')
      navigate('/contacts')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/contacts" className="btn-ghost p-2">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Contact</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the contact details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Image upload */}
        <ImageUpload value={null} onChange={setImage} label="Contact Photo" />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="label">Full Name <span className="text-red-500">*</span></label>
            <input id="contact-name" className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              value={form.name} onChange={set('name')} placeholder="e.g. Jane Smith" />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input id="contact-email" type="email" className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              value={form.email} onChange={set('email')} placeholder="jane@example.com" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Phone</label>
            <input id="contact-phone" type="tel" className="input-field"
              value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <input id="contact-address" className="input-field"
              value={form.address} onChange={set('address')} placeholder="City, State, Country" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Category Group</label>
            <select id="contact-group" className="input-field" value={form.group} onChange={set('group')}>
              <option value="">None</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="College">College</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea id="contact-description" rows={3} className="input-field resize-none"
              value={form.description} onChange={set('description')} placeholder="Notes about this contact…" />
          </div>

          {/* Social links */}
          <div>
            <label className="label">LinkedIn URL</label>
            <input id="contact-linkedin" className="input-field"
              value={form.linkedinLink} onChange={set('linkedinLink')} placeholder="https://linkedin.com/in/…" />
          </div>

          <div>
            <label className="label">Gmail / Google Link</label>
            <input id="contact-gmail" className="input-field"
              value={form.gmailLink} onChange={set('gmailLink')} placeholder="https://mail.google.com/…" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button id="add-contact-submit" type="submit" disabled={loading} className="btn-primary">
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Saving…' : 'Add Contact'}
          </button>
          <Link to="/contacts" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

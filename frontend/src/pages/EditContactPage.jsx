import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import contactService from '../services/contactService'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'
import { HiOutlineArrowLeft } from 'react-icons/hi2'

export default function EditContactPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm]       = useState(null)
  const [image, setImage]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState({})

  useEffect(() => {
    contactService.getContact(id)
      .then(data => setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        description: data.description || '',
        linkedinLink: data.linkedinLink || '',
        gmailLink: data.gmailLink || '',
        group: data.group || '',
        existingImage: data.image || null,
      }))
      .catch(() => { toast.error('Contact not found'); navigate('/contacts') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(v => ({ ...v, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name?.trim()) e.name = 'Name is required'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      const { existingImage, ...contactData } = form
      await contactService.updateContact(id, contactData, image)
      toast.success('Contact updated!')
      navigate('/contacts')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update contact')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/contacts" className="btn-ghost p-2">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Contact</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update the contact information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <ImageUpload value={form.existingImage} onChange={setImage} label="Contact Photo" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="label">Full Name <span className="text-red-500">*</span></label>
            <input id="edit-name" className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              value={form.name} onChange={set('name')} placeholder="Jane Smith" />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input id="edit-email" type="email" className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              value={form.email} onChange={set('email')} placeholder="jane@example.com" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Phone</label>
            <input id="edit-phone" type="tel" className="input-field"
              value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <input id="edit-address" className="input-field"
              value={form.address} onChange={set('address')} placeholder="City, State, Country" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Category Group</label>
            <select id="edit-group" className="input-field" value={form.group} onChange={set('group')}>
              <option value="">None</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="College">College</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea id="edit-description" rows={3} className="input-field resize-none"
              value={form.description} onChange={set('description')} placeholder="Notes about this contact…" />
          </div>

          <div>
            <label className="label">LinkedIn URL</label>
            <input id="edit-linkedin" className="input-field"
              value={form.linkedinLink} onChange={set('linkedinLink')} placeholder="https://linkedin.com/in/…" />
          </div>

          <div>
            <label className="label">Gmail / Google Link</label>
            <input id="edit-gmail" className="input-field"
              value={form.gmailLink} onChange={set('gmailLink')} placeholder="https://mail.google.com/…" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button id="edit-contact-submit" type="submit" disabled={saving} className="btn-primary">
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to="/contacts" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

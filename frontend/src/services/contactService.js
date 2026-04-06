import api from './api'

const buildFormData = (contactData, imageFile) => {
  const fd = new FormData()
  fd.append('contact', new Blob([JSON.stringify(contactData)], { type: 'application/json' }))
  if (imageFile) fd.append('image', imageFile)
  return fd
}

const contactService = {
  getContacts: (page = 0, size = 9) =>
    api.get('/contacts', { params: { page, size } }).then(r => r.data),

  getFavorites: (page = 0, size = 9) =>
    api.get('/contacts/favorites', { params: { page, size } }).then(r => r.data),

  getContact: (id) =>
    api.get(`/contacts/${id}`).then(r => r.data),

  createContact: (contactData, imageFile) =>
    api.post('/contacts', buildFormData(contactData, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  updateContact: (id, contactData, imageFile) =>
    api.put(`/contacts/${id}`, buildFormData(contactData, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  deleteContact: (id) =>
    api.delete(`/contacts/${id}`).then(r => r.data),

  searchContacts: (field, keyword, page = 0, size = 9) =>
    api.get('/contacts/search', { params: { field, keyword, page, size } }).then(r => r.data),

  getCount: () =>
    api.get('/contacts/count').then(r => r.data),

  getFavoritesCount: () =>
    api.get('/contacts/favorites/count').then(r => r.data),

  getGroupStats: () =>
    api.get('/contacts/group-stats').then(r => r.data),

  getWeeklyStats: () =>
    api.get('/contacts/weekly-stats').then(r => r.data),
}

export default contactService

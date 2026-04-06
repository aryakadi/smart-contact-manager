import api from './api'

const userService = {
  getProfile: () =>
    api.get('/users/me').then(r => r.data),

  updateProfile: (name, profilePicFile) => {
    const fd = new FormData()
    if (name) fd.append('name', name)
    if (profilePicFile) fd.append('profilePic', profilePicFile)
    return api.put('/users/me', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  getDashboard: () =>
    api.get('/dashboard').then(r => r.data),
}

export default userService

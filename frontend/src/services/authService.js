import api from './api'

const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }).then(r => r.data),

  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
}

export default authService

import api from './api'

const authService = {
  register: (name, email, password) =>
    api.post('api/auth/register', { name, email, password }).then(r => r.data),

  login: (email, password) =>
    api.post('api/auth/login', { email, password }).then(r => r.data),
}

export default authService

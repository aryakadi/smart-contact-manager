import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ContactsPage from './pages/ContactsPage'
import AddContactPage from './pages/AddContactPage'
import EditContactPage from './pages/EditContactPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — all share the Layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index                    element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"         element={<DashboardPage />} />
          <Route path="contacts"          element={<ContactsPage />} />
          <Route path="contacts/add"      element={<AddContactPage />} />
          <Route path="contacts/edit/:id" element={<EditContactPage />} />
          <Route path="profile"           element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

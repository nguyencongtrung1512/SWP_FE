import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/auth.context'
import path from '../constants/path'

interface ProtectedRouteProps {
  requiredRole?: 'Parent' | 'Nurse' | 'Admin'
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={path.login} replace />
  }

  if (requiredRole) {
    // Check if user has the required role
    if (user?.role !== requiredRole) {
      // Redirect to appropriate home based on role
      if (user?.role === 'Parent') {
        return <Navigate to={path.home} replace />
      } else if (user?.role === 'Nurse') {
        return <Navigate to={path.BASE_NURSE} replace />
      } else if (user?.role === 'Admin') {
        return <Navigate to={path.BASE_ADMIN} replace />
      }
    }
  }

  // If authorized, render the child routes
  return <Outlet />
} 
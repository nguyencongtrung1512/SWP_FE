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
    if (user?.roleName !== requiredRole) {
      if (user?.roleName === 'Parent') {
        return <Navigate to={path.home} replace />
      } else if (user?.roleName === 'Nurse') {
        return <Navigate to={path.RESULTS_AFTER_VACCINATION} replace />
      } else if (user?.roleName === 'Admin') {
        return <Navigate to={path.USER_MANAGEMENT} replace />
      }
    }
  }

  return <Outlet />
} 
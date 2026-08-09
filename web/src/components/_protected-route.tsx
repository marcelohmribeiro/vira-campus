import type { ReactNode } from "react"
import { Navigate } from "react-router"
import useAuthStore from "src/store/authStore"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
export { ProtectedRoute }
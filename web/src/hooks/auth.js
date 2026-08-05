import { useNavigate } from "react-router";
import useAuthStore from "src/store/authStore";

const useAuth = () => {
    const navigate = useNavigate()
    const { isAuthenticated, login } = useAuthStore()

    const signin = () => {
        login()
        navigate("/auth/dashboard")
    }

    return {
        signin,
        isAuthenticated,
        login
    }
}

export default useAuth
export { useAuth }

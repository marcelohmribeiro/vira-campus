import { useNavigate } from "react-router";
import { useLoading } from "src/store/helpers/loading";
import { api } from "src/services/_api"
import useAuthStore from "src/store/authStore";

const useAuth = () => {
    const navigate = useNavigate()
    const { isAuthenticated, login, logout, user } = useAuthStore()
    const { loading, startLoading, stopLoading } = useLoading()

    const signin = async ({ email, senha }) => {
        try {
            startLoading()
            const { data } = await api.post('/auth/login', { email, senha })
            if (!data?.token) throw new Error('Token não encontrado.')
            login(data, data?.token)
            navigate('/auth/explorar')
            return data
        } finally {
            stopLoading()
        }
    }

    const signout = () => {
		logout()
		navigate('/login')
	}

    return {
        signin,
        signout,
        user,
        isAuthenticated: isAuthenticated(),
		isLoading: loading > 0,
    }

}

export default useAuth
export { useAuth }

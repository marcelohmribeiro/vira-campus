import axios from 'axios'
import { settings } from 'src/config'

const { API_URL, APP_KEY } = settings
const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use(async (config) => {
	try {
		const data = localStorage.getItem(APP_KEY)
		if (data) {
			const parsed = JSON.parse(data)
			// Suporta ambos os formatos: Zustand (com .state) e flat
			const token = parsed?.state?.token || parsed?.token || null
			if (token) config.headers.Authorization = token
		}
		return config
	} catch (error) {
		return config
	}
})

api.interceptors.response.use(null, async (error) => {
	if (error && error.response) {
		const { status, data } = error.response

		// Token inválido ou expirado (original)
		if (status === 415) {
			localStorage.removeItem(APP_KEY)
			window.location.reload()
		}

		// Token invalidado pelo administrador
		if (status === 401 && data?.code === 'TOKEN_INVALIDATED') {
			localStorage.removeItem(APP_KEY)
			alert('⚠️ Sua sessão foi invalidada pelo administrador.\n\nVocê será redirecionado para a tela de login.')
			window.location.href = '/login'
			return
		}

		// Usuário inativo
		if (status === 401 && data?.code === 'USER_INACTIVE') {
			localStorage.removeItem(APP_KEY)
			alert('⚠️ Sua conta foi desativada.\n\nEntre em contato com o administrador.')
			window.location.href = '/login'
			return
		}
	}

	if (error) {
		throw error
	}
})

export default api
export { api }
